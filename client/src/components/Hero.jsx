import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import HeroParticles from "./HeroParticles";

export default function Hero({ ready = false }) {
  const { data, track } = useData();
  const { t } = useLanguage();
  const { PROFILE, CONTACT_INFO } = data;

  const mailto = (subject) => `mailto:${CONTACT_INFO.email}?subject=${subject}`;

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
          <a
            className="btn-retro hero-btn"
            href={mailto("Consulta%20por%20proyecto")}
            onClick={() => track("hero_system_click")}
          >
            {t("hero.ctaSystem")}
          </a>
          <a
            className="btn-retro hero-btn"
            href={mailto("Trabajo%20%2F%20pasant%C3%ADa")}
            onClick={() => track("hero_team_click")}
          >
            {t("hero.ctaTeam")}
          </a>
          <a
            className="btn-retro hero-btn"
            href={CONTACT_INFO.cvUrl}
            download
            onClick={() => track("hero_cv_click")}
          >
            {t("hero.ctaCv")}
          </a>
        </div>

        <div className="hero-badges" aria-hidden="true">
          <span className="hero-badges-text">Nivel {PROFILE.level}/{PROFILE.maxLevel}</span>
        </div>
      </div>
    </section>
  );
}
