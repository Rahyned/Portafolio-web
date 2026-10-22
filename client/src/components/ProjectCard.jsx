import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

const MEDIA_SIZE = {
  "/media/rag-demo.gif": { width: 780, height: 560 },
  "/media/pronostico.png": { width: 1320, height: 600 },
  "/media/stella-16x9.mp4": { width: 1280, height: 720 }
};

function FeaturedMedia({ media, active }) {
  const videoRef = useRef(null);
  const size = MEDIA_SIZE[media.src] || { width: 1280, height: 720 };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (active) {
      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {});
      }
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek errors on unloaded media */
      }
    }

    return () => {
      video.pause();
    };
  }, [active, media.src]);

  if (media.type === "video" && media.src) {
    return (
      <div className="featured-media-frame">
        <video
          ref={videoRef}
          className="featured-media featured-media-video"
          src={media.src}
          poster={media.poster || undefined}
          width={size.width}
          height={size.height}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        />
      </div>
    );
  }

  if (media.type === "placeholder" || !media.src) {
    return (
      <div className="featured-media-frame featured-media-placeholder" role="img" aria-label={media.alt}>
        {media.alt}
      </div>
    );
  }

  return (
    <div className="featured-media-frame">
      <img
        className="featured-media"
        src={media.src}
        alt={media.alt}
        width={size.width}
        height={size.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function ProjectCard({ project, mediaActive = true }) {
  const { t } = useLanguage();
  const { title, status, since, problem, built, stack, result, links, media, private: isPrivate } = project;

  const hasLinks = links.length > 0;
  const privateText = project.id === "stella" ? t("featured.clientPrivate") : t("featured.repoPrivate");

  return (
    <article className="featured-card" tabIndex={0}>
      <header className="featured-card-head">
        <h3 className="featured-card-title">
          {title} <span className="featured-card-meta">· {status}{since ? ` · ${since}` : ""}</span>
        </h3>
      </header>

      <FeaturedMedia media={media} active={mediaActive} />

      <div className="featured-card-body">
        <div className="featured-block">
          <h4>{t("featured.problem")}</h4>
          <p>{problem}</p>
        </div>

        <div className="featured-block">
          <h4>{t("featured.built")}</h4>
          <p>{built}</p>
        </div>

        <div className="featured-block">
          <h4>{t("featured.stack")}</h4>
          <div className="featured-stack">
            {stack.map((tech) => (
              <span key={tech} className="featured-chip">{tech}</span>
            ))}
          </div>
        </div>

        <div className="featured-block">
          <h4>{t("featured.result")}</h4>
          <p>{result}</p>
        </div>

        <div className="featured-block featured-block-links">
          <h4>{t("featured.links")}</h4>
          {hasLinks ? (
            <div className="featured-links">
              {links.map((link) => (
                link.url.startsWith("/") ? (
                  <a key={link.label} href={link.url} className="btn-link">{link.label}</a>
                ) : (
                  <a key={link.label} href={link.url} className="btn-link" target="_blank" rel="noopener noreferrer">{link.label}</a>
                )
              ))}
            </div>
          ) : (
            isPrivate ? <p className="featured-private">{privateText}</p> : null
          )}
        </div>
      </div>
    </article>
  );
}
