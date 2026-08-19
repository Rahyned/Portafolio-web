import { useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";

const BUDGETS = ["Pequeño", "Mediano", "Grande"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = {
  name: "",
  email: "",
  type: "Web",
  timeline: "ASAP",
  budget: "",
  details: ""
};

export default function Contact() {
  const { data } = useData();
  const { sfx } = useSound();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sent" | "sent-mailto" | "saved"

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = true;
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) next.email = true;
    if (!form.budget) next.budget = true;
    if (!form.details.trim()) next.details = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitToBackend = async (payload) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      sfx("error");
      return;
    }

    sfx("success");
    setStatus("sending");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      type: form.type,
      timeline: form.timeline,
      budget: form.budget,
      details: form.details.trim()
    };

    const result = await submitToBackend(payload);

    if (result && result.ok) {
      setStatus(result.simulated ? "saved" : "sent");
    } else {
      const subject = encodeURIComponent("Proyecto freelance: " + payload.type);
      const body = encodeURIComponent(
        `Nombre: ${payload.name}\nEmail: ${payload.email}\nTipo: ${payload.type}\nTimeline: ${payload.timeline}\nPresupuesto: ${payload.budget}\n\n${payload.details}`
      );
      window.open(`mailto:${data.CONTACT_INFO.email.replace(/[[\]]/g, "")}?subject=${subject}&body=${body}`, "_self");
      setStatus("sent-mailto");
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus(null);
  };

  const msg = {
    sent: ["🎉", "¡INTERCAMBIO INICIADO!<br />Te responderé pronto a tu email."],
    saved: ["🎉", "¡INTERCAMBIO INICIADO!<br />Tu mensaje fue guardado. Si configurás SMTP, llega por email."],
    "sent-mailto": ["📧", "¡INTERCAMBIO INICIADO!<br />Tu email se abrió listo para enviar."]
  };

  const directActions = [
    { id: "email", label: "📧 EMAIL", value: data.CONTACT_INFO.email, action: () => {
      window.location.href = `mailto:${data.CONTACT_INFO.email.replace(/[[\]]/g, "")}`;
    } },
    { id: "linkedin", label: "💼 LINKEDIN", value: data.CONTACT_INFO.linkedin, action: () => {
      window.open("https://www.linkedin.com/in/" + data.CONTACT_INFO.linkedin.replace(/[[\]]/g, ""), "_blank", "noopener");
    } },
    { id: "github", label: "🔗 GITHUB", value: data.CONTACT_INFO.github, action: () => {
      window.open("https://github.com/" + data.CONTACT_INFO.github.replace(/[[\]]/g, "").replace(/^@/, ""), "_blank", "noopener");
    } }
  ];

  const fieldClass = (key) => `form-group${errors[key] ? " has-error" : ""}`;

  return (
    <section className="contact-section" id="contacto" aria-labelledby="contactTitle">
      <h2 className="section-title" id="contactTitle">CONTACTO</h2>
      <p className="section-sub">Elige un medio o inicia un intercambio.</p>

      <div className="contact-grid">
        {/* PokéNav */}
        <div className="panel pokenav reveal visible">
          <div className="pokenav-lid">
            <span className="pokenav-lid-led" aria-hidden="true" />
            <span className="pokenav-lid-text">POKÉNAV v2</span>
            <span className="pokenav-lid-led blue" aria-hidden="true" />
          </div>
          <div className="pokenav-screen">
            <h3 className="panel-title">📡 CONTACTOS</h3>
            <div className="contact-list">
              {directActions.map((item) => (
                <div key={item.id} className="contact-item">
                  <p className="contact-item-label">{item.label}</p>
                  <p className="contact-item-value">{item.value}</p>
                  <div className="contact-item-actions">
                    <button type="button" className="btn-mini" onClick={() => { sfx("click"); item.action(); }}>
                      {item.id === "email" ? "ENVIAR" : item.id === "linkedin" ? "ABRIR" : "VER PERFIL"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pokenav-btnrow" aria-hidden="true">
            <span className="pokenav-dot" />
            <span className="pokenav-dot" />
            <span className="pokenav-dot" />
          </div>
        </div>

        {/* Formulario */}
        <div className="panel trade-machine reveal visible">
          <h3 className="panel-title trade-title">🤝 ¿TIENES UN PROYECTO?<br />INICIA UN INTERCAMBIO</h3>
          <div className="form-container trade-screen">
            {status && msg[status] ? (
              <div className="form-success show" role="status">
                <span className="form-success-icon" aria-hidden="true">{msg[status][0]}</span>
                <p className="form-success-text" dangerouslySetInnerHTML={{ __html: msg[status][1] }} />
                <button type="button" className="btn-mini" onClick={resetForm} style={{ marginTop: "16px" }}>VOLVER</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className={fieldClass("name")}>
                  <label htmlFor="fieldName">NOMBRE</label>
                  <input
                    type="text"
                    id="fieldName"
                    className="form-input"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  <p className="form-error">Ingresá tu nombre.</p>
                </div>

                <div className={fieldClass("email")}>
                  <label htmlFor="fieldEmail">EMAIL</label>
                  <input
                    type="email"
                    id="fieldEmail"
                    className="form-input"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  <p className="form-error">Ingresá un email válido.</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fieldType">TIPO DE PROYECTO</label>
                    <select
                      id="fieldType"
                      className="form-select"
                      value={form.type}
                      onChange={(e) => setField("type", e.target.value)}
                    >
                      {["Web", "Sistema", "Automatización", "Otro"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fieldTimeline">TIMELINE</label>
                    <select
                      id="fieldTimeline"
                      className="form-select"
                      value={form.timeline}
                      onChange={(e) => setField("timeline", e.target.value)}
                    >
                      {["ASAP", "2-4 semanas", "1-3 meses", "Flexible"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`form-group${errors.budget ? " has-error" : ""}`}>
                  <span className="form-group-label">PRESUPUESTO</span>
                  <div className="radio-group" role="radiogroup" aria-label="Presupuesto">
                    {BUDGETS.map((b) => (
                      <label
                        key={b}
                        className={`radio-option${form.budget === b ? " selected" : ""}`}
                        onClick={() => setField("budget", b)}
                      >
                        <input type="radio" name="budget" value={b} checked={form.budget === b} readOnly />
                        {b}
                      </label>
                    ))}
                  </div>
                  <p className="form-error">Elegí un presupuesto.</p>
                </div>

                <div className={fieldClass("details")}>
                  <label htmlFor="fieldDetails">DESCRIPCIÓN / DETALLES</label>
                  <textarea
                    id="fieldDetails"
                    className="form-textarea"
                    placeholder="Contame sobre tu proyecto..."
                    value={form.details}
                    onChange={(e) => setField("details", e.target.value)}
                  />
                  <p className="form-error">Contanos un poco sobre el proyecto.</p>
                </div>

                <button type="submit" className="btn-submit" disabled={status === "sending"}>
                  {status === "sending" ? "ENVIANDO..." : "✅ CONFIRMAR INTERCAMBIO"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
