# CHANGELOG

## 2026-10-27 — feat(proyectos): retirar Florería Susi

### Removed

- Proyecto `floreria-susi` de la caja "Web" en los datos canónicos, el fallback embebido y el contenido EN.
- Su sprite (`sprite-floreria-susi.svg`), su registro en el mapa de sprites y su mención en el contexto de Oak.

### Files

- `data/projects.json`
- `data/projects.js`
- `client/src/data/fallback.js`
- `client/src/data/oakKnowledge.js`
- `client/src/i18n/content.js`
- `client/src/sprites/registry.js`
- `client/src/sprites/projects.js`
- `client/public/sprites/sprite-floreria-susi.svg`
- `CHANGELOG.md`

### Tests

- `npm run lint`, `npm test` y `npm run build` en `client/`.

## 2026-10-27 — feat(proyectos): icono pixel-art del Organizador

### Added

- Sprite SVG 16×16 para el proyecto `organizador` (`sprite-organizador.svg`), registrado en el mapa de sprites de proyectos.

### Files

- `client/public/sprites/sprite-organizador.svg`
- `client/src/sprites/registry.js`
- `CHANGELOG.md`

### Tests

- `npm run lint`, `npm test` y `npm run build` en `client/`.

## 2026-10-24 — fix(seo): título de pestaña lautaro.dev

### Changed

- `<title>`, `og:title`, `twitter:title` y `og:site_name` pasan a `lautaro.dev` (minúscula, sin “— Portafolio Retro”).

### Files

- `client/index.html`
- `index.html`
- `CHANGELOG.md`

### Tests

- `npm test` y `npm run build` en `client/` OK.

## 2026-10-22 — feat(hero): simplificar llamados a la acción

### Changed

- Hero con dos CTAs: "VER PROYECTOS" (scroll a `#proyectos`) y "CONTACTO" (scroll a `#contacto`), en fila en escritorio y apilados a ancho completo bajo 480 px.
- "Descargar CV" pasó a link de texto pixel debajo de los botones.
- Franja de datos rápidos sin caja; puntito verde pixel antes de la disponibilidad.

### Files

- `client/src/components/Hero.jsx`
- `client/src/styles/hero.css`
- `client/src/i18n/translations.js`

### Tests

- `npm run lint`, `npm test` y `npm run build` en `client/`.

## 2026-10-20 — feat/renovacion-portfolio

### Added

- Cinco proyectos destacados con problema, qué se construyó, stack, resultado, estado y links reales en `data/projects.json`, `data/projects.js` y `client/src/data/fallback.js`.
- Carrusel de proyectos destacados: 2 cartas en escritorio / 1 en celular, auto-avance cada 5 s con bucle sin salto, pausa en hover/foco, flechas, puntitos, swipe, y respeto de `prefers-reduced-motion`.
- Espacio de media 16:9 en cada carta; si el proyecto declara video, se reproduce muteado en bucle solo cuando la carta está visible.
- Videos demo web de SolutionsCars y STELLA (`*-demo.mp4` + `*-poster.jpg`) en el carrusel.
- Controles nativos en los videos del carrusel (play/pausa/seek) y botón para ampliar en lightbox; sin autoplay.
- El carrusel pausa el auto-avance con la pestaña oculta y reancla el track al volver (evita que “desaparezca”).
- Tests de la lógica del carrusel (avance, bucle y pausa) en `featuredCarouselLogic.test.js`.
- Sección "Proyectos destacados" con tarjetas y capturas (`rag-demo.gif`, `pronostico.png`) antes de la PC.
- Caso de estudio de SolutionsCars en `/proyectos/solutionscars` con arquitectura, decisiones, problemas y próximos pasos.
- Test de datos de fallback: orden de destacados, links de perfil y ausencia de la palabra "tests".
- CV en PDF A4 de dos páginas en `client/public/cv/Lautaro-Rodriguez-CV.pdf` y enlace "Descargar CV (PDF)" en el footer.

### Changed

- Perfil nuevo: nombre, rol, tagline, datos rápidos y bio completa.
- Portada con titular, frase, datos rápidos y botones de contacto/CV.
- Bio sin efecto de tipeo y con texto legible.
- Tipografía: Inter para cuerpo y títulos, JetBrains Mono para etiquetas, botones, código y stack; se quitaron Press Start 2P, VT323 y Silkscreen.
- Contraste del texto secundario y tamaños base de 16 px; títulos de sección más grandes.
- La sección de la PC pasó a llamarse "Otros proyectos".
- CV reordenado: perfil, experiencia en SolutionsCars desde marzo de 2026, proyectos sin stack, stack técnico y contacto.
- El modal de proyecto solo muestra Demo y GitHub cuando existen; se quitó el botón del asistente.
- Textos en inglés reemplazados por contenido nuevo en español.

### Fixed

- "desplegues" corregido en los datos.
- Eliminadas las cantidades de tests de los textos del sitio y del CV.
- Enlaces nulos de proyectos privados ya no se renderizan.
- Sin desborde horizontal en 375 px y 1440 px.

### Files

- `CHANGELOG.md`
- `client/index.html`
- `client/src/App.jsx`
- `client/src/main.jsx`
- `client/src/data/fallback.js`
- `client/src/data/fallback.test.js`
- `client/src/data/caseStudies.js`
- `client/src/components/Hero.jsx`
- `client/src/components/TrainerCard.jsx`
- `client/src/components/FeaturedProjects.jsx`
- `client/src/components/FeaturedCarousel.jsx`
- `client/src/components/featuredCarouselLogic.js`
- `client/src/components/featuredCarouselLogic.test.js`
- `client/src/components/ProjectCard.jsx`
- `client/src/components/CaseStudy.jsx`
- `client/src/components/ProjectModal.jsx`
- `client/src/components/Footer.jsx`
- `client/src/i18n/translations.js`
- `client/src/i18n/content.js`
- `client/src/styles/hero.css`
- `client/src/styles/trainer-card.css`
- `client/src/styles/featured.css`
- `client/src/styles/case-study.css`
- `client/src/styles/variables.css`
- `client/src/styles/global.css`
- `client/src/styles/pc-storage.css`
- `client/src/styles/pixel.css`
- `client/src/styles/services.css`
- `client/public/media/rag-demo.gif`
- `client/public/media/pronostico.png`
- `client/public/cv/Lautaro-Rodriguez-CV.pdf`
- `cv.html`
- `css/cv.css`
- `js/cv.js`
- `data/projects.json`
- `data/projects.js`

### Tests

- `npm run lint`, `npm test` y `npm run build` en `client/`: OK (solo warnings preexistentes de oxlint).
- Verificación headless: portada con cinco tarjetas, caso de estudio sin 404, sin desborde horizontal en 375 px y 1440 px, footer con descarga de CV y PDF servido como `application/pdf`.
- `featuredCarouselLogic.test.js`: avance, bucle sin salto y pausa por hover/reduced-motion.

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
