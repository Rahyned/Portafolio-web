import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";

const MEDIA_SIZE = {
  "/media/pronostico.png": { width: 1320, height: 600 },
  "/media/solutionscars-demo.mp4": { width: 1280, height: 720 },
  "/media/stella-demo.mp4": { width: 1280, height: 720 },
  "/media/rag-demo.mp4": { width: 1280, height: 720 },
  "/media/riodent-demo.mp4": { width: 1280, height: 720 },
  "/media/pixel-editor-demo.mp4": { width: 1280, height: 720 },
  "/media/organizador-demo.mp4": { width: 1280, height: 720 },
  "/media/butterflies-demo.mp4": { width: 1280, height: 720 },
  "/media/libreta-demo.mp4": { width: 1280, height: 720 }
};

function stopCarouselGesture(event) {
  event.stopPropagation();
}

/**
 * Video con poster, controles nativos, expand y lightbox en portal.
 * Reutiliza estilos de `featured.css`.
 */
export default function ProjectVideo({
  media,
  active = true,
  onExpandedChange,
  stopCarouselGesture: carouselTouch = false
}) {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const size = MEDIA_SIZE[media.src] || { width: 1280, height: 720 };

  useEffect(() => {
    onExpandedChange?.(expanded);
  }, [expanded, onExpandedChange]);

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
      if (event.key === "Escape") {
        event.stopPropagation();
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey, true);
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

  const frameProps = carouselTouch
    ? {
        onTouchStart: stopCarouselGesture,
        onTouchEnd: stopCarouselGesture,
        onTouchMove: stopCarouselGesture
      }
    : {};

  return (
    <>
      <div className="featured-media-frame" {...frameProps}>
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
                event.stopPropagation();
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