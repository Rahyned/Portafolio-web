# Mi portfolio retro

**Mi portfolio interactivo, con estética de videojuego retro de 8/16 bits: mis proyectos, servicios y contacto como si fuera un juego.**

## Qué es

Soy Lautaro Rodríguez, desarrollador de software de Rosario. Acá muestro mis proyectos (sistemas de gestión, webs, apps de escritorio, IA y datos), mis servicios y mi stack, con una interfaz inspirada en los juegos clásicos. Lo podés ver en [lautaro.is-a.dev](https://lautaro.is-a.dev).

## Qué incluye

- **Proyectos destacados y "PC de almacenamiento"** con fichas de problema, solución, resultado y stack, y casos de estudio.
- **Profesor Oak:** un chat que responde sobre los proyectos, los servicios y cómo contactarme, usando solo la información pública del sitio.
- **Asistente RAG** integrado en `/asistente/`.
- **Contacto** con formulario (SMTP) y alternativa por `mailto:`.
- **CV imprimible**, temas (Arcade, Blue, Dark, Konami), pantalla de arranque, sprites pixel art y efecto CRT.
- **Español e inglés**, diseño responsive y respeto por `prefers-reduced-motion`.

## Stack

React + Vite · funciones serverless en Vercel (`/api/contact`, `/api/chat`) · LLM compatible con OpenAI y streaming SSE · Upstash Redis para rate limit · Nodemailer · GitHub Actions.

## Cómo correrlo

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

Las variables de entorno están en `client/.env.example`. Sin SMTP, el formulario ofrece `mailto:`. Sin LLM, Oak se muestra en pausa.

Los contenidos se editan en `data/projects.json`, con respaldo en `client/src/data/fallback.js`.

## Calidad

En cada push o PR que toque `client/` corren lint, tests y build.

## Autor

© 2026 Lautaro Rodríguez · Diseñé y programé todo yo · [GitHub](https://github.com/Rahyned)
