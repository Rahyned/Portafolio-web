# Portafolio Web Retro Pokémon — React

Portafolio interactivo con estética retro tipo Pokémon **arcade brillante** (Game Boy Color).

- 🎨 5 temas: **ARCADE** (default), Red, Blue, Dark y Konami (easter egg)
- ⚡ **Boot screen** power-on con barra de progreso al cargar
- 👾 **Sprites pixel art propios** (SVG por grilla) para entrenador, proyectos y cajas
- 📺 Overlay **CRT/scanlines** con toggle en el header (persistido)
- ✨ Partículas flotantes en el hero, título con gradiente, botones bevel 3D
- 🖥️ PC de Almacenamiento con info bar y sprites animados
- 🎉 Confeti pixelado al activar el código Konami
- 🖱 Cursor pixelado (toggle) + hit-flash en clics
- 🔊 Sonidos 8-bit con Web Audio API (mute persistente)
- 📧 Contacto con backend (Express + Nodemailer, fallback inbox/mailto)

## Inicio rápido

```bash
# 1. Frontend (desarrollo, con proxy al backend)
cd client
npm install
npm run dev        # http://localhost:5173

# 2. Backend (en otra terminal)
cd server
npm install
npm start          # http://localhost:8080 (API + build)
```

## Producción

```bash
cd client && npm run build   # genera client/dist
cd server && npm start       # sirve el build de React en http://localhost:8080
```

## Editar datos

Todo el contenido vive en `data/projects.json` (y su fallback `client/src/data/fallback.js`).

## Estructura

```
client/
  └── src/
      ├── components/   # Header, Hero, TrainerCard, PCStorage, Contact, Terminal, BootScreen...
      ├── context/      # DataContext, ThemeContext, SoundContext, UiContext
      ├── hooks/        # useTypewriter, useKonami, useActiveSection
      ├── sprites/      # Pixel art en grillas (palette, trainer, projects, boxes, registry)
      ├── data/         # fallback.js (datos embebidos)
      └── styles/       # CSS por sección + boot + crt + pixel (efectos globales)
server/            # API + servidor estático (Express)
data/              # datos canónicos
css/, js/, index.html, cv.html   # versión vanilla (mantenida como respaldo)
```
