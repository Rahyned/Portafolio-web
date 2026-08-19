import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import PixelSprite from "./PixelSprite";

function BioTypewriter() {
  const { data } = useData();
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
      {done && <p className="bio-skip-hint">PRESIONA CUALQUIER TECLA PARA CONTINUAR ▸</p>}
    </div>
  );
}

export default function TrainerCard() {
  const { data } = useData();
  const { sfx } = useSound();
  const { PROFILE, BADGES } = data;

  const fillRef = useRef(null);
  const [expPct, setExpPct] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setExpPct(Math.round((PROFILE.level / PROFILE.maxLevel) * 100));
    });
  }, [PROFILE.level, PROFILE.maxLevel]);

  return (
    <section className="trainer-section" id="ficha" aria-labelledby="trainerTitle">
      <div className="trainer-card reveal visible">
        <div className="trainer-top">
          <div className="trainer-avatar" role="img" aria-label="Avatar pixelado de Lautaro">
            <PixelSprite sprite="trainer" cell={4} className="trainer-sprite" />
          </div>
          <div className="trainer-info">
            <h2 className="trainer-name" id="trainerTitle">{PROFILE.name}</h2>
            <p className="trainer-class">{PROFILE.class}</p>
            <ul className="trainer-stats">
              <li className="trainer-stat"><span>CLASE</span><strong>{PROFILE.class}</strong></li>
              <li className="trainer-stat"><span>NIVEL</span><strong>{PROFILE.level} / {PROFILE.maxLevel}</strong></li>
              <li className="trainer-stat"><span>AÑOS DE EXP</span><strong>{PROFILE.expYears}</strong></li>
              <li className="trainer-stat"><span>PROYECTOS</span><strong>{PROFILE.completedProjects}</strong></li>
              <li className="trainer-stat"><span>UBICACIÓN</span><strong>{PROFILE.location}</strong></li>
            </ul>
            <div className="exp-bar-wrap">
              <div className="exp-bar-label">
                <span>EXP</span>
                <span className="exp-level-text">Nv. {PROFILE.level}/{PROFILE.maxLevel}</span>
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
        </div>

        <h3 className="badges-title">MEDALLAS — STACK PRINCIPAL</h3>
        <div className="badges" aria-label="Stack técnico principal">
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

        <BioTypewriter />
      </div>
    </section>
  );
}
