// ============================================================
// API SERVERLESS - POST /api/contact (Vercel)
// Validación, honeypot, origin estricto y rate limit. Envía por
// SMTP (nodemailer) con las env vars: SMTP_HOST, SMTP_PORT,
// SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_EMAIL.
// Sin SMTP configurado responde 503 → el frontend abre mailto.
// ============================================================

import nodemailer from "nodemailer";
import { originAllowed } from "./_lib/origin.js";
import { checkDailyLimit, checkMinInterval } from "./_lib/rateLimit.js";
import {
  labelContactBudgetEs,
  labelContactTimelineEs,
  labelContactTypeEs,
  normalizeContactSubjectName,
  validateContactFields
} from "../src/shared/contactSchema.js";

const CONTACT_MIN_INTERVAL_MS = 30_000;
const CONTACT_DAILY_MAX = 5;

const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_EMAIL
);

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

  const typeLabel = labelContactTypeEs(data.type);
  const timelineLabel = labelContactTimelineEs(data.timeline);
  const budgetLabel = labelContactBudgetEs(data.budget);
  const safeName = normalizeContactSubjectName(data.name);

  const html = `
    <h2>Nuevo proyecto desde el portafolio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Tipo:</strong> ${escapeHtml(typeLabel)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(timelineLabel)}</p>
    <p><strong>Presupuesto:</strong> ${escapeHtml(budgetLabel)}</p>
    <hr>
    <p><strong>Detalles:</strong></p>
    <pre>${escapeHtml(data.details)}</pre>
  `;

  await transporter.sendMail({
    from: `"Portafolio" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[Portafolio] Proyecto de ${safeName} — ${typeLabel}`,
    text: `Nuevo proyecto de ${data.name} (${data.email})\n\nTipo: ${typeLabel}\nTimeline: ${timelineLabel}\nPresupuesto: ${budgetLabel}\n\n${data.details}`,
    html
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!originAllowed(req)) {
    return res.status(403).json({ ok: false, error: "Origen no permitido" });
  }

  if (req.body && typeof req.body.company === "string" && req.body.company.trim() !== "") {
    return res.status(200).json({ ok: true, simulated: false });
  }

  const errors = validateContactFields(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const ip = getClientIp(req);

  if (!(await checkMinInterval(ip, { keyPrefix: "contact", intervalMs: CONTACT_MIN_INTERVAL_MS }))) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos. Esperá un momento." });
  }

  try {
    if (!(await checkDailyLimit(ip, { keyPrefix: "contact", maxPerDay: CONTACT_DAILY_MAX }))) {
      return res.status(429).json({ ok: false, error: "Llegaste al límite diario de envíos." });
    }
  } catch {
    return res.status(503).json({ ok: false, error: "Servicio de contacto temporalmente no disponible." });
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
