const STATIC_ALLOWED = [
  "https://lautaro.is-a.dev",
  "https://portafolio-web-three-gamma.vercel.app",
  "http://localhost:5173"
];

export function buildAllowedOrigins() {
  const origins = new Set(STATIC_ALLOWED);
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }
  return origins;
}

/** Rechaza si falta Origin o no está en la allowlist. */
export function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin || typeof origin !== "string") return false;
  return buildAllowedOrigins().has(origin);
}
