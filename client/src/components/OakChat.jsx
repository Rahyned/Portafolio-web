import { useEffect, useRef, useState } from "react";
import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import { useSound } from "../context/SoundContext";
import PixelSprite from "./PixelSprite";

const MAX_HISTORY = 10;
const TYPE_MS = 16;
const TYPE_STEP = 2;

export default function OakChat() {
  const { data } = useData();
  const { lang, t } = useLanguage();
  const { sfx } = useSound();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null); // "unavailable" | "rate" | "generic"
  const [input, setInput] = useState("");

  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Apertura global: header y terminal dispatchan "oak:open"
  useEffect(() => {
    const onOpen = () => {
      setOpen((prev) => {
        if (!prev) sfx("open");
        return true;
      });
      setTimeout(() => inputRef.current?.focus(), 80);
    };
    window.addEventListener("oak:open", onOpen);
    return () => window.removeEventListener("oak:open", onOpen);
  }, [sfx]);

  // Escape cierra
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        sfx("close");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, sfx]);

  // Máquina de escribir
  useEffect(() => {
    if (revealed >= answer.length) return;
    const id = setTimeout(
      () => setRevealed((r) => Math.min(r + TYPE_STEP, answer.length)),
      TYPE_MS
    );
    return () => clearTimeout(id);
  }, [revealed, answer]);

  // Cuando terminó de escribirse y ya no hay stream, se consolida en el historial
  useEffect(() => {
    if (!busy && answer && revealed >= answer.length) {
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
      setAnswer("");
      setRevealed(0);
    }
  }, [busy, answer, revealed]);

  // Auto-scroll al final
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, answer, revealed, error]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setAnswer("");
    setRevealed(0);
    setBusy(true);
    sfx("click");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-MAX_HISTORY), lang })
      });

      if (res.status === 429) { setError("rate"); return; }
      if (res.status === 503) { setError("unavailable"); return; }
      if (!res.ok) { setError("generic"); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() || "";
        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          try {
            const payload = JSON.parse(line.slice(5).trim());
            if (typeof payload.delta === "string") setAnswer((a) => a + payload.delta);
            if (payload.error) setError("generic");
          } catch {
            // fragmento inválido: se ignora
          }
        }
      }
    } catch {
      setError("generic");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const skipReveal = () => setRevealed(answer.length);

  return (
    <div
      className="oak-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); sfx("close"); } }}
    >
      <div
        className="oak-box"
        role="dialog"
        aria-modal="true"
        aria-label={t("oak.aria")}
      >
        <div className="oak-header">
          <PixelSprite sprite="oak" cell={2} className="oak-portrait" />
          <div className="oak-head-text">
            <span className="oak-title">{t("oak.title")}</span>
            <span className="oak-sub">{t("oak.sub")}</span>
          </div>
          <button
            type="button"
            className="oak-close"
            onClick={() => { setOpen(false); sfx("close"); }}
            aria-label={t("oak.close")}
          >
            ✕
          </button>
        </div>

        <div className="oak-body" ref={bodyRef} onClick={skipReveal} aria-live="polite">
          {messages.length === 0 && !answer && (
            <p className="oak-intro">{t("oak.intro")}</p>
          )}

          {messages.map((m, i) => (
            <p key={i} className={`oak-msg ${m.role}`}>
              {m.role === "user" ? `> ${m.content}` : m.content}
            </p>
          ))}

          {(answer || busy) && (
            <p className="oak-msg assistant streaming">
              {answer ? answer.slice(0, revealed) : t("oak.thinking")}
              {busy && <span className="oak-cursor">▌</span>}
            </p>
          )}

          {error && (
            <p className="oak-error">
              {t(`oak.error.${error}`)}{" "}
              <a href={`mailto:${data.CONTACT_INFO.email}`}>{t("oak.contact")}</a>
            </p>
          )}

          {messages.length > 0 && !busy && !answer && !error && (
            <p className="oak-hint">{t("oak.hint")}</p>
          )}
        </div>

        <form
          className="oak-input-row"
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            ref={inputRef}
            type="text"
            className="oak-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("oak.placeholder")}
            aria-label={t("oak.aria.input")}
            maxLength={500}
            autoComplete="off"
            disabled={busy}
          />
          <button
            type="submit"
            className="oak-send"
            disabled={busy || !input.trim()}
            aria-label={t("oak.send")}
          >
            ▶
          </button>
        </form>
      </div>
    </div>
  );
}
