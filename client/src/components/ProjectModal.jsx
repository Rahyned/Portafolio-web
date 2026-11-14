import { useCallback, useEffect, useRef, useState } from "react";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import SpriteImage from "./SpriteImage";
import ProjectVideo from "./ProjectVideo";
import { getProjectSprite } from "../sprites/registry";

const statusSlug = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("completado") || s.includes("completed")) return "s-completado";
  if (s.includes("desarrollo") || s.includes("development")) return "s-en-desarrollo";
  if (s.includes("curso") || s.includes("progress")) return "s-en-curso";
  return "";
};

function hasDemoVideo(project) {
  return project?.media?.type === "video" && Boolean(project.media.src);
}

export default function ProjectModal({ project, onClose }) {
  const { sfx } = useSound();
  const { t } = useLanguage();
  const closeRef = useRef(null);
  const closeTimer = useRef(null);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [transformSettled, setTransformSettled] = useState(false);
  const [videoLightboxOpen, setVideoLightboxOpen] = useState(false);

  const close = useCallback(() => {
    if (closeTimer.current) return;
    sfx("close");
    setTransformSettled(false);
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      onClose();
    }, 380);
  }, [sfx, onClose]);

  useEffect(() => {
    if (!project) return undefined;
    setEntered(false);
    setClosing(false);
    setTransformSettled(false);
    setVideoLightboxOpen(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape" && !videoLightboxOpen) close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [project, close, videoLightboxOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!project) return null;

  const sprite = getProjectSprite(project.id);
  const withVideo = hasDemoVideo(project);

  const modalClass = [
    "modal",
    withVideo ? "modal--with-media" : "",
    transformSettled ? "modal--settled" : ""
  ].filter(Boolean).join(" ");

  const onModalTransitionEnd = (event) => {
    if (event.propertyName === "transform" && entered && !closing) {
      setTransformSettled(true);
    }
  };

  const details = (
    <>
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
    </>
  );

  return (
    <div
      className={entered && !closing ? "modal-overlay open" : "modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className={modalClass}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={onModalTransitionEnd}
      >
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

        {withVideo ? (
          <div className="modal-body modal-body--with-media">
            <div className="modal-body-media">
              <ProjectVideo
                media={project.media}
                onExpandedChange={setVideoLightboxOpen}
              />
            </div>
            <div className="modal-body-main">
              {details}
            </div>
          </div>
        ) : (
          <div className="modal-body">
            {details}
          </div>
        )}
      </div>
    </div>
  );
}