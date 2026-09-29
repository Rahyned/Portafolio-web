// ============================================================
// PALETA DE PÍXELES para sprites
// Cada sprite es un array de strings; cada char es una clave de
// color. "." = transparente.
// ============================================================

export const PX = {
  ".": 0,
  "0": "#2B2B33",
  "1": "#ababab",
  "2": "#4F4F5C",
  "3": "#7C7C8C",
  "4": "#A6A6B4",
  "5": "#34517A",
  "6": "#3E5E8C",
  "7": "#54769F",
  "8": "#6B8CB5",
  K: "#000000", // negro / tinta
  W: "#FFFFFF", // blanco
  R: "#E63946", // rojo
  O: "#F8961E", // naranja
  G: "#FFD166", // dorado
  Y: "#FFE66D", // amarillo
  N: "#2A9D8F", // verde
  L: "#7BD389", // verde claro
  B: "#3A86FF", // azul
  C: "#90CAF9", // azul claro
  P: "#FF7BAC", // rosa
  V: "#9B5DE5", // violeta
  T: "#8B5A2B", // marrón
  H: "#C68958", // marrón claro
  E: "#8f8f8f", // gris
  F: "#B0B8C0", // gris claro
  A: "#00C2C7", // cian
  D: "#722F37",
  I: "#FF0000",
  J: "#FF8C00",
  Q: "#FFD700",
  U: "#9ACD32",
  M: "#228B22",
  X: "#00BFFF",
  Z: "#4169E1",
  S: "#FF69B4",
  "%": "#800080",
  "!": "#FF00FF",
  "$": "#A0522D",
  "&": "#F5DEB3",
  "#": "#555555",
  "@": "#C0C0C0",
  "9": "#000101",
  "^": "#D2D2E6",
  "=": "#8282A8"
};

// Convierte un array de filas de texto en una grilla de colores.
export const P = (rows) => rows.map((row) => [...row].map((ch) => PX[ch] || 0));
