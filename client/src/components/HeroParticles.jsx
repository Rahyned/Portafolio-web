import { useMemo } from "react";
import PixelSprite from "./PixelSprite";

// Partículas pixeladas que flotan en el hero.
const PARTICLES = [
  { left: 6, size: 10, dur: 11, delay: 0, type: "square", color: "var(--accent)" },
  { left: 14, size: 7, dur: 13, delay: 1.2, type: "square", color: "var(--accent2)" },
  { left: 22, size: 12, dur: 9, delay: 0.4, type: "square", color: "var(--accent-bright)" },
  { left: 30, size: 6, dur: 14, delay: 2.1, type: "square", color: "var(--accent)" },
  { left: 38, size: 8, dur: 10, delay: 0.8, type: "coin" },
  { left: 46, size: 9, dur: 15, delay: 3, type: "square", color: "var(--accent2)" },
  { left: 54, size: 7, dur: 9.5, delay: 1.6, type: "star" },
  { left: 62, size: 11, dur: 12, delay: 0.2, type: "square", color: "var(--accent)" },
  { left: 70, size: 6, dur: 13.5, delay: 2.6, type: "square", color: "var(--accent-bright)" },
  { left: 78, size: 9, dur: 10.5, delay: 1, type: "coin" },
  { left: 86, size: 8, dur: 14.5, delay: 0.6, type: "square", color: "var(--accent2)" },
  { left: 93, size: 10, dur: 9.8, delay: 1.8, type: "ball" }
];

export default function HeroParticles() {
  const items = useMemo(() => PARTICLES, []);

  return (
    <div className="p-particles" aria-hidden="true">
      {items.map((p, i) => {
        const baseStyle = {
          left: `${p.left}%`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`
        };
        if (p.type === "square") {
          return (
            <span
              key={i}
              className="p-particle"
              style={{ ...baseStyle, width: p.size, height: p.size, background: p.color }}
            />
          );
        }
        const sprite = p.type === "coin" ? "coin" : p.type === "star" ? "star" : "pokeball";
        return (
          <PixelSprite
            key={i}
            sprite={sprite}
            cell={p.size / 8}
            className="p-particle"
            style={baseStyle}
          />
        );
      })}
    </div>
  );
}
