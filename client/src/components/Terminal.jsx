import { useEffect, useRef, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

export default function Terminal() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
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
          { text: t("term.help.title"), cls: "ok" },
          { text: t("term.help.help") },
          { text: t("term.help.projects") },
          { text: t("term.help.skills") },
          { text: t("term.help.about") },
          { text: t("term.help.contact") },
          { text: t("term.help.cv") },
          { text: t("term.help.clear") }
        ]);
        break;
      case "projects": {
        const out = [{ text: t("term.projects.title"), cls: "ok" }];
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
          { text: t("term.skills.title"), cls: "ok" },
          ...SKILLS_LIST.map((s) => ({ text: `  ${s}` }))
        ]);
        break;
      case "about":
        render([
          { text: `${t("term.about.name")} ${PROFILE.name}` },
          { text: `${t("term.about.class")} ${PROFILE.class}` },
          { text: `${t("term.about.level")} ${PROFILE.level}/${PROFILE.maxLevel}` },
          { text: t("term.about.exp", { years: PROFILE.expYears, projects: PROFILE.completedProjects }) },
          { text: `${t("term.about.location")} ${PROFILE.location}` },
          { text: `${t("term.about.status")} ${PROFILE.status}`, cls: "warn" }
        ]);
        break;
      case "contact":
        render([
          { text: `${t("term.contact.email")} ${CONTACT_INFO.email}` },
          { text: `${t("term.contact.linkedin")} ${String(CONTACT_INFO.linkedin).replace(/^https?:\/\//i, "")}` },
          { text: `${t("term.contact.github")} ${String(CONTACT_INFO.github).replace(/^https?:\/\//i, "")}` },
          { text: `${t("term.contact.phone")} ${CONTACT_INFO.phone}` }
        ]);
        break;
      case "cv":
        window.open(CONTACT_INFO.cvUrl || "cv.html", "_blank", "noopener");
        render([{ text: t("term.cv.opening"), cls: "ok" }]);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        render([{ text: t("term.error", { cmd: command.trim() }), cls: "warn" }]);
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
      setLines([{ text: t("term.boot"), cls: "ok" }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, t]);

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
      aria-label={t("term.aria")}
      onClick={(e) => { if (e.target === e.currentTarget) closeTerminal(); }}
    >
      <div className="terminal">
        <div className="terminal-bar">
          <span>{t("term.title")}</span>
          <button type="button" className="terminal-close" onClick={closeTerminal} aria-label={t("term.aria.close")}>✕</button>
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
            aria-label={t("term.aria.input")}
            placeholder={t("term.placeholder")}
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
