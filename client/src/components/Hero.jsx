import { useTypewriter } from "../hooks/useTypewriter";
import { useSound } from "../context/SoundContext";
import { useData } from "../context/DataContext";
import PixelSprite from "./PixelSprite";
import HeroParticles from "./HeroParticles";

export default function Hero() {
  const { data, track } = useData();
  const { sfx } = useSound();
  const { displayed } = useTypewriter("Explora mis proyectos y servicios →", { speed: 38, start: true });

  const [head, ...tail] = data.PROFILE.tagline.split("|");
  const sub = tail.join("|");

  return (
    <section className="hero" id="inicio" aria-label="Presentación">
      <HeroParticles />

      <div className="hero-stage">
        <div className="hero-sprite">
          <PixelSprite sprite="trainer" cell={5} className="hero-trainer" />
          <div className="hero-shadow" aria-hidden="true" />
        </div>

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
        ▶ ENTRAR A LA PC
      </button>

      <div className="hero-badges" aria-hidden="true">
        <PixelSprite sprite="pokeball" cell={2} />
        <span className="hero-badges-text">EXP LOADING...</span>
        <PixelSprite sprite="coin" cell={2} />
      </div>
    </section>
  );
}
