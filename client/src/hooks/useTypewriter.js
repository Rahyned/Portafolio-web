import { useEffect, useRef, useState, useCallback } from "react";

// Efecto de escritura letra por letra. Se saltea con cualquier
// tecla o clic mientras está activo.
export function useTypewriter(text, { speed = 28, start = true } = {}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const skipRef = useRef(false);

  const skip = useCallback(() => {
    skipRef.current = true;
    setIndex(text.length);
    setDone(true);
  }, [text]);

  useEffect(() => {
    if (!start) return;
    skipRef.current = false;
    setIndex(0);
    setDone(false);

    let timer = null;

    const onKey = (e) => {
      if (e.key === "Escape") return;
      e.preventDefault();
      skip();
    };
    const onClick = () => skip();

    document.addEventListener("keydown", onKey, true);
    document.addEventListener("click", onClick, true);

    timer = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= text.length) {
          clearInterval(timer);
          setDone(true);
          document.removeEventListener("keydown", onKey, true);
          document.removeEventListener("click", onClick, true);
          return text.length;
        }
        return i + 1;
      });
    }, speed);

    return () => {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [text, speed, start, skip]);

  return { displayed: text.slice(0, index), done, skip };
}
