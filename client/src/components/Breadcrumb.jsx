import { useActiveSection } from "../hooks/useActiveSection";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

const LINKS = [
  { id: "inicio", key: "nav.inicio" },
  { id: "ficha", key: "nav.ficha" },
  { id: "servicios", key: "nav.servicios" },
  { id: "pc", key: "nav.pc" },
  { id: "contacto", key: "nav.contacto" }
];

export default function Breadcrumb() {
  const active = useActiveSection(LINKS.map((l) => l.id));
  const { sfx } = useSound();
  const { t } = useLanguage();

  return (
    <nav className="breadcrumb" aria-label={t("nav.aria")}>
      <div className="container">
        {LINKS.map((link, i) => (
          <span key={link.id} style={{ display: "contents" }}>
            {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">&gt;</span>}
            <a
              href={`#${link.id}`}
              className={`breadcrumb-link${active === link.id ? " active" : ""}`}
              onClick={() => sfx("click")}
            >
              {t(link.key)}
            </a>
          </span>
        ))}
      </div>
    </nav>
  );
}
