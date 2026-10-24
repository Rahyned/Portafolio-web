// ============================================================
// DATA FALLBACK - Datos embebidos para cuando no hay servidor.
// La fuente canónica es /data/projects.json (servida por el
// servidor Express). Este módulo solo se usa si el fetch falla.
// ============================================================

export const FALLBACK_DATA = {
  ANALYTICS: { ga4Id: "" },

  PROFILE: {
    name: "Lautaro Rodriguez",
    displayName: "LAUTARO.DEV",
    class: "Desarrollador de software",
    level: 22,
    maxLevel: 50,
    completedProjects: "8",
    location: "Rosario, Argentina",
    status: "⚡ DISPONIBLE PARA PROYECTOS",
    tagline: "Construyo sistemas que negocios reales usan todos los días, y aprendo a sacarles valor a sus datos.",
    quickFacts: [
      "2 sistemas en uso diario (taller mecánico y laboratorio dental)",
      "Rosario o remoto",
      "Disponible para proyectos y pasantías"
    ],
    bio: "Empecé a programar por los videojuegos: quería entender cómo funcionaban por dentro. Soy curioso y creativo, así que arranqué haciendo páginas web y de ahí pasé a proyectos cada vez más grandes. Mis primeros clientes llegaron casi de casualidad, pero confiaron en mí, y hoy un taller mecánico y un laboratorio dental usan todos los días los sistemas que hice para ellos. Me gusta tanto construir software como trabajar con datos, y la IA me atrapó: hoy la mayoría de mis proyectos pasan por ahí. Por eso en 2027 empiezo Ciencia de Datos en la UNR. Lo de Pokémon en este portfolio no es casualidad: es de donde viene todo."
  },

  BADGES: [
    { name: "Python", icon: "🐍" },
    { name: "FastAPI", icon: "⚡" },
    { name: "React", icon: "⚛️" },
    { name: "Flet / PyQt", icon: "🖥️" },
    { name: "Tauri", icon: "🦀" },
    { name: "IA / RAG", icon: "🤖" },
    { name: "Supabase", icon: "🟢" }
  ],

  FEATURED_PROJECTS: [
    {
      id: "solutionscars",
      title: "SolutionsCars",
      status: "En uso",
      since: "desde mar 2026",
      problem: "Un taller mecánico, de GNC y lubricentro manejaba stock, facturas y vencimientos a mano.",
      built: "Sistema de escritorio con clientes y vehículos, inventario, recepción, vencimientos de obleas, avisos por WhatsApp y mail, y facturación electrónica con ARCA.",
      stack: ["Python", "Flet", "SQLAlchemy + Alembic", "SQLite (PostgreSQL opcional)", "pyafipws", "ReportLab", "pytest", "GitHub Actions (100% cobertura)"],
      result: "En uso todos los días en el taller; factura en producción con ARCA.",
      links: [
        { label: "Releases", url: "https://github.com/Rahyned/SolutionsCars-releases-" },
        { label: "Ver caso de estudio", url: "/proyectos/solutionscars" }
      ],
      media: { type: "video", src: "/media/solutionscars-demo.mp4", poster: "/media/solutionscars-poster.jpg", alt: "Video demo de SolutionsCars" },
      private: true,
      caseStudy: "/proyectos/solutionscars"
    },
    {
      id: "stella",
      title: "STELLA",
      status: "En uso en RioDent",
      since: "desde ene 2026",
      problem: "Un laboratorio dental llevaba los trabajos en papel, sin seguimiento ni cuentas corrientes.",
      built: "App de escritorio en PyQt5 con API FastAPI: trabajos con estados, cuentas corrientes, roles con JWT, PDFs y backup a Google Drive.",
      stack: ["Python", "PyQt5", "FastAPI", "SQLModel", "JWT", "ReportLab"],
      result: "El laboratorio la usa todos los días para seguir cada trabajo.",
      links: [],
      media: { type: "video", src: "/media/stella-demo.mp4", poster: "/media/stella-poster.jpg", alt: "Video demo de STELLA" },
      private: true,
      caseStudy: null
    },
    {
      id: "rag",
      title: "Asistente RAG",
      status: "Demo",
      since: null,
      problem: "Los clientes de SolutionsCars y STELLA tenían dudas que ya estaban respondidas en la documentación.",
      built: "Asistente que responde desde la documentación con búsqueda híbrida FAISS + BM25 combinada con RRF, cita la página del PDF, dice que no encontró nada si la pregunta es de otro tema, responde en streaming (SSE) y tiene fallbacks y rate limit.",
      stack: ["FastAPI", "Groq", "FAISS", "BM25", "React", "Vercel"],
      result: "Demo pública funcionando.",
      links: [
        { label: "Demo", url: "https://rag-proyectos.vercel.app" },
        { label: "GitHub", url: "https://github.com/Rahyned/Rag-Proyectos-" }
      ],
      media: { type: "gif", src: "/media/rag-demo.gif", alt: "Demo del asistente respondiendo con citas" },
      private: false,
      caseStudy: null
    },
    {
      id: "panel",
      title: "Panel",
      status: "Uso personal",
      since: null,
      problem: "Tenía notas, estudio, monitoreo de sitios y pruebas de datos repartidos en muchas herramientas.",
      built: "Centro de control con notas en Markdown + KaTeX, monitor de sitios con avisos a Discord, plan de estudio con flashcards SM-2 y Pomodoro, laboratorio de pandas en el navegador (Pyodide), el asistente RAG integrado y una sección de pronóstico.",
      stack: ["React", "Vite", "Tailwind", "Supabase", "Vercel"],
      result: "Lo uso todos los días.",
      links: [],
      media: { type: "placeholder", src: null, alt: "Video próximamente (app privada con login)" },
      private: true,
      caseStudy: null
    },
    {
      id: "pronostico",
      title: "Pronóstico de autos",
      status: "Desplegado",
      since: null,
      problem: "Quería estimar cuántos autos se van a transferir por mes en Santa Fe.",
      built: "Con las transferencias mensuales de DNRPA Santa Fe (2000–2026) comparé un baseline estacional, SARIMA y Prophet. Ganó SARIMA(1,1,2)(1,1,1,12) con MAPE 5,29% contra 6,62% del baseline. El modelo pesa 9 KB y lo sirvo con una API FastAPI en Docker sobre Render.",
      stack: ["Python", "pandas", "statsmodels", "Prophet", "FastAPI", "Docker", "Render"],
      result: "API pública con documentación interactiva.",
      links: [
        { label: "API (/docs)", url: "https://pronostico-autos.onrender.com/docs" },
        { label: "GitHub", url: "https://github.com/Rahyned/pronostico-autos" }
      ],
      media: { type: "img", src: "/media/pronostico.png", alt: "Pronóstico vs. datos reales" },
      private: false,
      caseStudy: null
    }
  ],

  PROJECT_BOXES: [
    {
      id: "caja1",
      label: "Web",
      icon: "🌐",
      projects: [
        {
          id: "abstractoshopp",
          title: "Abstractoshop",
          sprite: "🛍️",
          category: "Desarrollo Web",
          timeline: "Ago 2026",
          status: "Completado",
          problem: "Tienda física de ropa y accesorios urbana (gótico/Y2K) en Rosario sin presencia online: ventas solo por local e Instagram, sin catálogo ni reservas.",
          solution: "Tienda Next.js con catálogo filtrable (categoría, precio, color, talle), página de producto con galería y SEO, carrito y favoritos, checkout por WhatsApp, dark mode y datos editables en JSON.",
          result: "Tienda v1.1.0 completa y lista para desplegar; pagos reales (MercadoPago) y feed de Instagram quedaron como roadmap.",
          stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Sharp"],
          demo: null,
          github: null
        },
        {
          id: "floreria-susi",
          title: "Florería Susi",
          sprite: "🌷",
          category: "Desarrollo Web",
          timeline: "Ago 2026",
          status: "Completado",
          problem: "Florería de barrio con sólida reputación pero sin presencia digital: pedidos solo por teléfono, sin catálogo ni WhatsApp visible.",
          solution: "Landing responsive con hero, ramos y plantas destacados, horarios, contacto con WhatsApp/Instagram, formulario y botón WhatsApp flotante.",
          result: "Landing lista para publicar con canal de pedidos y consultas por WhatsApp integrado; SEO básico y estética acorde a la marca.",
          stack: ["React 18", "Vite", "Tailwind CSS 4"],
          demo: null,
          github: null
        },
        {
          id: "riodent",
          title: "Laboratorio RioDent",
          sprite: "🦷",
          category: "Desarrollo Web",
          timeline: "2025 – 2026",
          status: "En producción",
          problem: "Laboratorio dental sin web profesional: pedidos por teléfono/papel, sin catálogo online ni canal de toma de color, solo en español.",
          solution: "SPA trilingüe (ES/EN/PT) con catálogos de materiales, orden de trabajo con mapa dental SVG interactivo (11–48) y adjuntos (fotos + STL), formulario de toma de color con PDF, FAQ buscable, cursos y contacto con mapa/WhatsApp. Backend Express con emails transaccionales (Brevo).",
          result: "En producción en Railway: los pedidos y tomas de color llegan por email con PDF y adjuntos, con rate limiting y CSP.",
          stack: ["React 19", "Vite", "MUI 7", "i18next", "Express 5", "Brevo", "Railway"],
          demo: "https://www.riodent.com.ar",
          github: null
        },
        {
          id: "pixel-editor",
          title: "Pixel Sprite Editor",
          sprite: "🎨",
          category: "Desarrollo Web",
          timeline: "Sep 2026",
          status: "Completado",
          problem: "Necesitaba una herramienta para crear sprites pixel art con animación directamente en el navegador, sin instalar nada ni crear cuentas.",
          solution: "Editor de sprites en React 19 + Vite 8 con pincel, borrador, relleno, línea, rectángulo, elipse y selección; capas con blend modes, frames animados con onion skin y duración por frame, paletas preset (Pico-8, C64, DB32…), importación de PNG/JPG, simetría, undo/redo y guardado automático.",
          result: "Desplegado en GitHub Pages con CI (lint + unit + E2E) en cada push; exporta PNG, sprite-sheet, GIF animado, SVG, JSON y código JS listo para pegar, con link compartible que embebe el proyecto.",
          stack: ["React 19", "Vite 8", "gifenc", "pako", "Vitest", "Playwright"],
          demo: "https://rahyned.github.io/pixel-editor/",
          github: "https://github.com/Rahyned/pixel-editor"
        }
      ]
    },
    {
      id: "caja2",
      label: "Sistemas",
      icon: "🖥️",
      projects: [
        {
          id: "organizador",
          title: "Organizador personal",
          sprite: "🗂️",
          category: "Sistemas & Apps",
          timeline: "2026",
          status: "Uso personal",
          problem: "Descripción próximamente",
          solution: "Descripción próximamente",
          result: "Descripción próximamente",
          stack: [],
          demo: null,
          github: null
        }
      ]
    },
    {
      id: "caja3",
      label: "Escritorio",
      icon: "⚙️",
      projects: [
        {
          id: "butterflies",
          title: "Butterflies",
          sprite: "✏️",
          category: "Apps de Escritorio (Tauri)",
          timeline: "May 2026",
          status: "Completado",
          problem: "Necesidad de un editor de dibujo vectorial como ejecutable desktop offline: liviano, sin cuentas, sin internet y sin el peso de Electron.",
          solution: "Editor vectorial Tauri con 8 herramientas (select, rect, elipse, línea, flecha, texto, dibujo libre, borrador), zoom/pan, undo/redo (50 estados), capas con zIndex, grid/minimapa, export PNG, guardado/cargado con diálogo nativo y estilo hand-drawn vía rough.js.",
          result: "Ejecutable .exe generado y verificado; app 100% local con temas claro/oscuro y atajos de teclado completos.",
          stack: ["Tauri 2", "Rust", "React 19", "TypeScript", "rough.js", "Vite"],
          demo: null,
          github: null
        },
        {
          id: "libreta",
          title: "Libreta",
          sprite: "🎬",
          category: "Apps de Escritorio (Tauri)",
          timeline: "En curso (2026)",
          status: "En desarrollo",
          problem: "Registrar, rankear y comparar las películas vistas en pareja de forma privada y 100% local, sin cuentas ni nube.",
          solution: "Diario de películas Tauri con CRUD, autocompletado de pósters (TMDB + Wikipedia), ratings por usuario (estrellas, emoji y nota manuscrita), comparación lado a lado, estadísticas, watchlist y export JSON, con estética libreta pastel.",
          result: "App funcional con backend Rust/SQLite local; comparación y estadísticas 'en pareja' implementadas.",
          stack: ["Tauri 2", "Rust", "SQLite", "React 18", "TypeScript", "Tailwind", "Zustand", "Framer Motion"],
          demo: null,
          video: null,
          github: null
        }
      ]
    }
  ],

  SERVICES: [
    {
      id: "web",
      icon: "🌐",
      title: "DESARROLLO WEB",
      type: "Web",
      description: "Sitios y aplicaciones web rápidos y en producción: de la landing que convierte visitas en clientes a la tienda con catálogo completo.",
      includes: [
        "Landing pages y sitios institucionales",
        "Tiendas online con catálogo y carrito",
        "WhatsApp, formularios e integraciones",
        "SEO básico + deploy incluido"
      ],
      stack: ["React", "Next.js", "Vite", "Tailwind CSS"]
    },
    {
      id: "sistemas",
      icon: "🖥️",
      title: "SISTEMAS DE GESTION",
      type: "Sistema",
      description: "ERPs y apps de escritorio que reemplazan planillas y papel por control real de tu negocio, con reportes y auditoría.",
      includes: [
        "Facturación electrónica AFIP",
        "Inventario, clientes y cuentas corrientes",
        "Reportes exportables PDF/Excel",
        "Apps desktop offline para Windows"
      ],
      stack: ["Python", "Flet / PyQt5", "Tauri (Rust)", "PostgreSQL / SQLite"]
    },
    {
      id: "automatizaciones",
      icon: "⚙️",
      title: "AUTOMATIZACIONES & APIS",
      type: "Automatización",
      description: "Integraciones que eliminan tareas repetitivas y conectan tus herramientas entre sí para que nada dependa de copiar y pegar.",
      includes: [
        "Avisos automáticos por WhatsApp API",
        "Emails transaccionales (Brevo)",
        "Sincronización entre plataformas vía webhooks",
        "Backends y APIs REST a medida"
      ],
      stack: ["FastAPI", "Node.js / Express", "Brevo", "CI/CD"]
    }
  ],

  CONTACT_INFO: {
    email: "rodriguez.samuel.lautaro@gmail.com",
    linkedin: "https://www.linkedin.com/in/lautaro-rodriguez-96a42b389/",
    github: "https://github.com/Rahyned",
    phone: "+54 341 6297638",
    cvUrl: "/cv/Lautaro-Rodriguez-CV.pdf"
  },

  SKILLS_LIST: [
    "Lenguajes: Python, JavaScript, SQL",
    "Backend: FastAPI, Node.js (Express), APIs REST",
    "Frontend: React, Vite, Tailwind CSS, MUI",
    "Escritorio: Tauri (Rust), Flet, PyQt5",
    "IA & datos: IA / RAG, FAISS, BM25, pandas, Prophet",
    "Bases de datos: PostgreSQL, SQLite, SQLModel, Supabase",
    "Deploy: Railway, Render y Vercel; Docker, GitHub Actions"
  ]
};