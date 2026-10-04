import { useCallback, useEffect, useRef, useState } from "react";
import { useKonami } from "./hooks/useKonami";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useSound } from "./context/SoundContext";
import { useData } from "./context/DataContext";
import { useLanguage } from "./context/LanguageContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Breadcrumb from "./components/Breadcrumb";
import TrainerCard from "./components/TrainerCard";
import PCStorage from "./components/PCStorage";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Terminal from "./components/Terminal";
import OakChat from "./components/OakChat";
import Toast from "./components/Toast";
import BootScreen from "./components/BootScreen";
import CrtOverlay from "./components/CrtOverlay";
import KonamiConfetti from "./components/KonamiConfetti";
import NotFound from "./components/NotFound";

// Rutas que la SPA conoce: home y archivos estáticos (con extensión).
// Todo lo demás (catch-all rewrite de Vercel) es un 404 in-app.
const IS_NOT_FOUND = (() => {
  const p = window.location.pathname;
  if (p === "/" || p === "/index.html") return false;
  return !/\.[a-z0-9]+$/i.test(p);
})();

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export default function App() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
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
    showToast(t("toast.konami"));
  }, [sfx, showToast, t]);

  useKonami(KONAMI, onKonami);

  // El reveal espera a que termine el boot: mientras la pantalla de arranque
  // tapa la página, las secciones no deben marcarse como vistas.
  useScrollReveal(booted || IS_NOT_FOUND);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <>
      <CrtOverlay />
      {confettiKey > 0 && <KonamiConfetti key={confettiKey} />}

      <Header />
      <main id="main">
        {IS_NOT_FOUND ? (
          <NotFound />
        ) : (
          <>
            <Hero ready={booted} />
            <Breadcrumb />
            <TrainerCard />
            <Services />
            <PCStorage />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      {!IS_NOT_FOUND && <Terminal />}
      {!IS_NOT_FOUND && <OakChat />}
      <Toast message={toast.message} show={toast.show} />

      {!booted && !IS_NOT_FOUND && <BootScreen onDone={() => setBooted(true)} />}
    </>
  );
}
