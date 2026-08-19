import { useEffect, useRef, useState } from "react";
import PixelSprite from "./PixelSprite";

const DURATION = 1800; // ms total del boot (si hay movimiento permitido)

export default function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(onDone, 450);
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(100);
      setTimeout(finish, 300);
      return;
    }

    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      // easing: aceleración al inicio, pausa en 99%
      const eased = t < 0.9 ? t * 1.11 : 0.99;
      setProgress(Math.round(eased * 100));
      if (t >= 1) {
        setProgress(100);
        setTimeout(finish, 250);
      } else {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);

    // Failsafe: el boot nunca debe bloquear la web aunque rAF se atrase.
    const failSafe = setTimeout(finish, DURATION + 1600);

    const skip = () => finish();
    document.addEventListener("keydown", skip);
    document.addEventListener("click", skip);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
      document.removeEventListener("keydown", skip);
      document.removeEventListener("click", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLogo = progress >= 18;

  return (
    <div className={`boot-screen${leaving ? " leaving" : ""}`} role="status" aria-label="Encendiendo">
      <div className="boot-inner">
        <div className={`boot-logo${showLogo ? " in" : ""}`}>
          <PixelSprite sprite="pokeball" cell={4} className="boot-logo-sprite" />
          <span className="boot-logo-text">LAUTARO<span>.DEV</span></span>
        </div>

        <p className="boot-status" aria-live="polite">
          {progress < 100 ? "POWER ON ▸ INICIANDO SISTEMA" : "¡SISTEMA LISTO!"}
          <span className="boot-blink">▌</span>
        </p>

        <div className="boot-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          <div className="boot-bar-fill" style={{ width: `${progress}%` }}>
            <span className="boot-bar-seg" />
          </div>
        </div>

        <p className="boot-hint">CLIC O TECLA PARA SALTAR</p>
      </div>
    </div>
  );
}
