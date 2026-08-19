// ============================================================
// SERVIDOR DEL PORTAFOLIO
// - Sirve la web estática (carpeta padre)
// - POST /api/contact: valida y envía el formulario por email
//   (SMTP vía Nodemailer). Si no hay SMTP configurado, guarda
//   el mensaje en server/inbox/messages.jsonl y responde ok.
// ============================================================

import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_ROOT = path.join(__dirname, "..");
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");
const INBOX_DIR = path.join(__dirname, "inbox");
const INBOX_FILE = path.join(INBOX_DIR, "messages.jsonl");
const PORT = process.env.PORT || 8080;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TYPES = ["Web", "Sistema", "Automatización", "Otro"];
const ALLOWED_TIMELINES = ["ASAP", "2-4 semanas", "1-3 meses", "Flexible"];
const ALLOWED_BUDGETS = ["Pequeño", "Mediano", "Grande"];

const smtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_EMAIL
);

const app = express();
app.use(express.json({ limit: "10kb" }));

// ---------- Validación ----------
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

// ---------- Envío de email ----------
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendEmail(data) {
  const transporter = createTransport();
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

// ---------- Persistencia local (fallback sin SMTP) ----------
function saveToInbox(data) {
  fs.mkdirSync(INBOX_DIR, { recursive: true });
  const entry = {
    at: new Date().toISOString(),
    ...data
  };
  fs.appendFileSync(INBOX_FILE, JSON.stringify(entry) + "\n", "utf8");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

// ---------- Rate limit simple (en memoria, 30s entre envíos por IP) ----------
const rateLimit = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const last = rateLimit.get(ip) || 0;
  if (now - last < 30_000) return false;
  rateLimit.set(ip, now);
  return true;
}

// ---------- Rutas ----------
// Si existe el build de React (client/dist), se sirve primero.
// Los archivos que no estén ahí (cv.html, data/, etc.) caen al static root.
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
}
app.use(express.static(STATIC_ROOT));

app.post("/api/contact", async (req, res) => {
  const errors = validateContact(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos. Esperá un momento." });
  }

  const data = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    type: req.body.type,
    timeline: req.body.timeline,
    budget: req.body.budget,
    details: req.body.details.trim()
  };

  if (smtpConfigured) {
    try {
      await sendEmail(data);
      return res.json({ ok: true, simulated: false });
    } catch (err) {
      console.error("Error enviando email:", err.message);
      saveToInbox(data);
      return res.status(502).json({ ok: false, error: "El email no se pudo enviar." });
    }
  }

  saveToInbox(data);
  return res.json({ ok: true, simulated: true });
});

app.listen(PORT, () => {
  console.log(`\n  ═══════════════════════════════════════`);
  console.log(`  ▸ Portafolio:  http://localhost:${PORT}`);
  console.log(`  ▸ Frontend:    ${fs.existsSync(CLIENT_DIST) ? "React (client/dist)" : "Vanilla (raíz) — build con: cd client && npm run build"}`);
  if (smtpConfigured) {
    console.log(`  ▸ Email:       SMTP configurado ✔`);
  } else {
    console.log(`  ▸ Email:       SMTP NO configurado — los mensajes se guardan en server/inbox/`);
    console.log(`  ▸ Para activar, copiá server/.env.example a server/.env y completá los datos.`);
  }
  console.log(`  ═══════════════════════════════════════\n`);
});
