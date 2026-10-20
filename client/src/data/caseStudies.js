export const CASE_STUDIES = {
  solutionscars: {
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
  }
};
