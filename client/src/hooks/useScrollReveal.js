import { useEffect } from "react";

// Activa el scroll-reveal: agrega .visible a todos los .reveal y
// .reveal-stagger del documento cuando entran al viewport.
// El CSS (animations.css:84-93 y pixel.css:181-197) hace el resto.
//
// `enabled` debe ser false mientras el BootScreen tapa la página: si no,
// las secciones ya estarían reveladas cuando el usuario las alcanza.
export function useScrollReveal(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const nodes = document.querySelectorAll(
      ".reveal:not(.visible), .reveal-stagger:not(.visible)"
    );
    if (!nodes.length) return undefined;

    // Sin IntersectionObserver (o SSR) no animamos, pero sí mostramos:
    // nunca dejar contenido oculto.
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      // threshold bajo + rootMargin negativo: dispara apenas la sección
      // empieza a asomar, no cuando está totalmente visible.
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [enabled]);
}
