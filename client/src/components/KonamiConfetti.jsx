import { useEffect, useState } from "react";

const COLORS = ["#FF4D6D", "#FFC53D", "#00C2C7", "#7BD389", "#3A86FF", "#9B5DE5", "#FF7BAC", "#FFFFFF"];

// Explosión de confetti pixelado. Se monta con un key distinto por trigger
// y se autolimpia al terminar la caída.
export default function KonamiConfetti() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const pieces = Array.from({ length: 48 }, (_, i) => ({
    left: Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: COLORS[i % COLORS.length],
    duration: 1.4 + Math.random() * 0.9,
    delay: Math.random() * 0.4,
    round: Math.random() > 0.5
  }));

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.6,
            background: p.color,
            borderRadius: p.round ? "50%" : "0",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}
