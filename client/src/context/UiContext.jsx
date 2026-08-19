import { createContext, useContext, useEffect, useState, useCallback } from "react";

const UiContext = createContext(null);
const CRT_KEY = "portfolio_crt";
const CURSOR_KEY = "portfolio_pixel_cursor";

export function UiProvider({ children }) {
  const [crt, setCrt] = useState(() => localStorage.getItem(CRT_KEY) !== "false");
  const [pixelCursor, setPixelCursor] = useState(() => localStorage.getItem(CURSOR_KEY) !== "false");

  useEffect(() => {
    localStorage.setItem(CRT_KEY, String(crt));
    document.documentElement.classList.toggle("crt-on", crt);
  }, [crt]);

  useEffect(() => {
    localStorage.setItem(CURSOR_KEY, String(pixelCursor));
    document.documentElement.classList.toggle("pixel-cursor-on", pixelCursor);
  }, [pixelCursor]);

  const toggleCrt = useCallback(() => setCrt((v) => !v), []);
  const togglePixelCursor = useCallback(() => setPixelCursor((v) => !v), []);

  return (
    <UiContext.Provider value={{ crt, pixelCursor, toggleCrt, togglePixelCursor }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi() {
  return useContext(UiContext);
}
