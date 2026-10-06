// IDs estables (independientes del idioma) para el formulario de contacto.

export const CONTACT_TYPE_IDS = ["web", "system", "automation", "other"];

export const CONTACT_TIMELINE_IDS = ["weeks-2-4", "months-1-3", "flexible"];

/** @type {readonly ["small", "medium", "large"]} */
export const CONTACT_BUDGET_IDS = ["small", "medium", "large"];

/** Mapeo desde el campo `type` de SERVICIOS en projects.json */
export const SERVICE_TYPE_TO_CONTACT_TYPE = {
  Web: "web",
  Sistema: "system",
  Automatización: "automation",
  Otro: "other"
};

export const CONTACT_TYPE_LABEL_ES = {
  web: "Web",
  system: "Sistema",
  automation: "Automatización",
  other: "Otro"
};

export const CONTACT_TIMELINE_LABEL_ES = {
  "weeks-2-4": "2-4 semanas",
  "months-1-3": "1-3 meses",
  flexible: "Flexible"
};

export const CONTACT_BUDGET_LABEL_ES = {
  small: "Pequeño",
  medium: "Mediano",
  large: "Grande"
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function labelContactTypeEs(id) {
  return CONTACT_TYPE_LABEL_ES[id] || id;
}

export function labelContactTimelineEs(id) {
  return CONTACT_TIMELINE_LABEL_ES[id] || id;
}

export function labelContactBudgetEs(id) {
  return CONTACT_BUDGET_LABEL_ES[id] || id;
}

/** Quita caracteres de control y trunca el nombre para el asunto del email. */
export function normalizeContactSubjectName(name) {
  const cleaned = String(name)
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim();
  if (cleaned.length <= 80) return cleaned;
  return cleaned.slice(0, 80);
}

export function validateContactFields(body) {
  const errors = [];
  const { name, email, type, timeline, budget, details } = body || {};

  if (!name || typeof name !== "string" || !name.trim() || name.trim().length > 200) {
    errors.push("name");
  }
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("email");
  }
  if (!CONTACT_TYPE_IDS.includes(type)) errors.push("type");
  if (!CONTACT_TIMELINE_IDS.includes(timeline)) errors.push("timeline");
  if (!CONTACT_BUDGET_IDS.includes(budget)) errors.push("budget");
  if (!details || typeof details !== "string" || !details.trim() || details.trim().length > 5000) {
    errors.push("details");
  }

  return errors;
}
