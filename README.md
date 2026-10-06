# LAUTARO.DEV — Portafolio Web Retro Pokémon

Portafolio interactivo con estética de videojuego retro tipo Pokémon (8/16-bits). Combina nostalgia visual con funcionalidad profesional: proyectos en "PC de Almacenamiento", stack técnico como medallas, sección de servicios conectada al contacto lúdico y CV imprimible.

> ✅ **Frontend migrado a React + Vite** (carpeta `client/`) con **overhaul visual arcade brillante**: sprites pixel art, boot screen, CRT, partículas y tema ARCADE por defecto. La versión vanilla queda como respaldo en la raíz.

> ✏️ El contenido editable vive en **`data/projects.json`** (y el fallback `data/projects.js` para `file://`).

## 🚀 Cómo ejecutar

### Producción (Vercel)

El deploy usa **root directory = `client/`**. Las funciones serverless están en `client/api/`:

| Ruta | Archivo | Función |
|---|---|---|
| `POST /api/contact` | `client/api/contact.js` | Formulario de contacto (SMTP vía nodemailer) |
| `POST /api/chat` | `client/api/chat.js` | Chat "Profesor Oak" (LLM compatible OpenAI + SSE) |

Variables de entorno en Vercel (ver `client/.env.example`):

- **Contacto:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL`
- **Chat:** `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`
- **Rate limit global (recomendado en producción):** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

Sin SMTP, `/api/contact` responde **503** y el frontend ofrece `mailto:`. Sin LLM o sin Upstash en producción, el chat responde **503** y la UI muestra el asistente pausado.

### Desarrollo local (React + HMR)

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

En local, `/api/*` se puede probar con `vercel dev` desde `client/` o apuntando el proxy de Vite al backend legacy (ver abajo).

### Servidor Express (legacy / solo local)

```bash
cd server
npm install
npm start          # http://localhost:8080
```

Sirve el **build de React** (`client/dist`) si existe; si no, la versión vanilla de la raíz. Útil para probar contacto con el mismo stack SMTP que antes; **no es el runtime de Vercel**.

```bash
cd client && npm run build
cd ../server && npm start
```

Con `npm run dev` en `client/`, Vite hace proxy de `/data` y `/api` a `:8080` si levantás `server` en paralelo.

### Sin backend (estático)

```bash
cd client && npm run build
# abrí client/dist/index.html o servilo como estático
```

El formulario cae en `mailto:` si la API no está disponible.

## 📁 Estructura

```
├── client/                 # ⭐ React + Vite + api/ (Vercel)
├── server/                 # Express legacy (local)
├── data/
│   └── projects.json       # ⭐ Fuente canónica de datos
├── index.html, css/, js/   # Versión vanilla (respaldo)
└── cv.html                 # CV imprimible
```

## ✏️ Cómo editar los datos

Todo el contenido se centraliza en **`data/projects.json`**. React carga vía `fetch` con fallback `client/src/data/fallback.js`. La vanilla usa `data/projects.js`.

## 🎮 Funcionalidades

- Temas ARCADE / Blue / Dark / Konami, boot screen, sprites, CRT, contacto PokéNav + trade machine
- Chat Profesor Oak (`/api/chat`) con cuota y rate limit
- Backend de contacto en Vercel (`/api/contact`) o Express local en `server/`
- Konami, terminal (`T`), GA4 configurable, responsive y `prefers-reduced-motion`

## ✅ CI (client/)

En push/PR que toquen `client/`: `npm ci`, `npm run lint`, `npm test`, `npm run build` (ver `.github/workflows/client.yml`).

---

© 2026 Lautaro Rodríguez | Diseño y código propio
