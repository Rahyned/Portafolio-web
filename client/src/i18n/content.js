// ============================================================
// CONTENIDO LOCALIZADO - Traducción al inglés de todo el
// contenido de la web (bio, proyectos, servicios, skills).
// La fuente canónica ES vive en /data/projects.json.
// ============================================================

export const CONTENT_EN = {
  PROFILE: {
    class: "Software developer",
    status: "⚡ OPEN TO PROJECTS",
    tagline: "I build systems that real businesses run on every day, and I'm learning how to get more out of their data.",
    quickFacts: [
      "2 systems in daily use (auto shop and dental lab)",
      "Rosario or remote",
      "Open to projects and internships"
    ],
    bio: "I got into coding because of video games. I wanted to see how they worked under the hood. Curiosity pulled me in: I started with websites and kept taking on bigger builds. My first clients found me almost by accident, trusted me anyway, and today a mechanic shop and a dental lab run every day on systems I made for them. I like building software as much as working with data, and AI hooked me. Most of what I ship now goes through there. That's why I'm starting a Data Science degree at UNR in 2027. The Pokémon look of this portfolio isn't a gimmick. It's where the whole thing started."
  },

  BOXES: {
    caja1: { label: "Web" },
    caja2: { label: "Systems" },
    caja3: { label: "Desktop" }
  },

  BADGES: [
    { name: "Python", icon: "🐍" },
    { name: "FastAPI", icon: "⚡" },
    { name: "React", icon: "⚛️" },
    { name: "Flet / PyQt", icon: "🖥️" },
    { name: "Tauri", icon: "🦀" },
    { name: "AI / RAG", icon: "🤖" },
    { name: "Supabase", icon: "🟢" }
  ],

  FEATURED_PROJECTS: {
    solutionscars: {
      status: "In use",
      since: "since Mar 2026",
      problem: "An auto shop that also does CNG and lube work was tracking stock, invoices, and expirations by hand.",
      built: "A desktop system for customers and vehicles, inventory, intake, sticker expirations, WhatsApp and email alerts, and electronic invoicing through ARCA.",
      stack: [
        "Python",
        "Flet",
        "SQLAlchemy + Alembic",
        "SQLite (optional PostgreSQL)",
        "pyafipws",
        "ReportLab",
        "pytest",
        "GitHub Actions (100% coverage)"
      ],
      result: "In daily use at the shop; invoices live in production with ARCA.",
      links: [
        { label: "Releases", url: "https://github.com/Rahyned/SolutionsCars-releases-" },
        { label: "View case study", url: "/proyectos/solutionscars" }
      ],
      media: { alt: "SolutionsCars demo video" }
    },
    stella: {
      status: "In use at RioDent",
      since: "since Jan 2026",
      problem: "A dental lab tracked jobs on paper, with no status follow-up or customer accounts.",
      built: "A PyQt5 desktop app with a FastAPI backend: job statuses, running accounts, JWT roles, PDFs, and Google Drive backups.",
      result: "The lab uses it every day to track every job.",
      media: { alt: "STELLA demo video" }
    },
    rag: {
      title: "RAG Assistant",
      status: "Demo",
      problem: "SolutionsCars and STELLA clients kept asking questions that were already answered in the docs.",
      built: "An assistant that answers from the documentation with hybrid FAISS + BM25 search fused via RRF, cites the PDF page, says when nothing fits, streams replies (SSE), and includes fallbacks and rate limiting.",
      result: "Public demo up and running.",
      links: [
        { label: "Demo", url: "https://rag-proyectos.vercel.app" },
        { label: "GitHub", url: "https://github.com/Rahyned/Rag-Proyectos-" }
      ],
      media: { alt: "Demo of the assistant answering with citations" }
    },
    panel: {
      status: "Personal use",
      problem: "Notes, study tools, site monitoring, and data experiments were scattered across too many apps.",
      built: "A control center with Markdown + KaTeX notes, a site monitor with Discord alerts, a study plan with SM-2 flashcards and Pomodoro, an in-browser pandas lab (Pyodide), the RAG assistant built in, and a forecasting section.",
      result: "I use it every day.",
      media: { alt: "Video coming soon (private app with login)" }
    },
    pronostico: {
      title: "Car transfer forecast",
      status: "Deployed",
      problem: "I wanted to estimate how many cars get transferred each month in Santa Fe.",
      built: "Using monthly DNRPA Santa Fe transfers (2000–2026), I compared a seasonal baseline, SARIMA, and Prophet. SARIMA(1,1,2)(1,1,1,12) won with 5.29% MAPE against 6.62% for the baseline. The model is 9 KB and served through a FastAPI API in Docker on Render.",
      result: "Public API with interactive docs.",
      links: [
        { label: "API (/docs)", url: "https://pronostico-autos.onrender.com/docs" },
        { label: "GitHub", url: "https://github.com/Rahyned/pronostico-autos" }
      ],
      media: { alt: "Forecast vs. real data" }
    }
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
    "Languages: Python, JavaScript, SQL",
    "Backend: FastAPI, Node.js (Express), REST APIs",
    "Frontend: React, Vite, Tailwind CSS, MUI",
    "Desktop: Tauri (Rust), Flet, PyQt5",
    "AI & data: AI / RAG, FAISS, BM25, pandas, Prophet",
    "Databases: PostgreSQL, SQLite, SQLModel, Supabase",
    "Deploy: Railway, Render and Vercel; Docker, GitHub Actions"
  ]
};