// ============================================================
// TYPEWRITER - Efecto de escritura letra por letra.
// Se puede saltar con cualquier tecla o clic.
// ============================================================

const Typewriter = (() => {
  const DEFAULT_SPEED = 28; // ms por letra

  // Escribe texto en el elemento. Retorna Promise.
  function type(element, text, { speed = DEFAULT_SPEED, cursor } = {}) {
    return new Promise((resolve) => {
      let index = 0;
      let cancelled = false;
      let timer = null;

      element.textContent = "";

      function skip() {
        if (cancelled) return;
        cancelled = true;
        clearInterval(timer);
        element.textContent = text;
        document.removeEventListener("keydown", onKey, true);
        document.removeEventListener("click", onClick, true);
        resolve();
      }

      function onKey(e) {
        if (e.key === "Escape") return;
        e.preventDefault();
        skip();
      }

      function onClick() {
        skip();
      }

      document.addEventListener("keydown", onKey, true);
      document.addEventListener("click", onClick, true);

      timer = setInterval(() => {
        index++;
        element.textContent = text.slice(0, index);
        if (index >= text.length) {
          clearInterval(timer);
          document.removeEventListener("keydown", onKey, true);
          document.removeEventListener("click", onClick, true);
          resolve();
        }
      }, speed);
    });
  }

  return { type };
})();
