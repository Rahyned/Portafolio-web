// ============================================================
// COPY-DIST - Copia archivos de la raíz al build de Vercel.
// Vercel solo sirve client/dist; estos archivos no viven ahí.
// Se ejecuta después de `vite build`.
// ============================================================

import { cpSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(__dirname, "dist");

const targets = [
  { from: path.join(ROOT, "cv.html"), to: path.join(DIST, "cv.html") },
  { from: path.join(ROOT, "css", "cv.css"), to: path.join(DIST, "css", "cv.css") },
  { from: path.join(ROOT, "js", "cv.js"), to: path.join(DIST, "js", "cv.js") },
  { from: path.join(ROOT, "data", "projects.json"), to: path.join(DIST, "data", "projects.json") },
  { from: path.join(ROOT, "data", "projects.js"), to: path.join(DIST, "data", "projects.js") }
];

for (const { from, to } of targets) {
  if (!existsSync(from)) {
    console.warn(`  ⚠ No existe: ${path.relative(ROOT, from)}`);
    continue;
  }
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to);
  console.log(`  ✔ ${path.relative(ROOT, from)} → dist/${path.relative(DIST, to)}`);
}

console.log("  ✔ Archivos copiados al build.");