# CHANGELOG

## 2026-10-05 — fix/auditoria-2026-10-05

### Added

- `client/src/shared/contactSchema.js` con IDs estables de tipo, timeline y presupuesto.
- `client/api/_lib/origin.js` y `client/api/_lib/rateLimit.js` (origin estricto + Upstash/memoria).
- Vitest en `client/`, tests de `api/contact.js`, `api/chat.js` y smoke de dependencias.
- Workflow `.github/workflows/client.yml` (Node 22: lint, test, build).
- Entrada CSP en `client/vercel.json` (excepto rutas `/asistente/`).

### Changed

- Formulario de contacto: envía IDs de presupuesto; timeout de envío 12 s; mailto solo en 503/red; errores 5xx con enlace manual.
- Chat: `max_tokens` 700, origin estricto, fail-closed de cuota Upstash en producción, abort al cerrar el cliente.
- `.gitignore` raíz: `.env`, `.env.*`, `!.env.example`, `.vercel/`.
- `README.md` y `AGENTS.md` (flujo de entrega y documentación de APIs).

### Fixed

- [A1] `nodemailer` declarado en `client/package.json` (contacto en Vercel).
- [M1] Presupuesto en inglés rechazado: validación por ID `small|medium|large`.
- [M2] Costo/abuso del chat LLM en producción sin Upstash.
- [M3] Anti-abuso de `/api/contact` (origin, rate limit 30 s / 5 día, asunto normalizado).

### Files

- `.gitignore`
- `.github/workflows/client.yml`
- `AGENTS.md`
- `CHANGELOG.md`
- `README.md`
- `client/api/_lib/origin.js`
- `client/api/_lib/rateLimit.js`
- `client/api/chat.js`
- `client/api/chat.test.js`
- `client/api/contact.js`
- `client/api/contact.test.js`
- `client/api/api-deps.test.js`
- `client/package.json`
- `client/package-lock.json`
- `client/src/components/Contact.jsx`
- `client/src/i18n/translations.js`
- `client/src/shared/contactSchema.js`
- `client/vercel.json`
- `client/vite.config.js`

### Tests

- `npm test` en `client/`: contacto (405, 403, 400, budget small→Pequeño, honeypot, 503 SMTP, 429, asunto), chat (403, 400, 503 LLM, 503 prod sin Upstash, max_tokens 700), smoke de imports en `api/`.
- Verificado en `client/`: `npm test` → 15/15 OK; `npm run lint` → 0 errores (warnings preexistentes); `npm run build` → OK. (`npm ci` puede fallar en Windows si un binario de rolldown está bloqueado; en CI/Linux usar `npm ci`.)

### CSP (preview)

Revisar en la consola del deploy de preview:

- Violaciones de `style-src` por estilos inline (`style={{…}}` en React) — si aparecen, habría que añadir `'unsafe-inline'` o mover a clases CSS.
- Carga de fuentes Google (`fonts.googleapis.com` / `fonts.gstatic.com`).
- Videos o audio en `media-src` (actualmente solo `'self'`).
- Peticiones del chat Oak a `/api/chat` (`connect-src 'self'`).
