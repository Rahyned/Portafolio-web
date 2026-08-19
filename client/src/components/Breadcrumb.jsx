import { useActiveSection } from "../hooks/useActiveSection";
import { useSound } from "../context/SoundContext";

const LINKS = [
  { id: "inicio", label: "INICIO" },
  { id: "ficha", label: "FICHA" },
  { id: "pc", label: "PC" },
  { id: "mochila", label: "MOCHILA" },
  { id: "contacto", label: "CONTACTO" }
];

export default function Breadcrumb() {
  const active = useActiveSection(LINKS.map((l) => l.id));
  const { sfx } = useSound();

  return (
    <nav className="breadcrumb" aria-label="Navegación principal">
      <div className="container">
        {LINKS.map((link, i) => (
          <span key={link.id} style={{ display: "contents" }}>
            {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">&gt;</span>}
            <a
              href={`#${link.id}`}
              className={`breadcrumb-link${active === link.id ? " active" : ""}`}
              onClick={() => sfx("click")}
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </nav>
  );
}
