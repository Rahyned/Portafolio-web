import { useEffect, useRef } from "react";

// Detecta una secuencia de teclas (ej: Konami) y llama onTrigger.
export function useKonami(sequence, onTrigger) {
  const indexRef = useRef(0);
  const cbRef = useRef(onTrigger);
  cbRef.current = onTrigger;

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[indexRef.current]) {
        indexRef.current++;
        if (indexRef.current === sequence.length) {
          indexRef.current = 0;
          cbRef.current();
        }
      } else {
        indexRef.current = key === sequence[0] ? 1 : 0;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sequence]);
}
