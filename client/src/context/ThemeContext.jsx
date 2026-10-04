import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);

const THEMES = ["arcade", "dark"];
const STORAGE_KEY = "portfolio_theme";

/* Destello que acompaña el cambio (ver animations.css: .theme-glint).
   El fundido del documento lo hace el navegador con View Transitions
   API; el timer solo dura lo que vive la banda en pantalla. */
const GLINT_MS = 560;

const prefersReduced = () =>
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : "arcade";
  });
  const [glinting, setGlinting] = useState(false);
  const glintTimer = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(...THEMES.map((t) => `theme-${t}`));
    html.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => () => clearTimeout(glintTimer.current), []);

  const setTheme = useCallback(
    (next) => {
      const target = THEMES.includes(next) ? next : "arcade";
      /* Mismo tema, o destello todavía en curso: no arrancamos otro. */
      if (target === theme || glinting) return;

      /* Reduced-motion: cambio directo, sin destello y sin fundido. */
      if (prefersReduced()) {
        setThemeState(target);
        return;
      }

      setGlinting(true);
      clearTimeout(glintTimer.current);
      glintTimer.current = setTimeout(() => setGlinting(false), GLINT_MS);

      /* Sin View Transitions el cambio queda directo (el destello
         igual cruza). flushSync deja el DOM actualizado antes de que el
         navegador capture el snapshot nuevo — sin eso, fundiría el
         estado viejo contra sí mismo. */
      if (!document.startViewTransition) {
        setThemeState(target);
        return;
      }
      document.startViewTransition(() => {
        flushSync(() => setThemeState(target));
      });
    },
    [theme, glinting]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      {glinting && <div className="theme-glint" aria-hidden="true" />}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
