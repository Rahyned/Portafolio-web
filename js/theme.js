// ============================================================
// THEME - Selector de tema (Red | Blue | Dark | Konami)
// Persistencia en LocalStorage.
// ============================================================

const ThemeManager = (() => {
  const STORAGE_KEY = "portfolio_theme";
  const THEMES = ["dark", "red", "blue", "konami"];
  const html = document.documentElement;

  function apply(theme) {
    html.classList.remove(...THEMES.map((t) => `theme-${t}`));
    if (theme !== "dark") {
      html.classList.add(`theme-${theme}`);
    }
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      const active = btn.dataset.theme === theme || (theme === "konami" && btn.dataset.theme === "dark");
      btn.classList.toggle("active", active);
    });
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || "dark";
    apply(THEMES.includes(saved) ? saved : "dark");

    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        SoundManager.sfx.click();
        apply(btn.dataset.theme);
      });
    });
  }

  return { init, apply };
})();
