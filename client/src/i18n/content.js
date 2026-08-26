// ============================================================
// CONTENIDO LOCALIZADO - Traducción al inglés de todo el
// contenido de la web (bio, proyectos, servicios, skills).
// La fuente canónica ES vive en /data/projects.json.
// ============================================================

export const CONTENT_EN = {
  PROFILE: {
    class: "Web & Systems Developer",
    status: "⚡ AVAILABLE FOR PROJECTS",
    tagline: "Web & Systems Developer | Automation • Architecture • APIs",
    bio: "I'm a web & systems developer specialized in desktop apps (Tauri and Python), e-invoicing ERPs and production websites. I build clean-code solutions: automations, integrations and deployments. Press any key to continue."
  },

  BOXES: {
    caja1: { label: "BOX 1: WEB DEVELOPMENT" },
    caja2: { label: "BOX 2: MANAGEMENT SYSTEMS & ERPs" },
    caja3: { label: "BOX 3: DESKTOP APPS (TAURI)" }
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
    solutionscars: {
      category: "Management Systems & ERPs",
      timeline: "2026",
      status: "In use",
      problem: "Mechanic/GNC/lubricenter workshop without digital management: uncontrolled inventory, manual invoicing and receipts, no control over GNC/P.H. sticker expirations or customer notifications.",
      solution: "Desktop ERP with customer and vehicle management, inventory with stock alerts, AFIP invoicing, vehicle intake, expirations, PDF/Excel export, WhatsApp/mail notification engine and role-based auditing.",
      result: "In real use at the workshop: 298 tests with automated CI; invoicing, inventory, expirations and notifications digitized."
    },
    stella: {
      category: "Management Systems & ERPs",
      timeline: "In progress (2026)",
      status: "In development",
      problem: "Dental laboratory with paper work orders, no traceability, no control over current accounts or suppliers/products.",
      solution: "Desktop ERP (PyQt5) with REST API (FastAPI): customers, suppliers, products with differentiated pricing, jobs with states, current accounts, metrics dashboard and PDF generation (order, ticket, receipt), with roles and JWT.",
      result: "Comprehensive laboratory system: 148 tests + 15 E2E passing, with master station, query and reception modules."
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
    "Frontend: React, Next.js, Vite, Tailwind CSS, MUI, TypeScript, HTML5/CSS3",
    "Desktop: Tauri (Rust), Flet, PyQt5",
    "Backend: Python (FastAPI), Node.js (Express), REST APIs",
    "Databases: PostgreSQL, SQLite, SQLAlchemy, SQLModel",
    "Systems: AFIP invoicing, transactional emails (Brevo), WhatsApp API, PDF/Excel",
    "DevOps: Git/GitHub Actions, Railway, Vercel, PyInstaller/Inno Setup, pytest + CI"
  ]
};