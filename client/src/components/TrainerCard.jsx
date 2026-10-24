import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

export default function TrainerCard() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
  const { PROFILE, BADGES } = data;

  const [expPct, setExpPct] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      setExpPct(Math.round((PROFILE.level / PROFILE.maxLevel) * 100));
    });
  }, [PROFILE.level, PROFILE.maxLevel]);

  const stats = [
    { label: t("trainer.stat.level"), value: `${PROFILE.level} / ${PROFILE.maxLevel}` },
    { label: t("trainer.stat.location"), value: PROFILE.location }
  ];

  return (
    <section className="trainer-section" id="ficha" aria-labelledby="trainerTitle">
      <div className="trainer-card trainer-modal reveal">
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
                <div className="exp-bar-fill" style={{ width: `${expPct}%` }} />
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
            <div className="trainer-bio">
              <p className="bio-text">{PROFILE.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
