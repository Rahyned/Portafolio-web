import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "portfolio_lang";
const LANGS = ["es", "en"];

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(saved) ? saved : "es";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(LANGS.includes(next) ? next : "es");
  }, []);

  const t = useCallback(
    (key, params) => {
      let value = translations[lang]?.[key];
      if (value === undefined) value = translations.es?.[key] ?? key;
      if (Array.isArray(value)) return value;
      if (typeof value === "string" && params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
      return value;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
