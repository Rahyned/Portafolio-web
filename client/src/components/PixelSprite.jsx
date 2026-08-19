import { getSprite } from "../sprites/registry";

// Renderiza un sprite pixel art como SVG a partir de una grilla.
// Si la clave no existe, devuelve null (el llamador decide el fallback).
export default function PixelSprite({ sprite, cell = 3, className = "", style }) {
  const pixels = typeof sprite === "string" ? getSprite(sprite) : sprite;
  if (!pixels) return null;

  const h = pixels.length;
  const w = pixels[0].length;
  const rects = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = pixels[y][x];
      if (!color) continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} shapeRendering="crispEdges" />
      );
    }
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      width={w * cell}
      height={h * cell}
      style={{ imageRendering: "pixelated", flexShrink: 0, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {rects}
    </svg>
  );
}
