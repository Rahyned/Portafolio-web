import { useCallback, useEffect, useRef, useState } from "react";
import { useKonami } from "./hooks/useKonami";
import { useSound } from "./context/SoundContext";
import { useData } from "./context/DataContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Breadcrumb from "./components/Breadcrumb";
import TrainerCard from "./components/TrainerCard";
import PCStorage from "./components/PCStorage";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import Toast from "./components/Toast";
import BootScreen from "./components/BootScreen";
import CrtOverlay from "./components/CrtOverlay";
import KonamiConfetti from "./components/KonamiConfetti";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export default function App() {
  const { data } = useData();
  const { sfx } = useSound();
  const [booted, setBooted] = useState(false);
  const [toast, setToast] = useState({ message: "", show: false });
  const [confettiKey, setConfettiKey] = useState(0);
  const timerRef = useRef(null);

  // Inicialización de Google Analytics 4 (configurable en data/projects.json)
  useEffect(() => {
    const id = (data.ANALYTICS && data.ANALYTICS.ga4Id) || "";
    if (!id || id.indexOf("G-") !== 0) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", id);
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }, [data]);

  const showToast = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  }, []);

  const onKonami = useCallback(() => {
    sfx("konami");
    setConfettiKey((k) => k + 1);
    showToast("🎉 ¡MODO MISTERIO ACTIVADO!");
  }, [sfx, showToast]);

  useKonami(KONAMI, onKonami);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <>
      <CrtOverlay />
      {confettiKey > 0 && <KonamiConfetti key={confettiKey} />}

      <Header />
      <main id="main">
        <Hero />
        <Breadcrumb />
        <TrainerCard />
        <PCStorage />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <Terminal />
      <Toast message={toast.message} show={toast.show} />

      {!booted && <BootScreen onDone={() => setBooted(true)} />}
    </>
  );
}
