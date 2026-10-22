/** Intervalo del auto-avance del carrusel de proyectos destacados. */
export const AUTO_ADVANCE_MS = 5000;

/** Ancho mínimo (px) a partir del cual se muestran 2 cartas. */
export const DESKTOP_MIN_WIDTH = 1024;

/** Desplazamiento mínimo (px) para considerar un swipe. */
export const SWIPE_THRESHOLD_PX = 40;

export function getPerView(viewportWidth) {
  return viewportWidth >= DESKTOP_MIN_WIDTH ? 2 : 1;
}

export function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function stepIndex(index, delta, length) {
  return wrapIndex(index + delta, length);
}

/** Cantidad de clones a cada lado para el bucle sin salto. */
export function cloneCount(itemCount, perView) {
  if (itemCount <= 0) return 0;
  return Math.min(perView, itemCount);
}

/**
 * Extiende la lista con colas/cabezas clonadas:
 * [últimas N] + items + [primeras N].
 */
export function buildExtendedSlides(items, perView) {
  if (!items.length) return [];
  const n = cloneCount(items.length, perView);
  return [...items.slice(-n), ...items, ...items.slice(0, n)];
}

export function initialTrackIndex(itemCount, perView) {
  if (!itemCount) return 0;
  return cloneCount(itemCount, perView);
}

/**
 * Si el track cayó en zona de clones, teletransporta al índice real
 * equivalente (mismo frame visual, sin transición).
 */
export function normalizeTrackIndex(trackIndex, itemCount, perView) {
  if (!itemCount) return { index: 0, jumped: false };
  const clones = cloneCount(itemCount, perView);
  if (trackIndex < clones) {
    return { index: trackIndex + itemCount, jumped: true };
  }
  if (trackIndex >= clones + itemCount) {
    return { index: trackIndex - itemCount, jumped: true };
  }
  return { index: trackIndex, jumped: false };
}

export function logicalIndexFromTrack(trackIndex, itemCount, perView) {
  if (!itemCount) return 0;
  const clones = cloneCount(itemCount, perView);
  return wrapIndex(trackIndex - clones, itemCount);
}

export function trackIndexFromLogical(logicalIndex, itemCount, perView) {
  if (!itemCount) return 0;
  return cloneCount(itemCount, perView) + wrapIndex(logicalIndex, itemCount);
}

export function shouldAutoAdvance({ paused, reducedMotion, itemCount }) {
  return Boolean(!paused && !reducedMotion && itemCount > 1);
}

/** Una carta (por id lógico) cae en la ventana [logicalIndex, logicalIndex + perView). */
export function isCardVisible(cardIndex, logicalIndex, perView, itemCount) {
  if (!itemCount) return false;
  for (let offset = 0; offset < perView; offset += 1) {
    if (wrapIndex(logicalIndex + offset, itemCount) === cardIndex) return true;
  }
  return false;
}

/** Una slide del track extendido está en viewport según su índice de track. */
export function isTrackSlideVisible(slideTrackIndex, currentTrackIndex, perView) {
  return (
    slideTrackIndex >= currentTrackIndex &&
    slideTrackIndex < currentTrackIndex + perView
  );
}

/** Swipe izquierda → +1 (siguiente); derecha → -1 (anterior). */
export function swipeDeltaToStep(deltaX, threshold = SWIPE_THRESHOLD_PX) {
  if (deltaX <= -threshold) return 1;
  if (deltaX >= threshold) return -1;
  return 0;
}

/** Ancho de un paso del track (carta + gap) en píxeles. */
export function stepWidthPx(viewportWidth, perView, gapPx) {
  if (perView <= 0) return 0;
  const gaps = gapPx * (perView - 1);
  const card = (viewportWidth - gaps) / perView;
  return card + gapPx;
}
