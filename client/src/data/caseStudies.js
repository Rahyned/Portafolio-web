export const CASE_STUDIES = {
  solutionscars: {
    es: {
      title: "SolutionsCars",
      summary: "SolutionsCars es el sistema de gestión de escritorio de un taller mecánico, de GNC y lubricentro de Rosario. Lo usan todos los días desde marzo de 2026 y factura en producción con ARCA.",
      role: "Lo diseñé y desarrollé solo, usando herramientas de IA para programar; yo definí la arquitectura, revisé el código, armé los tests y tomé las decisiones técnicas.",
      problem: "stock, facturas, recibos y vencimientos de obleas GNC/PH a mano; sin avisos a clientes.",
      built: "clientes y vehículos, inventario, recepción, vencimientos, avisos por WhatsApp y mail, facturación electrónica, reportes PDF/Excel, backups.",
      architecture: [
        "Vistas en Flet → servicios → SQLite local (PostgreSQL opcional)",
        "Facturación con ARCA (WSFE) vía pyafipws",
        "PDF con ReportLab y QR",
        "Avisos por WhatsApp y SMTP",
        "Backups",
        "Migraciones con Alembic",
        "Actualizador desde GitHub Releases"
      ],
      decisions: [
        "Montos con Decimal, nunca float.",
        "La factura queda 'pendiente' hasta que responde ARCA.",
        "Un interruptor de mantenimiento bloquea la emisión.",
        "Base SQLite local, funciona sin internet, con soporte opcional de PostgreSQL y migraciones automáticas con Alembic.",
        "CI con 100% de cobertura."
      ],
      problems: [
        "La pantalla se colgaba mientras esperaba la respuesta de ARCA y quedaban facturas pendientes → la solicitud a ARCA pasó a un hilo aparte.",
        "Restaurar un backup podía vaciar la base → ahora restaura sobre una copia temporal y aborta si algo falla.",
        "La app no volvía a abrir después de actualizarse → cambié el empaquetado a onedir.",
        "Una auditoría detectó una credencial empaquetada en el instalador → se sacó del build y se agregó un control que corta la publicación si encuentra secretos."
      ],
      learned: [
        "Que cada operación devuelva un resultado explícito.",
        "No esconder errores: mostrarlos claros.",
        "Lo fiscal se define con el contador, no por intuición."
      ],
      next: [
        "Adaptar la facturación a CondicionIVAReceptorId, obligatorio desde el 01/12/2026, y reforzar los controles de emisión.",
        "Turnos.",
        "Versión web.",
        "App móvil."
      ]
    },
    en: {
      title: "SolutionsCars",
      summary: "SolutionsCars is the desktop management system for a mechanic shop in Rosario that also does CNG and lube work. They have used it every day since March 2026, and it invoices in production with ARCA.",
      role: "I designed and built it on my own, using AI tools to code. I defined the architecture, reviewed the code, wrote the tests, and made the technical calls.",
      problem: "stock, invoices, receipts, and CNG/PH sticker expirations tracked by hand; no customer alerts.",
      built: "customers and vehicles, inventory, intake, expirations, WhatsApp and email alerts, electronic invoicing, PDF/Excel reports, backups.",
      architecture: [
        "Flet views → services → local SQLite (optional PostgreSQL)",
        "Invoicing with ARCA (WSFE) via pyafipws",
        "PDFs with ReportLab and QR",
        "Alerts via WhatsApp and SMTP",
        "Backups",
        "Migrations with Alembic",
        "Updater from GitHub Releases"
      ],
      decisions: [
        "Amounts use Decimal, never float.",
        "An invoice stays 'pending' until ARCA responds.",
        "A maintenance switch blocks issuance.",
        "Local SQLite works offline, with optional PostgreSQL and automatic Alembic migrations.",
        "CI with 100% coverage."
      ],
      problems: [
        "The UI froze while waiting for ARCA and left invoices pending → the ARCA request moved to a background thread.",
        "Restoring a backup could wipe the database → restore now runs on a temp copy and aborts if something fails.",
        "The app would not reopen after an update → packaging switched to onedir.",
        "An audit found a credential packed into the installer → it was removed from the build and a check now blocks release if secrets are found."
      ],
      learned: [
        "Every operation should return an explicit result.",
        "Do not hide errors: show them clearly.",
        "Tax rules come from the accountant, not from guesses."
      ],
      next: [
        "Adapt invoicing to CondicionIVAReceptorId, required from 01/12/2026, and tighten issuance checks.",
        "Appointments.",
        "Web version.",
        "Mobile app."
      ]
    }
  }
};
