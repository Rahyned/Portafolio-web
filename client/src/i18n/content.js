// ============================================================
// CONTENIDO LOCALIZADO - Traducción al inglés de todo el
// contenido de la web (bio, proyectos, servicios, skills).
// La fuente canónica ES vive en /data/projects.json.
// ============================================================

export const CONTENT_EN = {
  PROFILE: {
    class: "Desarrollador de software",
    status: "⚡ DISPONIBLE PARA PROYECTOS",
    tagline: "Construyo sistemas que negocios reales usan todos los días, y aprendo a sacarles valor a sus datos.",
    bio: "Empecé a programar por los videojuegos: quería entender cómo funcionaban por dentro. Soy curioso y creativo, así que arranqué haciendo páginas web y de ahí pasé a proyectos cada vez más grandes. Mis primeros clientes llegaron casi de casualidad, pero confiaron en mí, y hoy un taller mecánico y un laboratorio dental usan todos los días los sistemas que hice para ellos. Me gusta tanto construir software como trabajar con datos, y la IA me atrapó: hoy la mayoría de mis proyectos pasan por ahí. Por eso en 2027 empiezo Ciencia de Datos en la UNR. Lo de Pokémon en este portfolio no es casualidad: es de donde viene todo."
  },

  BOXES: {
    caja1: { label: "Web" },
    caja2: { label: "Systems" },
    caja3: { label: "Desktop" }
  },

  PROJECTS: {
    abstractoshopp: {
      category: "Web Development",
      timeline: "Aug 2026",
      status: "Completed",
      problem: "Physical urban clothing and accessories store (gothic/Y2K) in Rosario with no online presence: sales only at the store and Instagram, no catalog or bookings.",
      solution: "Next.js store with filterable catalog (category, price, color, size), product page with gallery and SEO, cart and favorites, WhatsApp checkout, dark mode and JSON-editable data.",
      result: "Store v1.1.0 complete and ready to deploy; real payments (MercadoPago) and Instagram feed left as roadmap."
    },
    "floreria-susi": {
      category: "Web Development",
      timeline: "Aug 2026",
      status: "Completed",
      problem: "Neighborhood flower shop with a solid reputation but no digital presence: orders only by phone, no catalog or visible WhatsApp.",
      solution: "Responsive landing with hero, featured bouquets and plants, opening hours, WhatsApp/Instagram contact, form and floating WhatsApp button.",
      result: "Landing ready to publish with an integrated order and inquiry channel via WhatsApp; basic SEO and aesthetics matching the brand."
    },
    riodent: {
      category: "Web Development",
      timeline: "2025 – 2026",
      status: "In production",
      problem: "Dental laboratory without a professional website: orders by phone/paper, no online catalog or shade-matching channel, Spanish only.",
      solution: "Trilingual SPA (ES/EN/PT) with material catalogs, work order with interactive dental SVG map (11–48) and attachments (photos + STL), shade-matching form with PDF, searchable FAQ, courses and contact with map/WhatsApp. Express backend with transactional emails (Brevo).",
      result: "In production on Railway: orders and shade matches arrive by email with PDF and attachments, with rate limiting and CSP."
    },
    "pixel-editor": {
      category: "Web Development",
      timeline: "Sep 2026",
      status: "Completed",
      problem: "I needed a tool to create animated pixel-art sprites directly in the browser, with no installs and no accounts.",
      solution: "Sprite editor in React 19 + Vite 8 with brush, eraser, fill, line, rectangle, ellipse and selection; layers with blend modes, animated frames with onion skin and per-frame duration, preset palettes (Pico-8, C64, DB32…), PNG/JPG import, symmetry, undo/redo and autosave.",
      result: "Deployed to GitHub Pages with CI (lint + unit + E2E) on every push; exports PNG, sprite sheet, animated GIF, SVG, JSON and copy-paste-ready JS code, plus a shareable link that embeds the project."
    },
    butterflies: {
      category: "Desktop Apps (Tauri)",
      timeline: "May 2026",
      status: "Completed",
      problem: "Need for a vector drawing editor as an offline desktop executable: lightweight, no accounts, no internet and without Electron's weight.",
      solution: "Tauri vector editor with 8 tools (select, rect, ellipse, line, arrow, text, free draw, eraser), zoom/pan, undo/redo (50 states), layers with zIndex, grid/minimap, PNG export, native-dialog save/load and hand-drawn style via rough.js.",
      result: "Generated and verified .exe; 100% local app with light/dark themes and full keyboard shortcuts."
    },
    libreta: {
      category: "Desktop Apps (Tauri)",
      timeline: "In progress (2026)",
      status: "In development",
      problem: "Record, rank and compare the movies watched as a couple in a private, 100% local way, without accounts or cloud.",
      solution: "Tauri movie journal with CRUD, poster autocomplete (TMDB + Wikipedia), per-user ratings (stars, emoji and handwritten note), side-by-side comparison, stats, watchlist and JSON export, with a pastel notebook aesthetic.",
      result: "Functional app with local Rust/SQLite backend; couple comparison and stats implemented."
    }
  },

  SERVICES: {
    web: {
      title: "WEB DEVELOPMENT",
      description: "Fast, production-ready websites and web apps: from the landing that turns visits into customers to the store with a complete catalog.",
      includes: [
        "Landing pages and corporate sites",
        "Online stores with catalog and cart",
        "WhatsApp, forms and integrations",
        "Basic SEO + deploy included"
      ]
    },
    sistemas: {
      title: "MANAGEMENT SYSTEMS",
      description: "ERPs and desktop apps that replace spreadsheets and paper with real control of your business, with reports and auditing.",
      includes: [
        "AFIP electronic invoicing",
        "Inventory, customers and current accounts",
        "PDF/Excel exportable reports",
        "Offline desktop apps for Windows"
      ]
    },
    automatizaciones: {
      title: "AUTOMATIONS & APIS",
      description: "Integrations that remove repetitive tasks and connect your tools together so nothing depends on copy-paste.",
      includes: [
        "Automated notifications via WhatsApp API",
        "Transactional emails (Brevo)",
        "Cross-platform sync via webhooks",
        "Custom backends and REST APIs"
      ]
    }
  },

  SKILLS: [
    "Lenguajes: Python, JavaScript, SQL",
    "Backend: FastAPI, Node.js (Express), APIs REST",
    "Frontend: React, Vite, Tailwind CSS, MUI",
    "Escritorio: Tauri (Rust), Flet, PyQt5",
    "IA & datos: IA / RAG, FAISS, BM25, pandas, Prophet",
    "Bases de datos: PostgreSQL, SQLite, SQLModel, Supabase",
    "Deploy: Railway, Render y Vercel; Docker, GitHub Actions"
  ]
};