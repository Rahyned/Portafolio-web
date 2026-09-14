import { useTheme } from "../context/ThemeContext";
import { useSound } from "../context/SoundContext";
import { useData } from "../context/DataContext";
import { useUi } from "../context/UiContext";
import { useLanguage } from "../context/LanguageContext";

const THEME_BUTTONS = [
  { theme: "arcade", label: "ARCADE" },
  { theme: "dark", label: "DARK" }
];

export default function Header() {
  const { data } = useData();
  const { theme, setTheme } = useTheme();
  const { muted, toggleMute, sfx } = useSound();
  const { crt, toggleCrt } = useUi();
  const { lang, setLang, t } = useLanguage();

  const isActive = (t) => theme === t;

  return (
    <header className="site-header" role="banner">
      <button
        type="button"
        className="header-logo"
        onClick={() => { sfx("click"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        aria-label={t("header.aria.home")}
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
              aria-label={t("aria.theme", { label: b.label })}
              aria-pressed={isActive(b.theme)}
              onClick={() => { sfx("click"); setTheme(b.theme); }}
            >
              {b.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="icon-btn lang-btn"
          onClick={() => { sfx("click"); setLang(lang === "es" ? "en" : "es"); }}
          aria-label={t("aria.lang")}
          aria-pressed={lang === "en"}
          title={t("aria.lang")}
        >
          <span aria-hidden="true">{lang === "es" ? "EN" : "ES"}</span>
        </button>

        <button
          type="button"
          className={`icon-btn${crt ? " on" : ""}`}
          onClick={() => { sfx("click"); toggleCrt(); }}
          aria-label={crt ? t("aria.crt.on") : t("aria.crt.off")}
          aria-pressed={crt}
          title={crt ? t("title.crt.on") : t("title.crt.off")}
        >
          <span aria-hidden="true">{crt ? "📺" : "🖥"}</span>
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleMute}
          aria-label={muted ? t("aria.mute.on") : t("aria.mute.off")}
          aria-pressed={muted}
          title={muted ? t("title.mute.on") : t("title.mute.off")}
        >
          <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
        </button>
      </div>
    </header>
  );
}
