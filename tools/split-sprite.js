// ============================================================
// SPLIT-SPRITE - Recorta sprites de un PNG sprite-sheet.
// Sin dependencias: decodifica PNG (RGBA, filtros 0-4) y
// re-encoda las regiones recortadas (trim al contenido real).
//
// Uso:
//   node tools/split-sprite.js <input.png> <outDir>
// ============================================================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ---------- Decodificador PNG (solo RGB/RGBA 8-bit, sin interlace) ----------
function decodePng(buf) {
  let pos = 8;
  let idat = [];
  let w = 0, h = 0, bitDepth = 0, colorType = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    if (type === "IHDR") {
      w = buf.readUInt32BE(pos + 8);
      h = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === "IDAT") {
      idat.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  if (colorType !== 6 && colorType !== 2) {
    throw new Error(`Color type ${colorType} no soportado (solo 6 RGBA o 2 RGB)`);
  }
  if (bitDepth !== 8) throw new Error("Solo bit depth 8");

  const ch = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const px = Buffer.alloc(w * h * ch);
  let prev = Buffer.alloc(stride);

  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    const row = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = Buffer.from(row);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[x - ch] : 0;
      const c = prev[x];
      const b = x >= ch ? prev[x - ch] : 0;
      let v = out[x];
      if (ft === 1) v = (v + a) & 255;
      else if (ft === 2) v = (v + c) & 255;
      else if (ft === 3) v = (v + ((a + c) >> 1)) & 255;
      else if (ft === 4) {
        const p = a + c - b;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      out[x] = v;
    }
    out.copy(px, y * stride);
    prev = out;
  }
  return { w, h, ch, px };
}

// ---------- Codificador PNG (RGBA 8-bit, filtro 0) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(w, h, px, ch) {
  const raw = Buffer.alloc(h * (w * ch + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * ch + 1)] = 0; // filtro None
    px.copy(raw, y * (w * ch + 1) + 1, y * w * ch, (y + 1) * w * ch);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

// ---------- Utilidades ----------
function cropRegion(decoded, x, y, w, h) {
  const { px, ch, w: srcW } = decoded;
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(srcW, Math.ceil(x + w));
  const y1 = Math.min(decoded.h, Math.ceil(y + h));
  const outW = x1 - x0;
  const outH = y1 - y0;
  const out = Buffer.alloc(outW * outH * ch);
  for (let ry = 0; ry < outH; ry++) {
    const srcStart = (y0 + ry) * srcW * ch + x0 * ch;
    px.copy(out, ry * outW * ch, srcStart, srcStart + outW * ch);
  }
  return { px: out, w: outW, h: outH, ch };
}

function trimAlpha(region, alphaThreshold = 25) {
  const { px, w, h, ch } = region;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * ch + (ch === 4 ? 3 : 0)] > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null; // vacío
  return cropRegion(region, minX, minY, maxX - minX + 1, maxY - minY + 1);
}

// ---------- Detección de marco (cuadrado con contenido hueco) ----------
// Encuentra los 4 bordes de un frame rectangular opaco que encierra un
// interior casi vacío, dentro de una caja de búsqueda. Devuelve {x,y,w,h}.
function detectFrame(decoded, box) {
  const { px, ch, w: W } = decoded;
  const alpha = (x, y) => px[(y * W + x) * ch + (ch === 4 ? 3 : 0)] > 25;
  const SPARSE = 0.18;
  const BORDER = 5;

  const bandY0 = box.y + Math.floor(box.h * 0.3);
  const bandY1 = box.y + Math.floor(box.h * 0.7);

  // densidad por columna en la banda vertical central
  const col = [];
  for (let x = box.x; x < box.x + box.w; x++) {
    let cnt = 0;
    for (let y = bandY0; y <= bandY1; y++) if (alpha(x, y)) cnt++;
    col.push(cnt / (bandY1 - bandY0 + 1));
  }

  let leftInner = -1, rightInner = -1;
  for (let x = 0; x < col.length; x++) { if (col[x] < SPARSE) { leftInner = x; break; } }
  for (let x = col.length - 1; x >= 0; x--) { if (col[x] < SPARSE) { rightInner = x; break; } }
  if (leftInner < 0 || rightInner < 0) return null;

  const xb0 = box.x + leftInner;
  const xb1 = box.x + rightInner;
  const row = [];
  for (let y = box.y; y < box.y + box.h; y++) {
    let cnt = 0;
    for (let x = xb0; x <= xb1; x++) if (alpha(x, y)) cnt++;
    row.push(cnt / (xb1 - xb0 + 1));
  }

  let topInner = -1, bottomInner = -1;
  for (let y = 0; y < row.length; y++) { if (row[y] < SPARSE) { topInner = y; break; } }
  for (let y = row.length - 1; y >= 0; y--) { if (row[y] < SPARSE) { bottomInner = y; break; } }
  if (topInner < 0 || bottomInner < 0) return null;

  return {
    x: box.x + leftInner - BORDER,
    y: box.y + topInner - BORDER,
    w: (box.x + rightInner + BORDER) - (box.x + leftInner - BORDER) + 1,
    h: (box.y + bottomInner + BORDER) - (box.y + topInner - BORDER) + 1
  };
}

// ---------- Main ----------
const input = process.argv[2];
const outDir = process.argv[3];
if (!input || !outDir) {
  console.error("Uso: node tools/split-sprite.js <input.png> <outDir>");
  process.exit(1);
}

const src = decodePng(fs.readFileSync(input));
console.log(`Origen: ${src.w}x${src.h} (ch=${src.ch})`);

fs.mkdirSync(outDir, { recursive: true });

// Regiones por defecto (según análisis del sheet):
// - frame 1 (primera figura cuerpo completo, izquierda)
// - cuadrado de la cabeza (abajo a la derecha) — coords exactas del marco
const JOBS = [
  { name: "trainer-hero.png", x: 0, y: 0, w: 248, h: 479, mode: "trim" },
  { name: "trainer-card.png", x: 858, y: 795, w: 79, h: 115, mode: "trim" }
];

for (const job of JOBS) {
  let region;
  if (job.mode === "frame") {
    const frame = detectFrame(src, job);
    if (!frame) {
      console.log(`⚠  ${job.name}: no se detectó marco, se usa trim genérico`);
      region = trimAlpha(cropRegion(src, job.x, job.y, job.w, job.h));
    } else {
      region = cropRegion(src, frame.x, frame.y, frame.w, frame.h);
      console.log(`  marco detectado: x=${frame.x} y=${frame.y} ${frame.w}x${frame.h}`);
    }
  } else {
    region = trimAlpha(cropRegion(src, job.x, job.y, job.w, job.h));
  }
  if (!region) {
    console.log(`⚠  ${job.name}: región vacía, se omite`);
    continue;
  }
  const png = encodePng(region.w, region.h, region.px, region.ch);
  const outFile = path.join(outDir, job.name);
  fs.writeFileSync(outFile, png);
  console.log(`✔ ${job.name}: ${region.w}x${region.h} -> ${outFile}`);
}

// Copia de referencia del sheet original
fs.copyFileSync(input, path.join(outDir, "trainer-sheet.png"));
console.log("✔ trainer-sheet.png (referencia)");
