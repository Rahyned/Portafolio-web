import { useEffect, useRef } from "react";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import SpriteImage from "./SpriteImage";
import { getProjectSprite } from "../sprites/registry";

const statusSlug = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("completado") || s.includes("completed")) return "s-completado";
  if (s.includes("desarrollo") || s.includes("development")) return "s-en-desarrollo";
  if (s.includes("curso") || s.includes("progress")) return "s-en-curso";
  return "";
};

const assistantHref = (p) => {
  const h = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocal = !h || h === "localhost" || h === "127.0.0.1";
  return isLocal ? "https://rag-proyectos.vercel.app/" : p.assistant;
};

export default function ProjectModal({ project, onClose }) {
  const { sfx } = useSound();
  const { t } = useLanguage();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  const close = () => {
    sfx("close");
    onClose();
  };

  const sprite = getProjectSprite(project.id);

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-sprite" aria-hidden="true">
            {sprite ? <SpriteImage src={sprite} className="modal-sprite-img" /> : project.sprite}
          </div>
          <div className="modal-title-block">
            <h3 className="modal-title" id="modalTitle">{project.title}</h3>
            <p className="modal-meta">{project.category} • {project.timeline}</p>
            <span className={`modal-status ${statusSlug(project.status)}`}>{project.status}</span>
          </div>
          <button type="button" className="modal-close" ref={closeRef} onClick={close} aria-label={t("modal.aria.close")}>✕</button>
        </div>

        <div className="modal-body">
          {project.video && (
            <div className="modal-block modal-video">
              <h4 className="modal-block-title">{t("modal.block.video")}</h4>
              <video controls playsInline preload="metadata">
                <source src={project.video} type="video/mp4" />
              </video>
            </div>
          )}

          <div className="modal-block">
            <h4 className="modal-block-title">{t("modal.block.details")}</h4>
            <p><strong>{t("modal.problem")}</strong> {project.problem}</p>
            <p><strong>{t("modal.solution")}</strong> {project.solution}</p>
            <p><strong>{t("modal.result")}</strong> {project.result}</p>
          </div>

          <div className="modal-block">
            <h4 className="modal-block-title">{t("modal.block.stack")}</h4>
            <div className="modal-stack">
              {project.stack.map((tech) => (
                <span key={tech} className="stack-chip">{tech}</span>
              ))}
            </div>
          </div>

          <div className="modal-block">
            <h4 className="modal-block-title">{t("modal.block.code")}</h4>
            <div className="modal-actions">
              {project.demo ? (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>{t("modal.demo")}</a>
              ) : (
                <button type="button" className="btn-link" disabled aria-disabled="true">{t("modal.demo")}</button>
              )}
              {project.assistant ? (
                <a href={assistantHref(project)} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>{t("modal.assistant")}</a>
              ) : null}
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>{t("modal.github")}</a>
            </div>
          </div>

          <p className="modal-timeline">{t("modal.completed")} <strong>{project.timeline}</strong></p>
        </div>
      </div>
    </div>
  );
}
