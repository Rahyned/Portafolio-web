// ============================================================
// API SERVERLESS - POST /api/contact (Vercel)
// Validación, honeypot y rate limit en memoria. Envía por
// SMTP (nodemailer) con las env vars: SMTP_HOST, SMTP_PORT,
// SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_EMAIL.
// Sin SMTP configurado responde 503 → el frontend abre mailto.
// ============================================================

import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = ["Web", "Sistema", "Automatización", "Otro"];
const ALLOWED_TIMELINES = ["2-4 semanas", "1-3 meses", "Flexible"];
const ALLOWED_BUDGETS = ["Pequeño", "Mediano", "Grande"];

const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_EMAIL
);

// Rate limit simple (en memoria, 30s entre envíos por IP)
const rateLimit = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimit.get(ip) || 0;
  if (now - last < 30_000) return false;
  rateLimit.set(ip, now);
  return true;
}

function validateContact(body) {
  const errors = [];
  const { name, email, type, timeline, budget, details } = body || {};

  if (!name || typeof name !== "string" || !name.trim() || name.trim().length > 200) {
    errors.push("name");
  }
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("email");
  }
  if (!ALLOWED_TYPES.includes(type)) errors.push("type");
  if (!ALLOWED_TIMELINES.includes(timeline)) errors.push("timeline");
  if (!ALLOWED_BUDGETS.includes(budget)) errors.push("budget");
  if (!details || typeof details !== "string" || !details.trim() || details.trim().length > 5000) {
    errors.push("details");
  }

  return errors;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  return req.headers["x-real-ip"] || "unknown";
}

async function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const html = `
    <h2>Nuevo proyecto desde el portafolio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Tipo:</strong> ${escapeHtml(data.type)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
    <p><strong>Presupuesto:</strong> ${escapeHtml(data.budget)}</p>
    <hr>
    <p><strong>Detalles:</strong></p>
    <pre>${escapeHtml(data.details)}</pre>
  `;

  await transporter.sendMail({
    from: `"Portafolio" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[Portafolio] Proyecto de ${data.name} — ${data.type}`,
    text: `Nuevo proyecto de ${data.name} (${data.email})\n\nTipo: ${data.type}\nTimeline: ${data.timeline}\nPresupuesto: ${data.budget}\n\n${data.details}`,
    html
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Honeypot: los humanos nunca llenan el campo oculto "company"
  if (req.body && typeof req.body.company === "string" && req.body.company.trim() !== "") {
    return res.status(200).json({ ok: true, simulated: false });
  }

  const errors = validateContact(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos. Esperá un momento." });
  }

  if (!smtpConfigured) {
    return res.status(503).json({ ok: false, error: "Servicio de email no disponible." });
  }

  const data = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    type: req.body.type,
    timeline: req.body.timeline,
    budget: req.body.budget,
    details: req.body.details.trim()
  };

  try {
    await sendEmail(data);
    return res.status(200).json({ ok: true, simulated: false });
  } catch (err) {
    console.error("Error enviando email:", err.message);
    return res.status(502).json({ ok: false, error: "El email no se pudo enviar." });
  }
}
