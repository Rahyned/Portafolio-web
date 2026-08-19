// ============================================================
// CONTACT - Formulario de intercambio + PokéNav directo.
// Validación en cliente. Backend TBD (Fase 3).
// ============================================================

const ContactManager = (() => {
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");
  const formContainer = document.getElementById("formContainer");

  function init() {
    initRadioButtons();
    initDirectActions();
    form.addEventListener("submit", handleSubmit);
    document.getElementById("resetFormBtn").addEventListener("click", resetForm);

    // Limpiar errores al escribir
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => clearError(field));
      field.addEventListener("change", () => clearError(field));
    });
  }

  // Radio buttons del presupuesto
  function initRadioButtons() {
    document.querySelectorAll(".radio-option").forEach((label) => {
      const input = label.querySelector("input");
      input.addEventListener("change", () => {
        document.querySelectorAll(".radio-option").forEach((l) => l.classList.remove("selected"));
        if (input.checked) label.classList.add("selected");
      });
    });
  }

  function setError(field, show) {
    const group = field.closest(".form-group");
    if (group) {
      group.classList.toggle("has-error", show);
    }
  }

  function clearError(field) {
    setError(field, false);
  }

  function validate() {
    let valid = true;

    const name = document.getElementById("fieldName");
    const email = document.getElementById("fieldEmail");
    const details = document.getElementById("fieldDetails");
    const budget = document.querySelector('input[name="budget"]:checked');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim()) { setError(name, true); valid = false; }
    if (!email.value.trim() || !emailRegex.test(email.value)) { setError(email, true); valid = false; }
    if (!details.value.trim()) { setError(details, true); valid = false; }
    if (!budget) { showBudgetError(true); valid = false; }

    return valid;
  }

  function showBudgetError(show) {
    const budgetGroup = document.querySelector('[data-field="budget"]');
    const label = budgetGroup.querySelector(".form-group-label");
    if (show) {
      label.style.color = "var(--accent-red)";
    } else {
      label.style.color = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      SoundManager.sfx.error();
      return;
    }

    SoundManager.sfx.success();
    formContainer.classList.add("glitching");
    setTimeout(() => formContainer.classList.remove("glitching"), 700);

    const data = {
      name: document.getElementById("fieldName").value.trim(),
      email: document.getElementById("fieldEmail").value.trim(),
      type: document.getElementById("fieldType").value,
      timeline: document.getElementById("fieldTimeline").value,
      budget: document.querySelector('input[name="budget"]:checked').value,
      details: document.getElementById("fieldDetails").value.trim()
    };

    const result = await submitToBackend(data);

    form.style.display = "none";
    successBox.classList.add("show");

    const successText = successBox.querySelector(".form-success-text");
    if (result.ok) {
      successText.innerHTML = result.simulated
        ? "¡INTERCAMBIO INICIADO!<br />Tu mensaje fue guardado. Si configurás SMTP, llega por email."
        : "¡INTERCAMBIO INICIADO!<br />Te responderé pronto a tu email.";
    } else {
      const subject = encodeURIComponent("Proyecto freelance: " + data.type);
      const body = encodeURIComponent(`Nombre: ${data.name}\nEmail: ${data.email}\nTipo: ${data.type}\nTimeline: ${data.timeline}\nPresupuesto: ${data.budget}\n\n${data.details}`);
      successText.innerHTML = "¡INTERCAMBIO INICIADO!<br />Tu mensaje de email se abrió listo para enviar. 📧";
      window.open(`mailto:${CONTACT_INFO.email.replace(/[[\]]/g, "")}?subject=${subject}&body=${body}`, "_self");
    }
  }

  // Intenta enviar al backend (server/). Devuelve { ok, simulated }.
  async function submitToBackend(data) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) return { ok: false, simulated: false };
      return await res.json();
    } catch (e) {
      return { ok: false, simulated: false };
    }
  }

  function resetForm() {
    form.reset();
    document.querySelectorAll(".radio-option").forEach((l) => l.classList.remove("selected"));
    form.style.display = "";
    successBox.classList.remove("show");
    formContainer.classList.remove("glitching");
  }

  // PokéNav: acciones directas
  function initDirectActions() {
    document.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        SoundManager.sfx.click();
        const action = btn.dataset.action;
        switch (action) {
          case "email": {
            const addr = CONTACT_INFO.email.replace(/[[\]]/g, "");
            window.location.href = `mailto:${addr}`;
            break;
          }
          case "linkedin":
            window.open("https://www.linkedin.com/in/" + CONTACT_INFO.linkedin.replace(/[[\]]/g, ""), "_blank", "noopener");
            break;
          case "github":
            window.open("https://github.com/" + CONTACT_INFO.github.replace(/[[\]]/g, "").replace(/^@/, ""), "_blank", "noopener");
            break;
        }
      });
    });
  }

  return { init };
})();
