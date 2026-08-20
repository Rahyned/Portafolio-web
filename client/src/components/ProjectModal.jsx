import { useEffect, useRef } from "react";
import { useSound } from "../context/SoundContext";
import SpriteImage from "./SpriteImage";
import { getProjectSprite } from "../sprites/registry";

const statusSlug = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("completado")) return "s-completado";
  if (s.includes("desarrollo")) return "s-en-desarrollo";
  if (s.includes("curso")) return "s-en-curso";
  return "";
};

export default function ProjectModal({ project, onClose }) {
  const { sfx } = useSound();
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
          <button type="button" className="modal-close" ref={closeRef} onClick={close} aria-label="Cerrar detalles del proyecto">✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-block">
            <h4 className="modal-block-title">📦 VER DETALLES</h4>
            <p><strong>Problema:</strong> {project.problem}</p>
            <p><strong>Solución:</strong> {project.solution}</p>
            <p><strong>Resultado:</strong> {project.result}</p>
          </div>

          <div className="modal-block">
            <h4 className="modal-block-title">🧰 STACK / TECH</h4>
            <div className="modal-stack">
              {project.stack.map((tech) => (
                <span key={tech} className="stack-chip">{tech}</span>
              ))}
            </div>
          </div>

          <div className="modal-block">
            <h4 className="modal-block-title">🚀 DEMO / CÓDIGO</h4>
            <div className="modal-actions">
              {project.demo ? (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>🌐 LIVE DEMO</a>
              ) : (
                <button type="button" className="btn-link" disabled aria-disabled="true">🌐 LIVE DEMO</button>
              )}
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link" onClick={() => sfx("click")}>💾 GITHUB</a>
            </div>
          </div>

          <p className="modal-timeline">Completado: <strong>{project.timeline}</strong></p>
        </div>
      </div>
    </div>
  );
}
