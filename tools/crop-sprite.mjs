// Recorta el viewBox de un sprite SVG exportado (256x256 con padding)
// al bounding box real del contenido. Uso:
//   node tools/crop-sprite.mjs [ruta]  (default: client/public/sprites/mi_sprite-f1.svg)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const arg = process.argv[2];
const path = arg
  ? fileURLToPath(new URL(arg, root))
  : fileURLToPath(new URL("client/public/sprites/mi_sprite-f1.svg", root));
let s = readFileSync(path, "utf8");

if (!s.trimEnd().endsWith("</svg>")) {
  console.error("ABORT: archivo truncado");
  process.exit(1);
}

const re = /<rect x="(\d+)" y="(\d+)"/g;
let m, n = 0, minX = Infinity, maxX = -1, minY = Infinity, maxY = -1;
while ((m = re.exec(s))) {
  n++;
  const x = +m[1], y = +m[2];
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
if (maxX < 0) {
  console.error("ABORT: sin rects");
  process.exit(1);
}

const w = maxX - minX + 1;
const h = maxY - minY + 1;
const headRe = /^<svg ([^>]*?)width="\d+" height="\d+"([^>]*?)viewBox="[^"]*"/;
if (!headRe.test(s)) {
  console.error("ABORT: cabecera inesperada");
  process.exit(1);
}
s = s.replace(
  headRe,
  `<svg $1width="${w}" height="${h}"$2viewBox="${minX} ${minY} ${w} ${h}"`
);
writeFileSync(path, s);
console.log(`OK: ${path} -> viewBox "${minX} ${minY} ${w} ${h}" (${n} rects)`);
