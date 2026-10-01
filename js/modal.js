// ============================================================
// MODAL - Detalles de proyecto (3 secciones visibles).
// ============================================================

const Modal = (() => {
  const overlay = document.getElementById("modalOverlay");

  function open(project) {
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalSprite").textContent = project.sprite;
    document.getElementById("modalMeta").textContent = `${project.category} • ${project.timeline}`;
    document.getElementById("modalStatus").textContent = project.status;
    document.getElementById("modalProblem").textContent = project.problem;
    document.getElementById("modalSolution").textContent = project.solution;
    document.getElementById("modalResult").textContent = project.result;
    document.getElementById("modalTimeline").textContent = project.timeline;

    const stackEl = document.getElementById("modalStack");
    stackEl.innerHTML = "";
    project.stack.forEach((tech) => {
      const chip = document.createElement("span");
      chip.className = "stack-chip";
      chip.textContent = tech;
      stackEl.appendChild(chip);
    });

    const demoBtn = document.getElementById("modalDemo");
    const githubBtn = document.getElementById("modalGithub");
    const assistantBtn = document.getElementById("modalAssistant");

    if (project.assistant) {
      assistantBtn.href = project.assistant;
      assistantBtn.hidden = false;
    } else {
      assistantBtn.hidden = true;
    }

    if (project.demo) {
      demoBtn.href = project.demo;
      demoBtn.removeAttribute("aria-disabled");
      demoBtn.classList.remove("disabled");
    } else {
      demoBtn.removeAttribute("href");
      demoBtn.setAttribute("aria-disabled", "true");
      demoBtn.classList.add("disabled");
    }

    githubBtn.href = project.github;
    githubBtn.removeAttribute("aria-disabled");
    githubBtn.classList.remove("disabled");

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("modalClose");
    closeBtn.focus();

    // Cerrar con Escape o clic en overlay
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    const onClickOverlay = (e) => {
      if (e.target === overlay) close();
    };

    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", onClickOverlay);

    // Guardar handlers para limpiarlos al cerrar
    overlay._onKey = onKey;
    overlay._onClickOverlay = onClickOverlay;
  }

  function close() {
    if (!overlay.classList.contains("open")) return;
    SoundManager.sfx.close();
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (overlay._onKey) {
      document.removeEventListener("keydown", overlay._onKey);
      delete overlay._onKey;
    }
    if (overlay._onClickOverlay) {
      overlay.removeEventListener("click", overlay._onClickOverlay);
      delete overlay._onClickOverlay;
    }
  }

  function init() {
    document.getElementById("modalClose").addEventListener("click", close);
    // Evitar que clics dentro del modal lo cierren
    document.querySelector(".modal").addEventListener("click", (e) => e.stopPropagation());
  }

  return { init, open, close };
})();
