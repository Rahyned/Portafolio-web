import { useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import PixelSprite from "./PixelSprite";
import SpriteImage from "./SpriteImage";
import { getProjectSprite } from "../sprites/registry";
import ProjectModal from "./ProjectModal";

const GRID_SLOTS = 9;
const BOX_ICONS = ["box_web", "box_systems", "box_desktop"];

export default function PCStorage() {
  const { data } = useData();
  const { sfx } = useSound();
  const [currentBox, setCurrentBox] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const box = data.PROJECT_BOXES[currentBox];

  const switchBox = (index) => {
    if (index === currentBox || phase === "out") return;
    sfx("box");
    setHovered(null);
    setPhase("out");
    setTimeout(() => {
      setCurrentBox(index);
      setPhase("in");
      setTimeout(() => setPhase("idle"), 450);
    }, 300);
  };

  const slots = Array.from({ length: GRID_SLOTS }, (_, i) => box.projects[i] || null);
  const gridClass = phase === "out" ? " fade-out" : phase === "in" ? " fade-in" : "";
  const filled = box.projects.length;

  return (
    <>
      <section className="pc-section" id="pc" aria-labelledby="pcTitle">
        <div className="section-banner">
          <h2 className="section-title" id="pcTitle">SISTEMA DE ALMACENAMIENTO PC</h2>
          <p className="section-sub">Mis proyectos, guardados como en la PC de Bill.</p>
        </div>

        <div className="pc-frame marquee-frame reveal visible">
          <div className="pc-titlebar">
            <span className="pc-title">PC DE LAUTARO // PROYECTOS</span>
            <span className="pc-led" aria-hidden="true" />
          </div>

          <div className="pc-tabs" role="tablist" aria-label="Cajas de proyectos">
            {data.PROJECT_BOXES.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className={`pc-tab${i === currentBox ? " active" : ""}`}
                role="tab"
                aria-selected={i === currentBox}
                onClick={() => switchBox(i)}
              >
                <PixelSprite sprite={BOX_ICONS[i]} cell={2} />
                {b.label}
              </button>
            ))}
          </div>

          <div className={`pc-grid${gridClass}`} aria-live="polite">
            {slots.map((project, i) => {
              const key = project ? project.id : `empty-${i}`;
              if (!project) {
                return (
                  <button key={key} type="button" className="pc-slot empty" aria-label="Slot vacío" disabled />
                );
              }
              const sprite = getProjectSprite(project.id);
              return (
                <button
                  key={key}
                  type="button"
                  className="pc-slot project"
                  data-idx={String(i + 1).padStart(2, "0")}
                  aria-label={`Proyecto: ${project.title}`}
                  onMouseEnter={() => { setHovered(project); sfx("hover"); }}
                  onMouseLeave={() => setHovered((h) => (h === project ? null : h))}
                  onFocus={() => setHovered(project)}
                  onBlur={() => setHovered((h) => (h === project ? null : h))}
                  onClick={() => {
                    sfx("open");
                    setSelected(project);
                  }}
                >
                  <span className="slot-sprite-wrap" aria-hidden="true">
                    {sprite ? (
                      <SpriteImage src={sprite} className="slot-sprite" />
                    ) : (
                      <span className="slot-emoji">{project.sprite}</span>
                    )}
                  </span>
                  <span className="slot-title">{project.title}</span>
                </button>
              );
            })}
          </div>

          <div className="pc-infobar" aria-live="polite">
            <span className="pc-infobar-box">
              <PixelSprite sprite={BOX_ICONS[currentBox]} cell={2} />
              {box.label}
            </span>
            <span className="pc-infobar-selection">
              {hovered
                ? <>
                    {getProjectSprite(hovered.id)
                      ? <SpriteImage src={getProjectSprite(hovered.id)} className="pc-infobar-sprite" />
                      : <PixelSprite sprite="star" cell={2} />}
                    {hovered.title}
                  </>
                : "SELECCIONA UN PROYECTO ▸"}
            </span>
            <span className="pc-infobar-count">{filled}/{GRID_SLOTS}</span>
          </div>

          <p className="pc-hint">💡 PRESIONA [T] PARA ABRIR LA TERMINAL</p>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
