// ============================================================
// API SERVERLESS - POST /api/chat (Vercel) — "Profesor Oak"
// Backend agnóstico al proveedor de IA: cualquier endpoint
// compatible con OpenAI se configura con 3 env vars:
//   LLM_BASE_URL (ej: https://api.groq.com/openai/v1)
//   LLM_API_KEY
//   LLM_MODEL
// Sin LLM configurado responde 503 → el frontend muestra un
// mensaje elegante (mismo contrato que /api/contact).
// Validación + rate limit en memoria. Respuesta en streaming SSE.
// ============================================================

import { FALLBACK_DATA } from "../src/data/fallback.js";
import { CONTENT_EN } from "../src/i18n/content.js";

const MAX_MESSAGES = 10;
const MAX_CONTENT = 500;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;
const UPSTREAM_TIMEOUT_MS = 60_000;

// Rate limit simple (en memoria): máximo RATE_MAX mensajes por ventana por IP
const rateLimit = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const hits = (rateLimit.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return false;
  hits.push(now);
  rateLimit.set(ip, hits);
  if (rateLimit.size > 5000) rateLimit.clear();
  return true;
}

function llmConfigured() {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL);
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  return req.headers["x-real-ip"] || "unknown";
}

function validateBody(body) {
  const errors = [];
  const { messages, lang } = body || {};

  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    errors.push("messages");
  } else {
    for (const m of messages) {
      if (!m || (m.role !== "user" && m.role !== "assistant")) {
        errors.push("role");
        break;
      }
      if (typeof m.content !== "string" || !m.content.trim() || m.content.length > MAX_CONTENT) {
        errors.push("content");
        break;
      }
    }
  }
  if (lang !== "es" && lang !== "en") errors.push("lang");

  return errors;
}

// ---- Knowledge base: se serializa a texto plano desde los datos
// canónicos del portafolio (mismos que consume la web).
function knowledgeEs() {
  const { PROFILE, PROJECT_BOXES, SERVICES, SKILLS_LIST, CONTACT_INFO } = FALLBACK_DATA;
  const lines = [];
  lines.push("## Perfil");
  lines.push(
    `${PROFILE.name} — ${PROFILE.class}. Nivel ${PROFILE.level}, ${PROFILE.expYears} años de experiencia, ` +
    `${PROFILE.completedProjects} proyectos completados. Ubicación: ${PROFILE.location}. Estado: ${PROFILE.status}.`
  );
  lines.push(`Bio: ${PROFILE.bio}`);
  lines.push("");
  lines.push("## Proyectos");
  for (const box of PROJECT_BOXES) {
    lines.push(`### ${box.label}`);
    for (const p of box.projects) {
      lines.push(
        `- ${p.title} (${p.category}, ${p.timeline}, ${p.status}). Problema: ${p.problem} ` +
        `Solución: ${p.solution} Resultado: ${p.result} Stack: ${p.stack.join(", ")}.`
      );
    }
  }
  lines.push("");
  lines.push("## Servicios");
  for (const s of SERVICES) {
    lines.push(`- ${s.title} (${s.type}): ${s.description} Incluye: ${s.includes.join("; ")}. Stack: ${s.stack.join(", ")}.`);
  }
  lines.push("");
  lines.push("## Skills");
  lines.push(SKILLS_LIST.join(" | "));
  lines.push("");
  lines.push(`## Contacto: email ${CONTACT_INFO.email}, LinkedIn ${CONTACT_INFO.linkedin}, GitHub ${CONTACT_INFO.github}, teléfono ${CONTACT_INFO.phone}`);
  return lines.join("\n");
}

function knowledgeEn() {
  const base = FALLBACK_DATA;
  const en = CONTENT_EN;
  const lines = [];
  lines.push("## Profile");
  lines.push(
    `${base.PROFILE.name} — ${en.PROFILE.class}. Level ${base.PROFILE.level}, ${base.PROFILE.expYears}+ years of experience, ` +
    `${base.PROFILE.completedProjects} completed projects. Location: ${base.PROFILE.location}. Status: ${en.PROFILE.status}.`
  );
  lines.push(`Bio: ${en.PROFILE.bio}`);
  lines.push("");
  lines.push("## Projects");
  for (const box of base.PROJECT_BOXES) {
    lines.push(`### ${en.BOXES[box.id] ? en.BOXES[box.id].label : box.label}`);
    for (const p of box.projects) {
      const e = en.PROJECTS[p.id] || {};
      lines.push(
        `- ${p.title} (${e.category || p.category}, ${e.timeline || p.timeline}, ${e.status || p.status}). ` +
        `Problem: ${e.problem || p.problem} Solution: ${e.solution || p.solution} Result: ${e.result || p.result} ` +
        `Stack: ${p.stack.join(", ")}.`
      );
    }
  }
  lines.push("");
  lines.push("## Services");
  for (const s of base.SERVICES) {
    const e = en.SERVICES[s.id] || {};
    lines.push(`- ${e.title || s.title}: ${e.description || s.description} Includes: ${(e.includes || s.includes).join("; ")}. Stack: ${s.stack.join(", ")}.`);
  }
  lines.push("");
  lines.push("## Skills");
  lines.push((en.SKILLS || base.SKILLS_LIST).join(" | "));
  lines.push("");
  lines.push(`## Contact: email ${base.CONTACT_INFO.email}, LinkedIn ${base.CONTACT_INFO.linkedin}, GitHub ${base.CONTACT_INFO.github}`);
  return lines.join("\n");
}

function systemPrompt(lang) {
  const { PROFILE, CONTACT_INFO } = FALLBACK_DATA;
  if (lang === "en") {
    return [
      `You are Professor Oak, the friendly assistant of ${PROFILE.name}'s portfolio website.`,
      "Answer ONLY in English, in a warm, clear and concise way (max ~120 words), plain text (no markdown).",
      "Use ONLY the knowledge base below. If the info is not there, say you don't have that data — never invent projects, dates, metrics or experience.",
      "For commercial inquiries, suggest writing to " + CONTACT_INFO.email + " or using the contact form on the site.",
      "Greet like Professor Oak once at the start. Stay on topic: Lautaro, his projects, services, skills and how to contact him.",
      "",
      knowledgeEn()
    ].join("\n");
  }
  return [
    `Sos el Profesor Oak, asistente amigable del portafolio de ${PROFILE.name}.`,
    "Respondé SIEMPRE en español, con tono cálido, claro y conciso (máximo ~120 palabras), texto plano (sin markdown).",
    "Usá SOLO la base de conocimiento de abajo. Si la información no está, decí que no tenés ese dato — nunca inventes proyectos, fechas, métricas ni experiencia.",
    "Para consultas comerciales, sugerí escribir a " + CONTACT_INFO.email + " o usar el formulario de contacto del sitio.",
    "Saludá como el Profesor Oak una sola vez al inicio. Mantenete en el tema: Lautaro, sus proyectos, servicios, skills y cómo contactarlo.",
    "",
    knowledgeEs()
  ].join("\n");
}

// Reenvía el streaming del upstream (formato OpenAI SSE) hacia el
// cliente, extrayendo solo los deltas de contenido.
async function pipeUpstream(upstreamRes, res) {
  const reader = upstreamRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const send = (obj) => {
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() || "";
      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices && json.choices[0] && json.choices[0].delta
            ? json.choices[0].delta.content
            : null;
          if (typeof delta === "string" && delta.length > 0) send({ delta });
        } catch {
          // fragmento inválido: se ignora
        }
      }
    }
    send({ done: true });
  } catch (err) {
    console.error("Error leyendo upstream LLM:", err.message);
    send({ error: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const errors = validateBody(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({ ok: false, error: "Demasiadas consultas. Esperá un momento." });
  }

  if (!llmConfigured()) {
    return res.status(503).json({ ok: false, error: "Asistente no disponible todavía." });
  }

  const lang = req.body.lang;
  const messages = [
    { role: "system", content: systemPrompt(lang) },
    ...req.body.messages.map((m) => ({ role: m.role, content: m.content.trim() }))
  ];

  let upstreamRes;
  try {
    upstreamRes = await fetch(`${process.env.LLM_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 600,
        stream: true
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });
  } catch (err) {
    console.error("Error conectando con el LLM:", err.message);
    return res.status(502).json({ ok: false, error: "El asistente no respondió.", debug: `fetch: ${err.message}`.slice(0, 250) });
  }

  if (!upstreamRes.ok || !upstreamRes.body) {
    const detail = await upstreamRes.text().catch(() => "");
    console.error(`LLM upstream ${upstreamRes.status}:`, detail.slice(0, 300));
    return res.status(502).json({
      ok: false,
      error: "El asistente no respondió.",
      debug: `upstream ${upstreamRes.status}: ${detail.slice(0, 250)}`
    });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });

  await pipeUpstream(upstreamRes, res);
  res.end();
}
