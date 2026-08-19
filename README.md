# LAUTARO.DEV — Portafolio Web Retro Pokémon

Portafolio interactivo con estética de videojuego retro tipo Pokémon (8/16-bits). Combina nostalgia visual con funcionalidad profesional: proyectos en "PC de Almacenamiento", stack técnico como medallas, contacto lúdico, mochila de notas técnicas y CV imprimible.

> ✅ **Frontend migrado a React + Vite** (carpeta `client/`) con **overhaul visual arcade brillante**: sprites pixel art, boot screen, CRT, partículas y tema ARCADE por defecto. La versión vanilla queda como respaldo en la raíz.

> ⚠️ **Todos los datos son PLACEHOLDER.** Se editan en **`data/projects.json`** sin tocar código.

## 🚀 Cómo ejecutar

### Con servidor (recomendado, incluye API de contacto)

```bash
cd server
npm install
npm start          # http://localhost:8080
```

El servidor sirve automáticamente el **build de React** (`client/dist`) si existe; si no, cae a la versión vanilla de la raíz.

### Desarrollo (React con HMR + proxy al backend)

```bash
cd client
npm install
npm run dev        # http://localhost:5173 (proxy /data y /api → :8080)
cd ../server
npm start          # backend en paralelo
```

### Sin backend (estático)

```bash
cd client && npm run build   # genera client/dist
# luego abrí client/dist/index.html o servilo con cualquier estático
```

En este modo el formulario abre un `mailto:` con los datos precargados (sin envío real).

#### Configurar email (SMTP)

```bash
cd server
cp .env.example .env
# completar SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_EMAIL
```

Sin configuración, la web sigue funcionando con el fallback de inbox.

## 📁 Estructura

```
├── client/                 # ⭐ Frontend React + Vite (componentes, context, hooks, styles)
├── server/                 # Node.js (Express + Nodemailer) — API + sirve el build
├── data/
│   └── projects.json       # ⭐ FUENTE CANÓNICA DE DATOS (editar acá)
├── index.html, css/, js/   # Versión vanilla (respaldo, sin React)
└── cv.html                 # CV imprimible (compartido por ambos frontends)
```

## ✏️ Cómo editar los datos

Todo el contenido se centraliza en **`data/projects.json`**. El frontend React lo carga vía `fetch` y usa `client/src/data/fallback.js` si no hay servidor. La versión vanilla usa `data/projects.js` como fallback.

- `ANALYTICS.ga4Id` → ID de Google Analytics 4. `""` = desactivado.
- `PROFILE` → nombre, nivel, experiencia, bio, estado
- `BADGES` → medallas de stack
- `PROJECT_BOXES` → cajas y proyectos (problema/solución/resultado, stack, demo, github)
- `BLOG` → notas técnicas de la sección Mochila
- `CONTACT_INFO` → email, linkedin, github, CV
- `SKILLS_LIST` → stack para la terminal y el CV

Reemplazá los valores entre `[]` manteniendo la estructura.

## 🎮 Funcionalidades

- **Temas:** ARCADE (default, brillante) / Red / Blue / Dark / Konami (persistidos en LocalStorage)
- **Boot screen** power-on con logo y barra de progreso al cargar
- **Sprites pixel art propios** (SVG por grilla): entrenador, proyectos, cajas, partículas
- **Overlay CRT/scanlines** con toggle en el header (persistido)
- **Hero vivo:** partículas flotantes, título con gradiente, sprite animado, botón bevel 3D
- **PC de Almacenamiento:** 3 cajas, grilla 5x3, info bar, sprites animados, modal con detalles
- **Mochila:** notas técnicas con cards de rareza
- **Contacto:** PokéNav (dispositivo) + máquina de intercambio (formulario validado + backend o mailto)
- **CV en PDF:** `cv.html` imprimible
- **Cursor pixelado** + hit-flash + scroll reveal con stagger
- **Easter eggs:**
  - Presioná `T` para abrir la terminal retro (`help | projects | skills | about | contact | cv | clear`)
  - Código Konami `↑ ↑ ↓ ↓ ← → ← → B A`: tema sorpresa + **confetti pixelado**
- Sonidos 8-bit con mute + persistencia
- Google Analytics 4 configurable (`ANALYTICS.ga4Id`)
- Responsive (375px → 1920px) + `prefers-reduced-motion`

## ✅ Checklist de entrega

- [x] Migración a **React + Vite** (componentes, context, hooks) — vanilla queda como respaldo
- [x] **Overhaul visual arcade:** paleta brillante, sprites pixel art, boot screen, CRT toggle
- [x] Header funcional (4 temas, CRT, mute) + hero con partículas y título gradiente
- [x] Ficha de entrenador con sprite animado, EXP shimmer y medallas
- [x] PC de almacenamiento con info bar, sprites y modal dual-screen
- [x] Mochila/blog con rarity + Contacto PokéNav/trade machine
- [x] Backend de contacto (Express + Nodemailer + fallback inbox + rate limit)
- [x] Konami con confetti + terminal (`T`) + cursor pixel + hit-flash
- [x] Datos dinámicos desde JSON + GA4 configurable
- [x] CV imprimible/PDF
- [x] Responsive + `prefers-reduced-motion` + accesibilidad

## 🔮 Próximos pasos

- CMS para editar `projects.json` desde una interfaz
- Suscripción/contacto persistido en base de datos
- Blog con artículos completos
- TypeScript + testing (Vitest) sobre el frontend React

---

© 2024 [Lautaro] | Diseño & Código custom
