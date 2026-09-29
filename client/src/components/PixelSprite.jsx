import { memo } from "react";
import { getSprite } from "../sprites/registry";
function PixelSprite({ sprite, cell = 3, className = "", style, crop = false }) {
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
    let x = 0;
    while (x < pixels[y].length) {
      const color = pixels[y][x];
      if (!color) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < pixels[y].length && pixels[y][x + run] === color) run++;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={color} shapeRendering="crispEdges" />
      );
      x += run;
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

export default memo(PixelSprite);
