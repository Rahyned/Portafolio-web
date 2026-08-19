import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { FALLBACK_DATA } from "../data/fallback";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/data/projects.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        if (active) setData(FALLBACK_DATA);
      }
    })();

    return () => { active = false; };
  }, []);

  const track = useCallback((name, params) => {
    if (window.gtag) window.gtag("event", name, params || {});
  }, []);

  if (!data) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-pixel)",
        fontSize: "12px"
      }}>
        <span style={{ fontSize: "40px" }} aria-hidden="true">👾</span>
        <span>CARGANDO...</span>
      </div>
    );
  }

  return <DataContext.Provider value={{ data, track }}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
