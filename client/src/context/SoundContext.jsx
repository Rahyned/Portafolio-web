import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const SoundContext = createContext(null);
const STORAGE_KEY = "portfolio_sound_muted";

function playTone(ctx, freq, duration, type = "square", volume = 0.15) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Sonido no crítico
  }
}

function playSequence(ctx, notes) {
  try {
    const startTime = ctx.currentTime + 0.01;
    notes.forEach(([freq, dur], i) => {
      const t = startTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    });
  } catch (e) {
    // Sonido no crítico
  }
}

export function SoundProvider({ children }) {
  const [muted, setMuted] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const sfx = useCallback((name) => {
    if (muted) return;
    const ctx = getCtx();
    const map = {
      click: () => playTone(ctx, 660, 0.08),
      hover: () => playTone(ctx, 440, 0.05, "square", 0.06),
      box: () => playSequence(ctx, [[523, 0.08], [659, 0.08], [784, 0.12]]),
      open: () => playSequence(ctx, [[392, 0.08], [523, 0.08], [659, 0.12]]),
      close: () => playSequence(ctx, [[659, 0.06], [392, 0.08]]),
      success: () => playSequence(ctx, [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.2]]),
      error: () => playTone(ctx, 220, 0.15, "sawtooth", 0.1),
      konami: () => playSequence(ctx, [[262, 0.08], [330, 0.08], [392, 0.08], [523, 0.08], [659, 0.2]])
    };
    const fn = map[name];
    if (fn) fn();
  }, [muted, getCtx]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(muted));
  }, [muted]);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, sfx }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
