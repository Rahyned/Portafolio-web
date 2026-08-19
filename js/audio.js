// ============================================================
// AUDIO - Sonidos retro 8-bits con Web Audio API
// Mute por defecto: la experiencia comienza silenciada.
// ============================================================

const SoundManager = (() => {
  const STORAGE_KEY = "portfolio_sound_muted";

  let ctx = null;
  let muted = localStorage.getItem(STORAGE_KEY) === "true" || localStorage.getItem(STORAGE_KEY) === null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function playTone(freq, duration, type = "square", volume = 0.15) {
    if (muted) return;
    try {
      const audioCtx = getCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Fallo silencioso: el sonido no es crítico
    }
  }

  function playSequence(notes) {
    if (muted) return;
    try {
      const audioCtx = getCtx();
      const startTime = audioCtx.currentTime + 0.01;
      notes.forEach(([freq, dur], i) => {
        const t = startTime + i * 0.07;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur);
      });
    } catch (e) {
      // Fallo silencioso
    }
  }

  const sfx = {
    click() { playTone(660, 0.08); },
    hover() { playTone(440, 0.05, "square", 0.06); },
    box() { playSequence([[523, 0.08], [659, 0.08], [784, 0.12]]); },
    open() { playSequence([[392, 0.08], [523, 0.08], [659, 0.12]]); },
    close() { playSequence([[659, 0.06], [392, 0.08]]); },
    success() { playSequence([[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.2]]); },
    error() { playTone(220, 0.15, "sawtooth", 0.1); },
    konami() { playSequence([[262, 0.08], [330, 0.08], [392, 0.08], [523, 0.08], [659, 0.2]]); }
  };

  function isMuted() {
    return muted;
  }

  function setMuted(value) {
    muted = value;
    localStorage.setItem(STORAGE_KEY, String(value));
    const btn = document.getElementById("muteBtn");
    if (btn) {
      btn.setAttribute("aria-pressed", String(value));
      btn.innerHTML = value ? '<span aria-hidden="true">🔇</span>' : '<span aria-hidden="true">🔊</span>';
    }
  }

  function toggle() {
    setMuted(!muted);
    if (!muted) sfx.click();
    return muted;
  }

  return { sfx, isMuted, setMuted, toggle };
})();
