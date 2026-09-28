import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

const RARITIES = ["rarity-common", "rarity-rare", "rarity-epic"];

export default function Services() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();

  const startTrade = (service) => {
    sfx("click");
    window.dispatchEvent(
      new CustomEvent("portfolio:select-service", {
        detail: { type: service.type }
      })
    );
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="services-section" id="servicios" aria-labelledby="servicesTitle">
      <div className="section-banner">
        <h2 className="section-title" id="servicesTitle">{t("nav.servicios")}</h2>
        <p className="section-sub">{t("services.sub")}</p>
      </div>

      <div className="services-grid reveal-stagger visible" aria-live="polite">
        {data.SERVICES.map((service, i) => (
          <article
            key={service.id}
            className={`service-card ${RARITIES[i % RARITIES.length]}`}
            onMouseEnter={() => sfx("hover")}
          >
            <header className="service-card-head">
              <span className="service-icon" aria-hidden="true">{service.icon}</span>
              <h3 className="service-name">{service.title}</h3>
            </header>

            <p className="service-desc">{service.description}</p>

            <ul className="service-includes">
              {service.includes.map((item) => (
                <li key={item} className="service-include">{item}</li>
              ))}
            </ul>

            <div className="service-stack">
              {service.stack.map((tech) => (
                <span key={tech} className="service-tag">{tech}</span>
              ))}
            </div>

            <footer className="service-footer">
              <button
                type="button"
                className="btn-mini service-cta"
                onClick={() => startTrade(service)}
              >
                {t("services.cta")}
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
