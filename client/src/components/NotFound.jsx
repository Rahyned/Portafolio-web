import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `404 — ${t("notfound.title")}`;
  }, [t]);

  return (
    <section className="hero" id="notfound" aria-label={t("notfound.aria")}>
      <div className="hero-stage">
        <div className="hero-text">
          <p className="hero-name title-grad">404</p>
          <h1 className="hero-tagline">{t("notfound.title")}</h1>
          <p className="hero-sub">{t("notfound.text")}</p>
        </div>
      </div>
      <button type="button" className="btn-retro btn-big hero-cta" onClick={() => { window.location.href = "/"; }}>
        {t("notfound.cta")}
      </button>
    </section>
  );
}
