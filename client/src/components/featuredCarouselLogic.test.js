import { describe, expect, it } from "vitest";
import {
  AUTO_ADVANCE_MS,
  buildExtendedSlides,
  getPerView,
  initialTrackIndex,
  isCardVisible,
  isTrackSlideVisible,
  logicalIndexFromTrack,
  normalizeTrackIndex,
  shouldAutoAdvance,
  stepIndex,
  swipeDeltaToStep,
  trackIndexFromLogical,
  wrapIndex
} from "./featuredCarouselLogic";

const IDS = ["a", "b", "c", "d", "e"];

describe("featuredCarouselLogic", () => {
  it("usa intervalo de ~5 segundos", () => {
    expect(AUTO_ADVANCE_MS).toBe(5000);
  });

  it("muestra 1 carta en celular y 2 en escritorio", () => {
    expect(getPerView(375)).toBe(1);
    expect(getPerView(1023)).toBe(1);
    expect(getPerView(1024)).toBe(2);
    expect(getPerView(1440)).toBe(2);
  });

  it("avanza el índice hacia la derecha y hace bucle", () => {
    expect(stepIndex(0, 1, 5)).toBe(1);
    expect(stepIndex(3, 1, 5)).toBe(4);
    expect(stepIndex(4, 1, 5)).toBe(0);
    expect(stepIndex(0, -1, 5)).toBe(4);
  });

  it("normaliza el track al salir de la zona de clones (bucle sin salto)", () => {
    const perView = 2;
    const count = IDS.length;
    const start = initialTrackIndex(count, perView);
    expect(start).toBe(2);
    expect(logicalIndexFromTrack(start, count, perView)).toBe(0);

    // Avance desde la última carta real (índice lógico 4 → track 6)
    const pastEnd = trackIndexFromLogical(4, count, perView) + 1;
    expect(pastEnd).toBe(7);
    const after = normalizeTrackIndex(pastEnd, count, perView);
    expect(after.jumped).toBe(true);
    expect(after.index).toBe(2);
    expect(logicalIndexFromTrack(after.index, count, perView)).toBe(0);

    // Retroceso desde la primera hacia el clon de cola
    const beforeStart = start - 1;
    const back = normalizeTrackIndex(beforeStart, count, perView);
    expect(back.jumped).toBe(true);
    expect(logicalIndexFromTrack(back.index, count, perView)).toBe(4);
  });

  it("construye slides extendidos con clones a ambos lados", () => {
    const extended = buildExtendedSlides(IDS, 2);
    expect(extended).toEqual(["d", "e", "a", "b", "c", "d", "e", "a", "b"]);
  });

  it("pausa el auto-avance con hover/foco o reduced-motion", () => {
    expect(shouldAutoAdvance({ paused: false, reducedMotion: false, itemCount: 5 })).toBe(true);
    expect(shouldAutoAdvance({ paused: true, reducedMotion: false, itemCount: 5 })).toBe(false);
    expect(shouldAutoAdvance({ paused: false, reducedMotion: true, itemCount: 5 })).toBe(false);
    expect(shouldAutoAdvance({ paused: false, reducedMotion: false, itemCount: 1 })).toBe(false);
  });

  it("marca visibles las cartas de la ventana actual", () => {
    expect(isCardVisible(0, 0, 2, 5)).toBe(true);
    expect(isCardVisible(1, 0, 2, 5)).toBe(true);
    expect(isCardVisible(2, 0, 2, 5)).toBe(false);
    expect(isCardVisible(0, 4, 2, 5)).toBe(true);
    expect(isCardVisible(4, 4, 2, 5)).toBe(true);
  });

  it("solo marca visibles las slides del track que están en viewport", () => {
    // trackIndex 3 con perView 2 → slides 3 y 4
    expect(isTrackSlideVisible(3, 3, 2)).toBe(true);
    expect(isTrackSlideVisible(4, 3, 2)).toBe(true);
    expect(isTrackSlideVisible(8, 3, 2)).toBe(false);
    expect(isTrackSlideVisible(2, 3, 2)).toBe(false);
  });

  it("interpreta el swipe horizontal", () => {
    expect(swipeDeltaToStep(-50)).toBe(1);
    expect(swipeDeltaToStep(50)).toBe(-1);
    expect(swipeDeltaToStep(10)).toBe(0);
  });

  it("wrapIndex tolera negativos", () => {
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(5, 5)).toBe(0);
  });
});
