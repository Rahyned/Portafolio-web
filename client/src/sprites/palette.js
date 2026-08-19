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
  A: "#00C2C7", // cian
  "0": "#0E0E1A", // tinta profunda (outline)
  "$": "#14141F", // tinta
  "#": "#0A0A12", // negro
  D: "#26324A",   // azul pizarra oscuro
  "&": "#00C2C7", // cian brillante (visor)
  "@": "#4C6A9C", // azul medio
  "1": "#9FB4D8", // azul-gris claro
  "2": "#C4CFE0", // gris azulado claro
  "3": "#8E9BB3", // gris medio
  "4": "#E8EDF5", // casi blanco
  "5": "#3B5B8C", // azul medio
  "6": "#2E6E8C", // azul/teal
  "7": "#24576E", // teal oscuro
  "8": "#1E3A52", // azul marino
  "9": "#182C40"  // navy
};

// Convierte un array de filas de texto en una grilla de colores.
export const P = (rows) => rows.map((row) => [...row].map((ch) => PX[ch] || 0));
