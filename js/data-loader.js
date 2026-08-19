// ============================================================
// DATA LOADER - Carga la fuente canónica data/projects.json.
// Si no hay servidor o el fetch falla, usa el fallback embebido
// en data/projects.js (funciona abriendo index.html por file://).
// ============================================================

const DataLoader = (() => {
  async function load() {
    try {
      const res = await fetch("data/projects.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();

      if (d.ANALYTICS) ANALYTICS = d.ANALYTICS;
      if (d.PROFILE) PROFILE = d.PROFILE;
      if (d.BADGES) BADGES = d.BADGES;
      if (d.PROJECT_BOXES) PROJECT_BOXES = d.PROJECT_BOXES;
      if (d.BLOG) BLOG = d.BLOG;
      if (d.CONTACT_INFO) CONTACT_INFO = d.CONTACT_INFO;
      if (d.SKILLS_LIST) SKILLS_LIST = d.SKILLS_LIST;
    } catch (e) {
      // Fallback silencioso a los datos locales embebidos.
    }
    return true;
  }

  return { load };
})();
