import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import ProjectCard from "./ProjectCard";
import {
  AUTO_ADVANCE_MS,
  buildExtendedSlides,
  getPerView,
  initialTrackIndex,
  isTrackSlideVisible,
  logicalIndexFromTrack,
  normalizeTrackIndex,
  shouldAutoAdvance,
  snapTrackIndex,
  stepWidthPx,
  swipeDeltaToStep,
  trackIndexFromLogical
} from "./featuredCarouselLogic";

const TRACK_GAP_PX = 24;

export default function FeaturedCarousel({ projects }) {
  const { t } = useLanguage();
  const viewportRef = useRef(null);
  const touchStartX = useRef(null);
  const logicalRef = useRef(0);

  const [perView, setPerView] = useState(() =>
    typeof window !== "undefined" ? getPerView(window.innerWidth) : 1
  );
  const [trackIndex, setTrackIndex] = useState(() =>
    initialTrackIndex(projects.length, typeof window !== "undefined" ? getPerView(window.innerWidth) : 1)
  );
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(() =>
    typeof document !== "undefined" ? document.hidden : false
  );
  const [stepPx, setStepPx] = useState(0);

  const itemCount = projects.length;
  const extended = useMemo(
    () => buildExtendedSlides(projects, perView),
    [projects, perView]
  );
  const logicalIndex = logicalIndexFromTrack(trackIndex, itemCount, perView);
  logicalRef.current = logicalIndex;
  const canNavigate = itemCount > 1;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    // Al volver de segundo plano el ancho puede ser 0 un instante: no pisar el layout.
    if (width < 1) return;
    const nextPerView = getPerView(window.innerWidth);
    setPerView(nextPerView);
    setStepPx(stepWidthPx(width, nextPerView, TRACK_GAP_PX));
  }, []);

  const restoreTrack = useCallback(() => {
    setAnimate(false);
    setTrackIndex((current) => snapTrackIndex(current, itemCount, perView));
    measure();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
  }, [itemCount, perView, measure]);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Al cambiar perView o la cantidad, reanclar el track en el mismo índice lógico.
  useEffect(() => {
    setAnimate(false);
    setTrackIndex(trackIndexFromLogical(logicalRef.current, itemCount, perView));
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [perView, itemCount]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Si la pestaña está oculta, el intervalo sigue avanzando y el track se va
  // a índices absurdos: al volver el carrusel parece vacío. Pausamos y reanclamos.
  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.hidden;
      setDocumentHidden(hidden);
      if (!hidden) restoreTrack();
    };
    const onPageShow = () => {
      setDocumentHidden(false);
      restoreTrack();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [restoreTrack]);

  const goBy = useCallback(
    (delta) => {
      if (!canNavigate) return;
      setAnimate(true);
      setTrackIndex((current) => current + delta);
    },
    [canNavigate]
  );

  const goToLogical = useCallback(
    (targetLogical) => {
      if (!canNavigate) return;
      setAnimate(true);
      setTrackIndex(trackIndexFromLogical(targetLogical, itemCount, perView));
    },
    [canNavigate, itemCount, perView]
  );

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== "transform") return;
      const { index, jumped } = normalizeTrackIndex(trackIndex, itemCount, perView);
      if (!jumped) return;
      setAnimate(false);
      setTrackIndex(index);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimate(true));
      });
    },
    [trackIndex, itemCount, perView]
  );

  useEffect(() => {
    if (!shouldAutoAdvance({ paused, reducedMotion, itemCount, documentHidden })) {
      return undefined;
    }
    const id = window.setInterval(() => goBy(1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, itemCount, documentHidden, goBy]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setPaused(false);
    }
  };

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const step = swipeDeltaToStep(endX - touchStartX.current);
    touchStartX.current = null;
    if (step) goBy(step);
  };

  const offsetPx = stepPx > 0 ? stepPx * trackIndex : 0;

  return (
    <div
      className="featured-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div
        className="featured-carousel-viewport"
        ref={viewportRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`featured-carousel-track${animate && stepPx > 0 ? " is-animated" : ""}`}
          style={{
            gap: TRACK_GAP_PX,
            transform: `translate3d(-${offsetPx}px, 0, 0)`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((project, index) => {
            const visible = isTrackSlideVisible(index, trackIndex, perView);
            const cardWidth = Math.max(stepPx - TRACK_GAP_PX, 0);
            return (
              <div
                className="featured-carousel-slide"
                key={`${project.id}-${index}`}
                aria-hidden={!visible}
                inert={!visible ? true : undefined}
                style={
                  cardWidth > 0
                    ? { flex: `0 0 ${cardWidth}px`, width: `${cardWidth}px` }
                    : { flex: `0 0 calc((100% - ${(perView - 1) * TRACK_GAP_PX}px) / ${perView})` }
                }
              >
                <ProjectCard project={project} mediaActive={visible} />
              </div>
            );
          })}
        </div>
      </div>

      {canNavigate ? (
        <div className="featured-carousel-controls">
          <button
            type="button"
            className="featured-carousel-arrow"
            onClick={() => goBy(-1)}
            aria-label={t("featured.carousel.prev")}
          >
            ←
          </button>

          <div
            className="featured-carousel-dots"
            role="tablist"
            aria-label={t("featured.carousel.dots")}
          >
            {projects.map((project, index) => {
              const selected = index === logicalIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={t("featured.carousel.dot", {
                    n: String(index + 1),
                    title: project.title
                  })}
                  className={`featured-carousel-dot${selected ? " is-active" : ""}`}
                  onClick={() => goToLogical(index)}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="featured-carousel-arrow"
            onClick={() => goBy(1)}
            aria-label={t("featured.carousel.next")}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
