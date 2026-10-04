import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import SpriteImage from "./SpriteImage";
import { getProjectSprite } from "../sprites/registry";
import ProjectModal from "./ProjectModal";

export default function PCStorage() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
  const [currentBox, setCurrentBox] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | out | in
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setColumns(mq.matches ? 2 : 3);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const filled = box.projects.length;
  // Desktop: 6 slots fijos (2 filas de 3). Móvil: corta en la última fila completa.
  const slotCount = columns === 3
    ? 6
    : Math.max(columns, Math.ceil(filled / columns) * columns);
  const slots = Array.from({ length: slotCount }, (_, i) => box.projects[i] || null);
  const gridClass = phase === "out" ? " fade-out" : phase === "in" ? " fade-in" : "";

  return (
    <>
      <section className="pc-section" id="pc" aria-labelledby="pcTitle">
        <div className="section-banner reveal">
          <h2 className="section-title" id="pcTitle">{t("pc.title")}</h2>
          <p className="section-sub">{t("pc.sub")}</p>
        </div>

        <div className="pc-frame marquee-frame reveal">
          <div className="pc-titlebar">
            <span className="pc-title">{t("pc.titlebar")}</span>
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
                <span className="pc-tab-icon" aria-hidden="true">{b.icon}</span>
                {b.label}
              </button>
            ))}
          </div>

          <div className={`pc-grid${gridClass}`} aria-live="polite">
            {slots.map((project, i) => {
              const key = project ? project.id : `empty-${i}`;
              if (!project) {
                return (
                  <button key={key} type="button" className="pc-slot empty" aria-label={t("pc.aria.slotEmpty")} disabled />
                );
              }
              const sprite = getProjectSprite(project.id);
              return (
                <button
                  key={key}
                  type="button"
                  className="pc-slot project"
                  data-idx={String(i + 1).padStart(2, "0")}
                  aria-label={t("pc.aria.project", { title: project.title })}
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
              <span className="pc-infobar-icon" aria-hidden="true">{box.icon}</span>
              {box.label}
            </span>
            <span className="pc-infobar-selection">
              {hovered
                ? <>
                    {getProjectSprite(hovered.id)
                      ? <SpriteImage src={getProjectSprite(hovered.id)} className="pc-infobar-sprite" />
                      : <span className="pc-infobar-sprite" aria-hidden="true">⭐</span>}
                    {hovered.title}
                  </>
                : t("pc.select")}
            </span>
            <span className="pc-infobar-count">{filled}/{slotCount}</span>
          </div>

          <p className="pc-hint">{t("pc.hint")}</p>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
