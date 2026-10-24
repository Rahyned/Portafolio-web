import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import HeroParticles from "./HeroParticles";

export default function Hero({ ready = false }) {
  const { data, track } = useData();
  const { t } = useLanguage();
  const { PROFILE, CONTACT_INFO } = data;

  return (
    <section className={`hero${ready ? " hero-in" : ""}`} id="inicio" aria-label={t("hero.aria")}>
      <HeroParticles />

      <div className="hero-stage">
        <div className="hero-text">
          <h1 className="hero-name title-grad">{PROFILE.name}</h1>
          <h2 className="hero-class">{PROFILE.class}</h2>
          <p className="hero-tagline">{PROFILE.tagline}</p>
          <p className="hero-facts">{PROFILE.quickFacts.join(" · ")}</p>
        </div>

        <div className="hero-actions">
          <div className="hero-btns">
            <a
              className="btn-retro hero-btn hero-btn-primary"
              href="#proyectos"
              onClick={() => track("hero_projects_click")}
            >
              {t("hero.ctaProjects")}
            </a>
            <a
              className="btn-retro hero-btn hero-btn-secondary"
              href="#contacto"
              onClick={() => track("hero_contact_click")}
            >
              {t("hero.ctaContact")}
            </a>
          </div>
          <a
            className="hero-cv-link"
            href={CONTACT_INFO.cvUrl}
            download
            onClick={() => track("hero_cv_click")}
          >
            {t("hero.ctaCv")}
          </a>
        </div>
      </div>
    </section>
  );
}
