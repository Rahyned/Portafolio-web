const UPSTASH_TIMEOUT_MS = 4_000;
const MEMORY_MAP_MAX = 5_000;

const memoryStores = new Map();

function getMemoryStore(name) {
  if (!memoryStores.has(name)) memoryStores.set(name, new Map());
  return memoryStores.get(name);
}

function pruneMemoryMap(map, maxEntries = MEMORY_MAP_MAX) {
  if (map.size <= maxEntries) return;
  const excess = map.size - maxEntries;
  const keys = map.keys();
  for (let i = 0; i < excess; i++) {
    const k = keys.next().value;
    if (k === undefined) break;
    map.delete(k);
  }
}

export function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashIncr(key, ttlSec) {
  const base = process.env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, "");
  const url = base.endsWith("/pipeline") ? base : `${base}/pipeline`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, ttlSec]]),
    signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const data = await res.json();
  const count = Array.isArray(data) ? data[0]?.result : undefined;
  if (typeof count !== "number") throw new Error("respuesta inesperada de Upstash");
  return count;
}

/**
 * Ventana fija: permite hasta `max` hits por `windowMs`.
 * Con Upstash si hay credenciales; si no, memoria acotada.
 */
export async function checkWindowLimit(ip, { keyPrefix, windowMs, max }) {
  if (upstashConfigured()) {
    try {
      const bucket = Math.floor(Date.now() / windowMs);
      const count = await upstashIncr(`${keyPrefix}:${ip}:${bucket}`, Math.ceil((windowMs / 1000) * 2));
      return count <= max;
    } catch (err) {
      console.error(`Upstash ventana (${keyPrefix}) no disponible, uso memoria:`, err.message);
    }
  }

  const store = getMemoryStore(keyPrefix);
  const now = Date.now();
  const hits = (store.get(ip) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  hits.push(now);
  store.set(ip, hits);
  pruneMemoryMap(store);
  return true;
}

/** Mínimo intervalo entre acciones (p. ej. 1 envío cada 30 s). */
export async function checkMinInterval(ip, { keyPrefix, intervalMs }) {
  if (upstashConfigured()) {
    try {
      const count = await upstashIncr(`${keyPrefix}:interval:${ip}`, Math.ceil(intervalMs / 1000) + 1);
      return count <= 1;
    } catch (err) {
      console.error(`Upstash intervalo (${keyPrefix}) no disponible, uso memoria:`, err.message);
    }
  }

  const store = getMemoryStore(`${keyPrefix}:interval`);
  const now = Date.now();
  const last = store.get(ip) || 0;
  if (now - last < intervalMs) return false;
  store.set(ip, now);
  pruneMemoryMap(store);
  return true;
}

/** Cuota diaria por IP (requiere Upstash para ser global; sin él solo memoria por instancia). */
export async function checkDailyLimit(ip, { keyPrefix, maxPerDay }) {
  if (upstashConfigured()) {
    try {
      const day = new Date().toISOString().slice(0, 10);
      const count = await upstashIncr(`${keyPrefix}:day:${ip}:${day}`, 60 * 60 * 48);
      return count <= maxPerDay;
    } catch (err) {
      console.error(`Upstash cuota diaria (${keyPrefix}) no disponible:`, err.message);
      throw err;
    }
  }

  const store = getMemoryStore(`${keyPrefix}:day`);
  const day = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${day}`;
  const count = (store.get(key) || 0) + 1;
  store.set(key, count);
  pruneMemoryMap(store);
  return count <= maxPerDay;
}
