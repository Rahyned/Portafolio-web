import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import {
  CONTACT_BUDGET_IDS,
  CONTACT_TYPE_IDS,
  SERVICE_TYPE_TO_CONTACT_TYPE
} from "../shared/contactSchema.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMIT_TIMEOUT_MS = 12_000;

const INITIAL_FORM = {
  name: "",
  email: "",
  type: "web",
  timeline: "flexible",
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
  const [status, setStatus] = useState(null); // null | sending | sent | saved | sent-mailto | error-server
  const [serverMailto, setServerMailto] = useState("");

  useEffect(() => {
    const onSelectService = (e) => {
      const rawType = e.detail && e.detail.type;
      if (!rawType) return;
      const mapped = SERVICE_TYPE_TO_CONTACT_TYPE[rawType] || rawType;
      if (CONTACT_TYPE_IDS.includes(mapped)) {
        setForm((f) => ({ ...f, type: mapped }));
      }
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

  const buildMailtoHref = (payload) => {
    const subject = encodeURIComponent("Proyecto freelance: " + payload.type);
    const body = encodeURIComponent(
      `Nombre: ${payload.name}\nEmail: ${payload.email}\nTipo: ${payload.type}\nTimeline: ${payload.timeline}\nPresupuesto: ${payload.budget}\n\n${payload.details}`
    );
    const email = data.CONTACT_INFO.email.replace(/[[\]]/g, "");
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const submitToBackend = async (payload) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS)
      });
      let body = {};
      try {
        body = await res.json();
      } catch {
        body = {};
      }
      return { ok: res.ok, status: res.status, body, networkError: false };
    } catch {
      return { ok: false, status: 0, body: {}, networkError: true };
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
    setServerMailto("");

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
    const mailto = buildMailtoHref(payload);

    if (result.networkError || result.status === 503) {
      window.open(mailto, "_self");
      setStatus("sent-mailto");
      return;
    }

    if (result.status === 400 && Array.isArray(result.body.errors)) {
      const next = {};
      for (const key of result.body.errors) {
        if (typeof key === "string") next[key] = true;
      }
      setErrors(next);
      setStatus(null);
      sfx("error");
      return;
    }

    if (result.ok && result.body.ok) {
      setStatus(result.body.simulated ? "saved" : "sent");
      return;
    }

    if (result.status >= 500) {
      setServerMailto(mailto);
      setStatus("error-server");
      sfx("error");
      return;
    }

    setServerMailto(mailto);
    setStatus("error-server");
    sfx("error");
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStatus(null);
    setServerMailto("");
  };

  const msg = {
    sent: t("contact.success.sent"),
    saved: t("contact.success.saved"),
    "sent-mailto": t("contact.success.mailto"),
    "error-server": [
      t("contact.error.server")[0],
      t("contact.error.server")[1].replace("{mailto}", serverMailto)
    ]
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

  const TYPES = [
    { id: "web", key: "contact.type.web" },
    { id: "system", key: "contact.type.system" },
    { id: "automation", key: "contact.type.auto" },
    { id: "other", key: "contact.type.other" }
  ];
  const TIMELINES = [
    { id: "weeks-2-4", key: "contact.timeline.weeks" },
    { id: "months-1-3", key: "contact.timeline.months" },
    { id: "flexible", key: "contact.timeline.flexible" }
  ];

  const fieldClass = (key) => `form-group${errors[key] ? " has-error" : ""}`;

  const showSuccessPanel = status && msg[status] && status !== "sending";

  return (
    <section className="contact-section" id="contacto" aria-labelledby="contactTitle">
      <h2 className="section-title reveal" id="contactTitle">{t("nav.contacto")}</h2>
      <p className="section-sub reveal">{t("contact.sub")}</p>

      <div className="contact-grid">
        <div className="panel pokenav reveal">
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

        <div className="panel trade-machine reveal">
          <h3 className="panel-title trade-title" dangerouslySetInnerHTML={{ __html: t("contact.trade.title") }} />
          <div className="form-container trade-screen">
            {showSuccessPanel ? (
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
                    {CONTACT_BUDGET_IDS.map((b) => (
                      <label
                        key={b}
                        className={`radio-option${form.budget === b ? " selected" : ""}`}
                        onClick={() => setField("budget", b)}
                      >
                        <input type="radio" name="budget" value={b} checked={form.budget === b} readOnly />
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
