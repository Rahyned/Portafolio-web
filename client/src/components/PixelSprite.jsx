import { getSprite } from "../sprites/registry";
export default function PixelSprite({ sprite, cell = 3, className = "", style, crop = false }) {
  const pixels = typeof sprite === "string" ? getSprite(sprite) : sprite;
  if (!pixels) return null;

  let w = pixels[0].length;
  let h = pixels.length;
  let vx = 0;
  let vy = 0;

  if (crop) {
    let minX = w, maxX = -1, minY = h, maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (pixels[y][x]) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX >= 0) {
      vx = minX;
      vy = minY;
      w = maxX - minX + 1;
      h = maxY - minY + 1;
    }
  }

  const rects = [];
  for (let y = 0; y < pixels.length; y++) {
    for (let x = 0; x < pixels[0].length; x++) {
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
      viewBox={`${vx} ${vy} ${w} ${h}`}
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
