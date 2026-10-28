import { POKEBALL, COIN, STAR } from "./trainer";
import { OAK } from "./oak";

// Nota: hero.js (MI_SPRITE) y boxes.js (BOX_*) no se importan a propósito:
// no se usan en ningún componente y solo engordarían el bundle.

// Recorta filas/columnas transparentes y recentra el contenido en la grilla
// original, para que cada icono quede con margen igual en los 4 bordes.
export const centerSprite = (grid) => {
  const h = grid.length;
  const w = grid[0].length;
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return grid;
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const offsetX = Math.floor((w - cw) / 2);
  const offsetY = Math.floor((h - ch) / 2);
  const out = Array.from({ length: h }, () => new Array(w).fill(0));
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      out[offsetY + y][offsetX + x] = grid[minY + y][minX + x];
    }
  }
  return out;
};

// Registro global: clave -> grilla de píxeles.
// Las claves de proyectos coinciden con project.id en data/projects.json.
export const SPRITES = {
  pokeball: centerSprite(POKEBALL),
  coin: centerSprite(COIN),
  star: centerSprite(STAR),
  oak: centerSprite(OAK)
};

export const getSprite = (key) => SPRITES[key] || null;

// Los sprites de proyectos se cargan como SVG desde public/sprites/.
// Cada archivo se llama sprite-<id>.svg (ej: sprite-riodent.svg).
const PROJECT_IDS = [
  "organizador",
  "abstractoshopp",
  "riodent",
  "pixel-editor",
  "solutionscars",
  "stella",
  "butterflies",
  "libreta"
];

// Devuelve la ruta del SVG del proyecto, o null si no tiene sprite.
export const getProjectSprite = (id) =>
  PROJECT_IDS.includes(id) ? `/sprites/sprite-${id}.svg` : null;