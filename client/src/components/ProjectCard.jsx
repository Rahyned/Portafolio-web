import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

const MEDIA_SIZE = {
  "/media/rag-demo.gif": { width: 780, height: 560 },
  "/media/pronostico.png": { width: 1320, height: 600 },
  "/media/solutionscars-demo.mp4": { width: 1280, height: 720 },
  "/media/stella-demo.mp4": { width: 1280, height: 720 }
};

function stopCarouselGesture(event) {
  event.stopPropagation();
}

function FeaturedMedia({ media, active }) {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const size = MEDIA_SIZE[media.src] || { width: 1280, height: 720 };

  // Sin autoplay: solo pausamos al salir de vista (no reseteamos el tiempo).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || expanded) return undefined;
    if (!active) video.pause();
    return undefined;
  }, [active, expanded]);

  useEffect(() => {
    if (!expanded) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inline = videoRef.current;
    const lightbox = lightboxVideoRef.current;
    if (inline && lightbox) {
      try {
        lightbox.currentTime = inline.currentTime;
      } catch {
        /* ignore */
      }
      if (!inline.paused) {
        const play = lightbox.play();
        if (play && typeof play.catch === "function") play.catch(() => {});
      }
      inline.pause();
    }

    closeBtnRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      if (inline && lightbox) {
        try {
          inline.currentTime = lightbox.currentTime;
        } catch {
          /* ignore */
        }
        lightbox.pause();
      }
    };
  }, [expanded]);

  if (media.type === "video" && media.src) {
    return (
      <>
        <div
          className="featured-media-frame"
          onTouchStart={stopCarouselGesture}
          onTouchEnd={stopCarouselGesture}
          onTouchMove={stopCarouselGesture}
        >
          <video
            ref={videoRef}
            className="featured-media featured-media-video"
            src={media.src}
            poster={media.poster || undefined}
            width={size.width}
            height={size.height}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            aria-label={media.alt}
          />
          <button
            type="button"
            className="featured-video-expand"
            onClick={() => setExpanded(true)}
            aria-label={t("featured.video.expand")}
          >
            ⛶
          </button>
        </div>

        {expanded
          ? createPortal(
              <div
                className="featured-video-lightbox"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => {
                  if (event.target === event.currentTarget) setExpanded(false);
                }}
              >
                <div className="featured-video-lightbox-panel">
                  <div className="featured-video-lightbox-bar">
                    <p className="featured-video-lightbox-title" id={titleId}>
                      {media.alt}
                    </p>
                    <button
                      ref={closeBtnRef}
                      type="button"
                      className="featured-video-lightbox-close"
                      onClick={() => setExpanded(false)}
                      aria-label={t("featured.video.close")}
                    >
                      ✕
                    </button>
                  </div>
                  <video
                    ref={lightboxVideoRef}
                    className="featured-video-lightbox-video"
                    src={media.src}
                    poster={media.poster || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                  />
                </div>
              </div>,
              document.body
            )
          : null}
      </>
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
