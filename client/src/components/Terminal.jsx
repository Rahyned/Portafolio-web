import { useEffect, useRef, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";

export default function Terminal() {
  const { data } = useData();
  const { sfx } = useSound();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const run = (command) => {
    const { PROFILE, PROJECT_BOXES, SKILLS_LIST, CONTACT_INFO } = data;
    const cmd = command.trim().toLowerCase();

    setLines((prev) => [
      ...prev,
      { text: command.trim(), cls: "cmd" }
    ]);

    if (!cmd) return;

    const render = (nextLines) => {
      setLines((prev) => [...prev, ...nextLines]);
    };

    switch (cmd) {
      case "help":
        render([
          { text: "COMANDOS DISPONIBLES:", cls: "ok" },
          { text: "  help       - esta ayuda" },
          { text: "  projects   - lista de proyectos" },
          { text: "  skills     - stack técnico" },
          { text: "  about      - sobre mí" },
          { text: "  contact    - formas de contacto" },
          { text: "  cv         - abrir CV imprimible" },
          { text: "  clear      - limpiar terminal" }
        ]);
        break;
      case "projects": {
        const out = [{ text: "PROYECTOS:", cls: "ok" }];
        PROJECT_BOXES.forEach((box) => {
          out.push({ text: `[${box.label}]`, cls: "info" });
          box.projects.forEach((p) => {
            out.push({ text: `  ${p.sprite} ${p.title} — ${p.timeline} (${p.status})` });
          });
        });
        render(out);
        break;
      }
      case "skills":
        render([
          { text: "STACK TÉCNICO:", cls: "ok" },
          ...SKILLS_LIST.map((s) => ({ text: `  ${s}` }))
        ]);
        break;
      case "about":
        render([
          { text: `NOMBRE: ${PROFILE.name}` },
          { text: `CLASE: ${PROFILE.class}` },
          { text: `NIVEL: ${PROFILE.level}/${PROFILE.maxLevel}` },
          { text: `EXP: ${PROFILE.expYears} años | ${PROFILE.completedProjects} proyectos` },
          { text: `UBICACIÓN: ${PROFILE.location}` },
          { text: `ESTADO: ${PROFILE.status}`, cls: "warn" }
        ]);
        break;
      case "contact":
        render([
          { text: `EMAIL: ${CONTACT_INFO.email}` },
          { text: `LINKEDIN: ${CONTACT_INFO.linkedin}` },
          { text: `GITHUB: ${CONTACT_INFO.github}` },
          { text: `TELÉFONO: ${CONTACT_INFO.phone}` }
        ]);
        break;
      case "cv":
        window.open(CONTACT_INFO.cvUrl || "cv.html", "_blank", "noopener");
        render([{ text: "ABRIENDO CV (imprimible)...", cls: "ok" }]);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        render([{ text: `ERROR: '${command.trim()}' no es un comando válido. Usa 'help'.`, cls: "warn" }]);
    }
  };

  const closeTerminal = () => {
    setOpen(false);
    sfx("close");
  };

  // Tecla T para abrir/cerrar
  useEffect(() => {
    const handler = (e) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (!typing && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) { sfx("close"); } else { sfx("open"); }
          return !prev;
        });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sfx]);

  useEffect(() => {
    if (open) {
      setLines([{ text: "LAUTARO.SYS — TERMINAL RETRO v2.0", cls: "ok" }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const lineCls = {
    cmd: "term-cmd",
    ok: "term-ok",
    info: "term-info",
    warn: "term-warn"
  };

  return (
    <div
      className={`terminal-overlay${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal retro"
      onClick={(e) => { if (e.target === e.currentTarget) closeTerminal(); }}
    >
      <div className="terminal">
        <div className="terminal-bar">
          <span>RETRO_TERMINAL.EXE</span>
          <button type="button" className="terminal-close" onClick={closeTerminal} aria-label="Cerrar terminal">✕</button>
        </div>
        <div className="terminal-body" ref={bodyRef} aria-live="polite">
          {lines.map((line, i) => (
            <div key={i} className={`term-line ${lineCls[line.cls] || ""}`}>
              {line.cls === "cmd" ? <><span className="term-prompt">$&gt;</span> {line.text}</> : line.text}
            </div>
          ))}
        </div>
        <div className="terminal-input-row">
          <span className="term-prompt">$&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            autoComplete="off"
            aria-label="Comando de terminal"
            placeholder="escribe 'help'..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                run(e.currentTarget.value);
                e.currentTarget.value = "";
              } else if (e.key === "Escape") {
                closeTerminal();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
