import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = {
  name: "",
  email: "",
  type: "Web",
  timeline: "Flexible",
  budget: "",
  details: "",
  company: ""
};

export default function Contact() {
  const { data } = useData();
  const { sfx } = useSound();
  const { t } = useLanguage();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | "sent" | "sent-mailto" | "saved"

  // Un servicio de la sección SERVICIOS pre-selecciona el tipo de proyecto
  useEffect(() => {
    const onSelectService = (e) => {
      const type = e.detail && e.detail.type;
      if (!type) return;
      setForm((f) => ({ ...f, type }));
    };
    window.addEventListener("portfolio:select-service", onSelectService);
    return () => window.removeEventListener("portfolio:select-service", onSelectService);
  }, []);

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
      details: form.details.trim(),
      company: form.company
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
    sent: t("contact.success.sent"),
    saved: t("contact.success.saved"),
    "sent-mailto": t("contact.success.mailto")
  };

  const externalUrl = (value, base) => {
    const v = String(value).replace(/[[\]]/g, "").trim();
    return /^https?:\/\//i.test(v) ? v : base + v.replace(/^@/, "");
  };

  const directActions = [
    { id: "email", label: t("contact.email"), value: data.CONTACT_INFO.email, action: () => {
      window.location.href = `mailto:${data.CONTACT_INFO.email.replace(/[[\]]/g, "")}`;
    } },
    { id: "linkedin", label: t("contact.linkedin"), value: data.CONTACT_INFO.linkedin, action: () => {
      window.open(externalUrl(data.CONTACT_INFO.linkedin, "https://www.linkedin.com/in/"), "_blank", "noopener");
    } },
    { id: "github", label: t("contact.github"), value: data.CONTACT_INFO.github, action: () => {
      window.open(externalUrl(data.CONTACT_INFO.github, "https://github.com/"), "_blank", "noopener");
    } },
    { id: "phone", label: t("contact.phone"), value: data.CONTACT_INFO.phone, action: () => {
      window.open("https://wa.me/" + data.CONTACT_INFO.phone.replace(/[^0-9]/g, ""), "_blank", "noopener");
    } }
  ];

  const BUDGETS = ["small", "medium", "large"];
  const TYPES = [
    { id: "Web", key: "contact.type.web" },
    { id: "Sistema", key: "contact.type.system" },
    { id: "Automatización", key: "contact.type.auto" },
    { id: "Otro", key: "contact.type.other" }
  ];
  const TIMELINES = [
    { id: "2-4 semanas", key: "contact.timeline.weeks" },
    { id: "1-3 meses", key: "contact.timeline.months" },
    { id: "Flexible", key: "contact.timeline.flexible" }
  ];

  const fieldClass = (key) => `form-group${errors[key] ? " has-error" : ""}`;

  return (
    <section className="contact-section" id="contacto" aria-labelledby="contactTitle">
      <h2 className="section-title" id="contactTitle">{t("nav.contacto")}</h2>
      <p className="section-sub">{t("contact.sub")}</p>

      <div className="contact-grid">
        {/* PokéNav */}
        <div className="panel pokenav reveal visible">
          <div className="pokenav-lid">
            <span className="pokenav-lid-led" aria-hidden="true" />
            <span className="pokenav-lid-text">{t("contact.pokenav.lid")}</span>
            <span className="pokenav-lid-led blue" aria-hidden="true" />
          </div>
          <div className="pokenav-screen">
            <h3 className="panel-title">{t("contact.pokenav.title")}</h3>
            <div className="contact-list">
              {directActions.map((item) => (
                <div key={item.id} className="contact-item">
                  <p className="contact-item-label">{item.label}</p>
                  <p className="contact-item-value">{String(item.value).replace(/^https?:\/\//i, "")}</p>
                  <div className="contact-item-actions">
                    <button type="button" className="btn-mini" onClick={() => { sfx("click"); item.action(); }}>
                      {item.id === "email" ? t("contact.action.email") : item.id === "linkedin" ? t("contact.action.linkedin") : item.id === "phone" ? t("contact.action.whatsapp") : t("contact.action.github")}
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
          <h3 className="panel-title trade-title" dangerouslySetInnerHTML={{ __html: t("contact.trade.title") }} />
          <div className="form-container trade-screen">
            {status && msg[status] ? (
              <div className="form-success show" role="status">
                <span className="form-success-icon" aria-hidden="true">{msg[status][0]}</span>
                <p className="form-success-text" dangerouslySetInnerHTML={{ __html: msg[status][1] }} />
                <button type="button" className="btn-mini" onClick={resetForm} style={{ marginTop: "16px" }}>{t("contact.back")}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className={fieldClass("name")}>
                  <label htmlFor="fieldName">{t("contact.field.name")}</label>
                  <input
                    type="text"
                    id="fieldName"
                    className="form-input"
                    placeholder={t("contact.field.name.ph")}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  <p className="form-error">{t("contact.field.name.err")}</p>
                </div>

                <div className={fieldClass("email")}>
                  <label htmlFor="fieldEmail">{t("contact.field.email")}</label>
                  <input
                    type="email"
                    id="fieldEmail"
                    className="form-input"
                    placeholder={t("contact.field.email.ph")}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  <p className="form-error">{t("contact.field.email.err")}</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fieldType">{t("contact.field.type")}</label>
                    <select
                      id="fieldType"
                      className="form-select"
                      value={form.type}
                      onChange={(e) => setField("type", e.target.value)}
                    >
                      {TYPES.map((o) => (
                        <option key={o.id} value={o.id}>{t(o.key)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="fieldTimeline">{t("contact.field.timeline")}</label>
                    <select
                      id="fieldTimeline"
                      className="form-select"
                      value={form.timeline}
                      onChange={(e) => setField("timeline", e.target.value)}
                    >
                      {TIMELINES.map((o) => (
                        <option key={o.id} value={o.id}>{t(o.key)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`form-group${errors.budget ? " has-error" : ""}`}>
                  <span className="form-group-label">{t("contact.field.budget")}</span>
                  <div className="radio-group" role="radiogroup" aria-label={t("contact.field.budget")}>
                    {BUDGETS.map((b) => (
                      <label
                        key={b}
                        className={`radio-option${form.budget === t(`contact.budget.${b}`) ? " selected" : ""}`}
                        onClick={() => setField("budget", t(`contact.budget.${b}`))}
                      >
                        <input type="radio" name="budget" value={t(`contact.budget.${b}`)} checked={form.budget === t(`contact.budget.${b}`)} readOnly />
                        {t(`contact.budget.${b}`)}
                      </label>
                    ))}
                  </div>
                  <p className="form-error">{t("contact.field.budget.err")}</p>
                </div>

                <div className={fieldClass("details")}>
                  <label htmlFor="fieldDetails">{t("contact.field.details")}</label>
                  <textarea
                    id="fieldDetails"
                    className="form-textarea"
                    placeholder={t("contact.field.details.ph")}
                    value={form.details}
                    onChange={(e) => setField("details", e.target.value)}
                  />
                  <p className="form-error">{t("contact.field.details.err")}</p>
                </div>

                <button type="submit" className="btn-submit" disabled={status === "sending"}>
                  {status === "sending" ? t("contact.submit.sending") : t("contact.submit")}
                </button>

                {/* Honeypot: oculto a humanos, los bots lo llenan */}
                <div style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }} aria-hidden="true">
                  <label htmlFor="fieldCompany">Company</label>
                  <input
                    type="text"
                    id="fieldCompany"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
