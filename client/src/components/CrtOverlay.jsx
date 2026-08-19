import { useUi } from "../context/UiContext";

// Overlay CRT/scanline sutil, respeta toggle y prefers-reduced-motion.
export default function CrtOverlay() {
  const { crt } = useUi();
  if (!crt) return null;
  return <div className="crt-overlay" aria-hidden="true" />;
}
