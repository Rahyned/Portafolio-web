import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { FALLBACK_DATA } from "../data/fallback";
import { useLanguage } from "./LanguageContext";
import { CONTENT_EN } from "../i18n/content";

const DataContext = createContext(null);

function localizeData(data, lang) {
  if (lang !== "en" || !data) return data;

  const localized = JSON.parse(JSON.stringify(data));

  if (localized.PROFILE && CONTENT_EN.PROFILE) {
    localized.PROFILE = {
      ...localized.PROFILE,
      ...CONTENT_EN.PROFILE
    };
  }

  if (Array.isArray(localized.PROJECT_BOXES)) {
    localized.PROJECT_BOXES = localized.PROJECT_BOXES.map((box) => {
      const boxEn = CONTENT_EN.BOXES?.[box.id];
      const projects = Array.isArray(box.projects)
        ? box.projects.map((project) => {
            const projEn = CONTENT_EN.PROJECTS?.[project.id];
            return projEn ? { ...project, ...projEn } : project;
          })
        : box.projects;
      return boxEn ? { ...box, ...boxEn, projects } : { ...box, projects };
    });
  }

  if (Array.isArray(localized.SERVICES)) {
    localized.SERVICES = localized.SERVICES.map((service) => {
      const serviceEn = CONTENT_EN.SERVICES?.[service.id];
      return serviceEn ? { ...service, ...serviceEn } : service;
    });
  }

  if (CONTENT_EN.SKILLS) {
    localized.SKILLS_LIST = CONTENT_EN.SKILLS;
  }

  return localized;
}

export function DataProvider({ children }) {
  const { lang } = useLanguage();
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

  const localizedData = useMemo(() => localizeData(data, lang), [data, lang]);

  if (!localizedData) {
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

  return <DataContext.Provider value={{ data: localizedData, track }}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}