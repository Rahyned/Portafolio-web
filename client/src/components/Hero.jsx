import { useTypewriter } from "../hooks/useTypewriter";
import { useSound } from "../context/SoundContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import HeroParticles from "./HeroParticles";

export default function Hero() {
  const { data, track } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
  const { displayed } = useTypewriter(t("hero.typewriter"), { speed: 38, start: true });

  const [head, ...tail] = data.PROFILE.tagline.split("|");
  const sub = tail.join("|");

  return (
    <section className="hero" id="inicio" aria-label={t("hero.aria")}>
      <HeroParticles />

      <div className="hero-stage">
        <div className="hero-sprite">
          <img src="/sprites/mi_sprite-f1.svg" alt="Personaje pixelado" className="hero-trainer" />
          <div className="hero-shadow" aria-hidden="true" />
        </div>

        <div className="hero-divider" aria-hidden="true" />

        <div className="hero-text">
          <h1 className="hero-tagline title-grad">
            {head}
            {sub && <><br /><span className="accent">{sub}</span></>}
          </h1>
          <p className="hero-sub" aria-live="polite">
            {displayed}
            <span className="typewriter-cursor" aria-hidden="true">▌</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        className="btn-retro btn-big hero-cta"
        onClick={() => {
          sfx("click");
          track("enter_pc_click");
          document.getElementById("ficha").scrollIntoView({ behavior: "smooth" });
        }}
      >
        {t("hero.cta")}
      </button>

      <div className="hero-badges" aria-hidden="true">
        <span className="hero-badges-text">{t("hero.exp")}</span>
      </div>
    </section>
  );
}
