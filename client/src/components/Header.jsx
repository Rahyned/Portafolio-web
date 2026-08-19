import { useTheme } from "../context/ThemeContext";
import { useSound } from "../context/SoundContext";
import { useData } from "../context/DataContext";
import { useUi } from "../context/UiContext";

const THEME_BUTTONS = [
  { theme: "arcade", label: "ARCADE" },
  { theme: "red", label: "RED" },
  { theme: "blue", label: "BLUE" },
  { theme: "dark", label: "DARK" }
];

export default function Header() {
  const { data } = useData();
  const { theme, setTheme } = useTheme();
  const { muted, toggleMute, sfx } = useSound();
  const { crt, toggleCrt } = useUi();

  const isActive = (t) => theme === t;

  return (
    <header className="site-header" role="banner">
      <button
        type="button"
        className="header-logo"
        onClick={() => { sfx("click"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        aria-label="Volver al inicio"
      >
        <span>{data.PROFILE.displayName}</span>
      </button>

      <div className="header-right">
        <span className="header-status" aria-live="polite">{data.PROFILE.status}</span>

        <div className="theme-switcher" role="group" aria-label="Selector de tema">
          {THEME_BUTTONS.map((b) => (
            <button
              key={b.theme}
              type="button"
              className={`theme-btn${isActive(b.theme) ? " active" : ""}`}
              data-theme={b.theme}
              aria-label={`Tema ${b.label}`}
              aria-pressed={isActive(b.theme)}
              onClick={() => { sfx("click"); setTheme(b.theme); }}
            >
              {b.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`icon-btn${crt ? " on" : ""}`}
          onClick={() => { sfx("click"); toggleCrt(); }}
          aria-label={crt ? "Apagar efecto CRT" : "Encender efecto CRT"}
          aria-pressed={crt}
          title={crt ? "CRT: ON" : "CRT: OFF"}
        >
          <span aria-hidden="true">{crt ? "📺" : "🖥"}</span>
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleMute}
          aria-label={muted ? "Activar sonidos" : "Silenciar sonidos"}
          aria-pressed={muted}
          title={muted ? "Sonido apagado" : "Sonido activado"}
        >
          <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
        </button>
      </div>
    </header>
  );
}
