import { useEffect, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Cuenta de 0 hasta `target` cuando `active` pasa a true (una sola vez).
 * Devuelve el valor actual: si `target` no es un número finito, lo devuelve
 * tal cual porque no hay nada que animar.
 */
export function useCountUp(target, active, duration = 900) {
  const isNumber = typeof target === "number" && Number.isFinite(target);
  const [value, setValue] = useState(isNumber ? 0 : target);

  useEffect(() => {
    if (!isNumber) {
      setValue(target);
      return undefined;
    }
    if (!active) return undefined;

    if (prefersReduced()) {
      setValue(target);
      return undefined;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, isNumber]);

  return value;
}
