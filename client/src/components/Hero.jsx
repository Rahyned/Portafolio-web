import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import HeroParticles from "./HeroParticles";

export default function Hero({ ready = false }) {
  const { data, track } = useData();
  const { t } = useLanguage();
  const { PROFILE, CONTACT_INFO } = data;
  const facts = PROFILE.quickFacts || [];

  return (
    <section className={`hero${ready ? " hero-in" : ""}`} id="inicio" aria-label={t("hero.aria")}>
      <HeroParticles />

      <div className="hero-stage">
        <div className="hero-text">
          <h1 className="hero-name title-grad">{PROFILE.name}</h1>
          <h2 className="hero-class">{PROFILE.class}</h2>
          <p className="hero-tagline">{PROFILE.tagline}</p>
          <p className="hero-facts">
            {facts.map((fact, i) => {
              const isAvailability = i === facts.length - 1;
              return (
                <span key={fact} className="hero-fact">
                  {i > 0 && (
                    <span className="hero-fact-sep" aria-hidden="true">
                      {" · "}
                    </span>
                  )}
                  {isAvailability && (
                    <span className="hero-fact-dot" aria-hidden="true" />
                  )}
                  {fact}
                </span>
              );
            })}
          </p>
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

        <div className="hero-badges" aria-hidden="true">
          <span className="hero-badges-text">{t("hero.level", { level: PROFILE.level, max: PROFILE.maxLevel })}</span>
        </div>
      </div>
    </section>
  );
}
