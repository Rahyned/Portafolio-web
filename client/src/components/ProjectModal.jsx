import { useCallback, useEffect, useRef, useState } from "react";
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

export default function ProjectModal({ project, onClose }) {
  const { sfx } = useSound();
  const { t } = useLanguage();
  const closeRef = useRef(null);
  const closeTimer = useRef(null);
  // El overlay debe montarse SIN .open y ganarlo en el siguiente frame:
  // si nace con .open, el navegador no tiene estado inicial que animar y el
  // modal aparece de golpe (el bounce de pc-storage.css:375 queda dormido).
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  // useCallback: si no, `close` cambia en cada render y el effect de abajo
  // re-registraría el listener y re-enfocaría el botón todo el tiempo.
  const close = useCallback(() => {
    if (closeTimer.current) return;
    sfx("close");
    setClosing(true);
    // Espera a que termine la salida (opacity .3s / scale .4s) antes
    // de desmontar, si no el cierre también aparece de golpe.
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      onClose();
    }, 380);
  }, [sfx, onClose]);

  useEffect(() => {
    if (!project) return undefined;
    setEntered(false);
    setClosing(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [project, close]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!project) return null;

  const sprite = getProjectSprite(project.id);

  return (
    <div
      className={entered && !closing ? "modal-overlay open" : "modal-overlay"}
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

          {(project.demo || project.github) && (
            <div className="modal-block">
              <h4 className="modal-block-title">{t("modal.block.code")}</h4>
              <div className="modal-actions">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>{t("modal.demo")}</a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>{t("modal.github")}</a>
                )}
              </div>
            </div>
          )}

          <p className="modal-timeline">{t("modal.completed")} <strong>{project.timeline}</strong></p>
        </div>
      </div>
    </div>
  );
}
