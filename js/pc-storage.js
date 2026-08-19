// ============================================================
// PC STORAGE - Cajas de proyectos + grilla de almacenamiento.
// Grid fijo de 15 slots (5x3); proyectos ocupados + vacíos.
// ============================================================

const PCStorage = (() => {
  const GRID_SLOTS = 15;
  let currentBox = 0;
  let tabsEl = null;
  let gridEl = null;

  function init() {
    tabsEl = document.getElementById("pcTabs");
    gridEl = document.getElementById("pcGrid");
    renderTabs();
    renderGrid(true);
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    PROJECT_BOXES.forEach((box, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pc-tab" + (index === currentBox ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", index === currentBox ? "true" : "false");
      btn.textContent = `${box.icon} ${box.label}`;
      btn.addEventListener("click", () => switchBox(index));
      tabsEl.appendChild(btn);
    });
  }

  function switchBox(index) {
    if (index === currentBox) return;
    currentBox = index;
    SoundManager.sfx.box();

    // Actualizar tabs
    Array.from(tabsEl.children).forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
      btn.setAttribute("aria-selected", i === index ? "true" : "false");
    });

    renderGrid(false);
  }

  function renderGrid(initial) {
    gridEl.classList.add("fade-out");

    setTimeout(() => {
      gridEl.innerHTML = "";
      const box = PROJECT_BOXES[currentBox];
      const projects = box.projects;

      for (let i = 0; i < GRID_SLOTS; i++) {
        const slot = document.createElement("button");
        slot.type = "button";
        slot.dataset.idx = String(i + 1).padStart(2, "0");

        if (i < projects.length) {
          const project = projects[i];
          slot.className = "pc-slot project";
          slot.innerHTML = `<span aria-hidden="true">${project.sprite}</span>`;
          slot.setAttribute("aria-label", `Proyecto: ${project.title}`);
          const tooltip = document.createElement("span");
          tooltip.className = "slot-tooltip";
          tooltip.textContent = project.title;
          slot.appendChild(tooltip);
          slot.addEventListener("click", () => {
            SoundManager.sfx.open();
            Modal.open(project);
          });
        } else {
          slot.className = "pc-slot empty";
          slot.setAttribute("aria-label", "Slot vacío");
          slot.disabled = true;
        }

        gridEl.appendChild(slot);
      }

      gridEl.classList.remove("fade-out");
      gridEl.classList.add("fade-in");
      setTimeout(() => gridEl.classList.remove("fade-in"), 450);
    }, 300);
  }

  return { init };
})();
