// ============================================================
// PALETA DE PÍXELES para sprites
// Cada sprite es un array de strings de 16 chars; cada char es
// una clave de color. "." = transparente.
// ============================================================

export const PX = {
  ".": 0,
  K: "#1B1B2F", // negro / tinta
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
  E: "#6C757D", // gris
  F: "#B0B8C0", // gris claro
  A: "#00C2C7"  // cian
};

// Convierte un array de filas de texto en una grilla de colores.
export const P = (rows) => rows.map((row) => [...row].map((ch) => PX[ch] || 0));
