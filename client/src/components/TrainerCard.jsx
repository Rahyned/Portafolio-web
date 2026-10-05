import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { useCountUp } from "../hooks/useCountUp";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

function BioTypewriter() {
  const { data } = useData();
  const { t } = useLanguage();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const { displayed, done } = useTypewriter(data.PROFILE.bio, { speed: 22, start: visible });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="trainer-bio">
      <div ref={ref} className="bio-text" aria-live="polite">
        {displayed}
        {!done && <span className="typewriter-cursor" aria-hidden="true">▌</span>}
      </div>
      {done && <p className="bio-skip-hint">{t("trainer.bio.skip")}</p>}
    </div>
  );
}

export default function TrainerCard() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
  const { PROFILE, BADGES } = data;

  const fillRef = useRef(null);
  const cardRef = useRef(null);
  const [expPct, setExpPct] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setExpPct(Math.round((PROFILE.level / PROFILE.maxLevel) * 100));
    });
  }, [PROFILE.level, PROFILE.maxLevel]);

  // El count-up arranca cuando la ficha entra en pantalla, no al montar
  // (si no, la animación se perdería bajo el BootScreen).
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // threshold 0 + rootMargin negativo: la ficha puede ser más alta
      // que el viewport, y un porcentaje alto nunca se alcanzaría.
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const years = useCountUp(PROFILE.expYears, inView);
  const projects = useCountUp(PROFILE.completedProjects, inView);

  const stats = [
    { label: t("trainer.stat.level"), value: `${PROFILE.level} / ${PROFILE.maxLevel}` },
    { label: t("trainer.stat.exp"), value: years },
    { label: t("trainer.stat.projects"), value: projects },
    { label: t("trainer.stat.location"), value: PROFILE.location }
  ];

  return (
    <section className="trainer-section" id="ficha" aria-labelledby="trainerTitle">
      <div ref={cardRef} className="trainer-card trainer-modal reveal">
        <div className="trainer-modal-header">
          <div className="trainer-avatar" role="img" aria-label={t("trainer.avatar.alt")}>
            <img src="/sprites/sprite-face.svg" alt={t("trainer.avatar.alt")} className="trainer-photo" width="64" height="64" loading="lazy" decoding="async" />
          </div>
          <div className="trainer-modal-titleblock">
            <h2 className="trainer-modal-title" id="trainerTitle">{PROFILE.name}</h2>
            <p className="trainer-modal-meta">{PROFILE.class}</p>
            <span className="trainer-modal-status">{PROFILE.status}</span>
          </div>
        </div>

        <div className="trainer-modal-body">
          <div className="trainer-modal-block">
            <h3 className="trainer-modal-blocktitle">{t("trainer.block.data")}</h3>
            <ul className="trainer-stats">
              {stats.map((s) => (
                <li key={s.label} className="trainer-stat">
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="trainer-modal-block">
            <h3 className="trainer-modal-blocktitle">{t("trainer.block.exp")}</h3>
            <div className="exp-bar-wrap">
              <div className="exp-bar-label">
                <span>{t("trainer.exp.label")}</span>
                <span className="exp-level-text">{t("trainer.exp.level", { level: PROFILE.level, max: PROFILE.maxLevel })}</span>
              </div>
              <div
                className="exp-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax={PROFILE.maxLevel}
                aria-valuenow={PROFILE.level}
              >
                <div ref={fillRef} className="exp-bar-fill" style={{ width: `${expPct}%` }} />
              </div>
            </div>
          </div>

          <div className="trainer-modal-block">
            <h3 className="trainer-modal-blocktitle">{t("trainer.block.badges")}</h3>
            <div className="badges" aria-label={t("trainer.badges.aria")}>
              {BADGES.map((badge, i) => (
                <span
                  key={badge.name}
                  className="badge badge-owned"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onMouseEnter={() => sfx("hover")}
                >
                  <span className="badge-icon" aria-hidden="true">{badge.icon}</span> {badge.name}
                </span>
              ))}
            </div>
          </div>

          <div className="trainer-modal-block">
            <h3 className="trainer-modal-blocktitle">{t("trainer.block.about")}</h3>
            <BioTypewriter />
          </div>
        </div>
      </div>
    </section>
  );
}
