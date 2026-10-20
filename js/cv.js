// ============================================================
// CV - Renderiza el CV (cv.html) desde los datos globales.
// ============================================================

(() => {
  const PORTFOLIO_URL = "https://portafolio-web-three-gamma.vercel.app/";
  const PORTFOLIO_LABEL = "portafolio-web-three-gamma.vercel.app";

  document.addEventListener("DOMContentLoaded", () => {
    document.title = `CV — ${PROFILE.name}`;

    document.getElementById("cvName").textContent = PROFILE.name;
    document.getElementById("cvClass").textContent = PROFILE.class;
    document.getElementById("cvMeta").innerHTML =
      `${PROFILE.location} · <a href="mailto:${CONTACT_INFO.email}">${CONTACT_INFO.email}</a> · ` +
      `<a href="${PORTFOLIO_URL}">${PORTFOLIO_LABEL}</a>`;
    document.getElementById("cvBio").textContent = PROFILE.bio;
    document.getElementById("cvLocation").textContent = PROFILE.location;
    document.getElementById("cvExp").textContent = `${PROFILE.expYears} años`;
    document.getElementById("cvProjects").textContent = `${PROFILE.completedProjects} proyectos`;
    document.getElementById("cvStatus").textContent = PROFILE.status;

    // Skills
    const skillsEl = document.getElementById("cvSkills");
    SKILLS_LIST.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      skillsEl.appendChild(li);
    });

    // Proyectos: impacto, sin stack tecnológico
    const projEl = document.getElementById("cvProjectsList");
    FEATURED_PROJECTS
      .filter((p) => p.id !== "solutionscars")
      .forEach((p) => {
        const item = document.createElement("article");
        item.className = "cv-project";
        item.innerHTML = `
          <div class="cv-project-head">
            <h3 class="cv-project-title">${p.title}</h3>
            <span class="cv-project-date">${p.since || p.status}</span>
          </div>
          <p class="cv-project-context">${p.problem}</p>
          <p class="cv-project-result"><strong>Resultado:</strong> ${p.result}</p>
        `;
        projEl.appendChild(item);
      });

    // Contacto
    const contactEl = document.getElementById("cvContact");
    const items = [
      ["Email", CONTACT_INFO.email, `mailto:${CONTACT_INFO.email}`],
      ["Portfolio", PORTFOLIO_LABEL, PORTFOLIO_URL],
      ["LinkedIn", String(CONTACT_INFO.linkedin).replace(/^https?:\/\//i, ""), CONTACT_INFO.linkedin],
      ["GitHub", String(CONTACT_INFO.github).replace(/^https?:\/\//i, ""), CONTACT_INFO.github],
      ["Teléfono", CONTACT_INFO.phone, `tel:${String(CONTACT_INFO.phone).replace(/\s+/g, "")}`]
    ];
    items.forEach(([label, value, href]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${label}:</strong> <a href="${href}">${value}</a>`;
      contactEl.appendChild(li);
    });

    document.getElementById("cvFooter").textContent = `© ${new Date().getFullYear()} ${PROFILE.name} | Diseño & Código custom`;
  });
})();
