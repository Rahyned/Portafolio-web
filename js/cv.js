// ============================================================
// CV - Renderiza el CV (cv.html) desde los datos globales.
// ============================================================

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.title = `CV — ${PROFILE.name.replace(/[[\]]/g, "")}`;

    document.getElementById("cvName").textContent = PROFILE.name;
    document.getElementById("cvClass").textContent = PROFILE.class;
    document.getElementById("cvTagline").textContent = PROFILE.tagline;
    document.getElementById("cvBio").textContent = PROFILE.bio.replace(/ Presiona cualquier tecla para continuar\.?/i, "");
    document.getElementById("cvLocation").textContent = PROFILE.location;
    document.getElementById("cvExp").textContent = `${PROFILE.expYears} años`;
    document.getElementById("cvProjects").textContent = `${PROFILE.completedProjects} completados`;
    document.getElementById("cvStatus").textContent = PROFILE.status;

    // Skills
    const skillsEl = document.getElementById("cvSkills");
    SKILLS_LIST.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      skillsEl.appendChild(li);
    });

    // Proyectos destacados (primero de cada caja)
    const projEl = document.getElementById("cvProjectsList");
    PROJECT_BOXES.forEach((box) => {
      box.projects.forEach((p) => {
        const item = document.createElement("article");
        item.className = "cv-project";
        const stack = p.stack.join(" • ");
        item.innerHTML = `
          <div class="cv-project-head">
            <h3 class="cv-project-title">${p.sprite} ${p.title}</h3>
            <span class="cv-project-date">${p.timeline}</span>
          </div>
          <p class="cv-project-result"><strong>Resultado:</strong> ${p.result}</p>
          <p class="cv-project-stack">${stack}</p>
        `;
        projEl.appendChild(item);
      });
    });

    // Contacto
    const contactEl = document.getElementById("cvContact");
    const items = [
      ["Email", CONTACT_INFO.email],
      ["LinkedIn", CONTACT_INFO.linkedin],
      ["GitHub", CONTACT_INFO.github],
      ["Teléfono", CONTACT_INFO.phone]
    ];
    items.forEach(([label, value]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${label}:</strong> ${value}`;
      contactEl.appendChild(li);
    });

    document.getElementById("cvFooter").textContent = `© 2024 ${PROFILE.name.replace(/[[\]]/g, "")} | Diseño & Código custom`;
  });
})();
