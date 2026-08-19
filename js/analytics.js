// ============================================================
// ANALYTICS - Google Analytics 4 (GA4) configurable.
// Se activa solo si ANALYTICS.ga4Id tiene un ID válido en
// data/projects.json. Con "" no carga nada.
// ============================================================

const Analytics = (() => {
  function init() {
    const id = (ANALYTICS && ANALYTICS.ga4Id) || "";
    if (!id || id.indexOf("G-") !== 0) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", id);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  function track(name, params) {
    if (window.gtag) {
      window.gtag("event", name, params || {});
    }
  }

  return { init, track };
})();
