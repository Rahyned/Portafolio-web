// ============================================================
// DATA FALLBACK - Datos embebidos para cuando no hay servidor.
// La fuente canónica es /data/projects.json (servida por el
// servidor Express). Este módulo solo se usa si el fetch falla.
// ============================================================

export const FALLBACK_DATA = {
  ANALYTICS: { ga4Id: "" },

  PROFILE: {
    name: "Lautaro",
    displayName: "LAUTARO.DEV",
    class: "Desarrollador Web & Sistemas",
    level: 45,
    maxLevel: 99,
    expYears: "[5+]",
    completedProjects: "7",
    location: "[Rosario, Argentina]",
    status: "⚡ DISPONIBLE PARA PROYECTOS",
    tagline: "Desarrollador Web & Sistemas | Automatización • Arquitectura • APIs",
    bio: "Soy desarrollador web & sistemas especializado en apps de escritorio (Tauri y Python), ERPs con facturación electrónica y sitios web en producción. Construyo soluciones de código limpio: automatizaciones, integraciones y desplegues. Presiona cualquier tecla para continuar."
  },

  BADGES: [
    { name: "Python", icon: "🐍" },
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "Tauri", icon: "🦀" },
    { name: "FastAPI", icon: "⚡" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Tailwind", icon: "🌊" }
  ],

  PROJECT_BOXES: [
    {
      id: "caja1",
      label: "CAJA 1: DESARROLLO WEB",
      icon: "🖥️",
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
          github: "https://github.com/Rahyned/Abstractoshopp"
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
          github: "https://github.com/Rahyned/Florer-a-Susi"
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
          demo: null,
          github: "https://github.com/Rahyned/Laboratorio-RioDent"
        }
      ]
    },
    {
      id: "caja2",
      label: "CAJA 2: SISTEMAS DE GESTIÓN & ERPs",
      icon: "⚙️",
      projects: [
        {
          id: "solutionscars",
          title: "SolutionsCars",
          sprite: "🔧",
          category: "Sistemas de Gestión & ERPs",
          timeline: "2026",
          status: "En uso",
          problem: "Taller mecánico/GNC/lubricentro sin gestión digital: inventario descontrolado, facturación y recibos manuales, sin control de vencimientos de obleas GNC/P.H. ni avisos a clientes.",
          solution: "ERP de escritorio con gestión de clientes y vehículos, inventario con alertas de stock, facturación AFIP, recepción de vehículos, vencimientos, exportación PDF/Excel, motor de avisos por WhatsApp/mail y auditoría con roles.",
          result: "En uso real en el taller: 298 tests con CI automatizado; facturación, inventario, vencimientos y avisos digitalizados.",
          stack: ["Python", "Flet", "SQLAlchemy", "PostgreSQL/SQLite", "ReportLab", "PyAFIPWS", "WhatsApp API"],
          demo: null,
          github: "https://github.com/Rahyned/SolutionsCars"
        },
        {
          id: "stella",
          title: "STELLA",
          sprite: "⭐",
          category: "Sistemas de Gestión & ERPs",
          timeline: "En curso (2026)",
          status: "En desarrollo",
          problem: "Laboratorio odontológico con órdenes de trabajo en papel, sin trazabilidad, sin control de cuentas corrientes ni de proveedores/productos.",
          solution: "ERP de escritorio (PyQt5) con API REST (FastAPI): clientes, proveedores, productos con precios diferenciados, trabajos con estados, cuentas corrientes, dashboard de métricas y generación de PDFs (comanda, ticket, comprobante), con roles y JWT.",
          result: "Sistema integral del laboratorio: 148 tests + 15 E2E pasando, con módulos de estación maestra, consulta y recepción.",
          stack: ["Python", "PyQt5", "FastAPI", "SQLModel", "SQLite", "JWT", "ReportLab"],
          demo: null,
          github: "https://github.com/Rahyned/STELLA"
        }
      ]
    },
    {
      id: "caja3",
      label: "CAJA 3: APPS DE ESCRITORIO (TAURI)",
      icon: "🖱️",
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
          github: "https://github.com/Rahyned/butterflies"
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
          github: "https://github.com/Rahyned/Libreta"
        }
      ]
    }
  ],

  BLOG: [
    {
      id: "docker-devs",
      title: "Docker para devs web",
      date: "Ene 2024",
      tags: ["Docker", "DevOps"],
      excerpt: "Por qué Docker Compose cambió mi forma de levantar entornos de desarrollo y cómo lo uso en cada proyecto.",
      link: null
    },
    {
      id: "sync-inventario",
      title: "Sincronizar inventario en 3 plataformas",
      date: "Feb 2024",
      tags: ["Python", "APIs"],
      excerpt: "Lección aprendida integrando Shopify, WooCommerce y una base local con webhooks y tareas periódicas.",
      link: null
    },
    {
      id: "fastify",
      title: "APIs REST con Fastify",
      date: "Mar 2024",
      tags: ["Node.js", "Backend"],
      excerpt: "Estructura que uso para APIs rápidas con validación, idempotencia y reintentos bien diseñados.",
      link: null
    }
  ],

  CONTACT_INFO: {
    email: "laaau2406@gmail.com",
    linkedin: "[linkedin.com/in/lautaro]",
    github: "https://github.com/Rahyned",
    phone: "[+54 ...]",
    cvUrl: "cv.html"
  },

  SKILLS_LIST: [
    "Frontend: React, Next.js, Vite, Tailwind CSS, MUI, TypeScript, HTML5/CSS3",
    "Desktop: Tauri (Rust), Flet, PyQt5",
    "Backend: Python (FastAPI), Node.js (Express), APIs REST",
    "Bases de datos: PostgreSQL, SQLite, SQLAlchemy, SQLModel",
    "Sistemas: Facturación AFIP, emails transaccionales (Brevo), WhatsApp API, PDF/Excel",
    "DevOps: Git/GitHub Actions, Railway, Vercel, PyInstaller/Inno Setup, pytest + CI"
  ]
};