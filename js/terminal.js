// ============================================================
// TERMINAL - Easter egg interactivo (tecla T).
// Comandos: help | projects | skills | about | contact | cv | clear
// ============================================================

const Terminal = (() => {
  const overlay = document.getElementById("terminalOverlay");
  const body = document.getElementById("terminalBody");
  const input = document.getElementById("terminalInput");
  let open = false;

  const COMMANDS = {
    help: () => [
      { text: "COMANDOS DISPONIBLES:", cls: "term-ok" },
      { text: "  help       - esta ayuda", cls: "" },
      { text: "  projects   - lista de proyectos", cls: "" },
      { text: "  skills     - stack técnico", cls: "" },
      { text: "  about      - sobre mí", cls: "" },
      { text: "  contact    - formas de contacto", cls: "" },
      { text: "  cv         - descargar CV", cls: "" },
      { text: "  clear      - limpiar terminal", cls: "" }
    ],
    projects: () => {
      const lines = [{ text: "PROYECTOS:", cls: "term-ok" }];
      PROJECT_BOXES.forEach((box) => {
        lines.push({ text: `\n[${box.label}]`, cls: "term-info" });
        box.projects.forEach((p) => {
          lines.push({ text: `  ${p.sprite} ${p.title} — ${p.timeline} (${p.status})`, cls: "" });
        });
      });
      return lines;
    },
    skills: () => {
      const lines = [{ text: "STACK TECNICO:", cls: "term-ok" }];
      SKILLS_LIST.forEach((s) => lines.push({ text: `  ${s}`, cls: "" }));
      return lines;
    },
    about: () => [
      { text: `NOMBRE: ${PROFILE.name}`, cls: "" },
      { text: `CLASE: ${PROFILE.class}`, cls: "" },
      { text: `NIVEL: ${PROFILE.level}/${PROFILE.maxLevel}`, cls: "" },
      { text: `EXP: ${PROFILE.expYears} años | ${PROFILE.completedProjects} proyectos`, cls: "" },
      { text: `ZONA: ${PROFILE.location}`, cls: "" },
      { text: `ESTADO: ${PROFILE.status}`, cls: "term-warn" }
    ],
    contact: () => [
      { text: `EMAIL: ${CONTACT_INFO.email}`, cls: "" },
      { text: `LINKEDIN: ${String(CONTACT_INFO.linkedin).replace(/^https?:\/\//i, "")}`, cls: "" },
      { text: `GITHUB: ${String(CONTACT_INFO.github).replace(/^https?:\/\//i, "")}`, cls: "" },
      { text: `TELEFONO: ${CONTACT_INFO.phone}`, cls: "" }
    ],
    cv: () => {
      window.open(CONTACT_INFO.cvUrl || "cv.html", "_blank", "noopener");
      return [{ text: "ABRIENDO CV (imprimible)...", cls: "term-ok" }];
    },
    clear: () => {
      body.innerHTML = "";
      return [];
    }
  };

  function writeLine({ text, cls = "" }) {
    const div = document.createElement("div");
    div.className = "term-line " + cls;
    div.textContent = text;
    body.appendChild(div);
  }

  function writePrompt() {
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = '<span class="term-prompt">$&gt;</span> <span class="term-cmd"></span>';
    body.appendChild(div);
    return div.querySelector(".term-cmd");
  }

  function execute(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    writePrompt().textContent = cmdRaw.trim();
    body.scrollTop = body.scrollHeight;

    if (!cmd) return;

    if (COMMANDS[cmd]) {
      COMMANDS[cmd]().forEach((line) => {
        writeLine(line);
        body.scrollTop = body.scrollHeight;
      });
    } else {
      writeLine({ text: `ERROR: '${cmdRaw}' no es un comando válido. Usa 'help'.`, cls: "term-warn" });
    }
  }

  function openTerminal() {
    if (open) return;
    open = true;
    SoundManager.sfx.open();
    body.innerHTML = "";
    writeLine({ text: "LAUTARO.SYS — TERMINAL RETRO v1.0", cls: "term-ok" });
    writeLine({ text: "Escribe 'help' para ver los comandos disponibles.", cls: "" });
    writeLine({ text: "", cls: "" });
    overlay.classList.add("open");
    setTimeout(() => input.focus(), 100);
  }

  function closeTerminal() {
    if (!open) return;
    open = false;
    SoundManager.sfx.close();
    overlay.classList.remove("open");
    input.value = "";
  }

  function init() {
    document.getElementById("terminalClose").addEventListener("click", closeTerminal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeTerminal();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        execute(input.value);
        input.value = "";
        body.scrollTop = body.scrollHeight;
      } else if (e.key === "Escape") {
        closeTerminal();
      }
    });

    // Abrir con tecla T (global, escucha en main.js para no duplicar)
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
      if (!typing && key === "t") {
        e.preventDefault();
        if (open) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
    });
  }

  return { init, open: openTerminal, close: closeTerminal };
})();
