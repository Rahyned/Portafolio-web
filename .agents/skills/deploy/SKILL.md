---
name: deploy
description: Secuencia exacta para desplegar el portafolio en Vercel (root client/) y para verificar el build local antes de pushear. Usar cuando el usuario pide deploy, publicar, subir a producción o revisar que el build de Vercel va a pasar.
disable-model-invocation: true
---

# Deploy del portafolio

Vercel con **root directory = `client/`**. Ese detalle es el que más se olvida: si el root fuera la
raíz del repo, el build no encontraría `package.json`.

## 1. Verificar localmente (obligatorio antes de cualquier deploy)

```bash
cd client
npm run lint      # oxlint; baseline actual: 11 warnings preexistentes, 0 errors
npm run build     # vite build && node copy-dist.mjs
npm run preview   # abrir y mirar: build, site y /cv.html
```

`npm run build` no es solo Vite: `copy-dist.mjs` copia al `dist/` los archivos que viven en la raíz
y Vercel no genera solo: `cv.html`, `css/cv.css`, `js/cv.js`, `data/projects.json` y
`data/projects.js`. **Si ese paso no corre, el sitio deployed pierde el CV y los datos.**

Antes de dar por bueno el build, comprobar que `dist/` contiene esos 5 archivos.

## 2. Qué define el deploy

`client/vercel.json`: framework `vite`, `buildCommand: npm run build`, `outputDirectory: dist`, y
un rewrite `/(.*) -> /index.html` (SPA). No editarlo sin saber qué se rompe.

## 3. Desplegar

Vercel detecta el push a la rama de producción. Después:

- Verificar el sitio servido, no solo el build: home, `/cv.html` y un proyecto individual.
- La API de contacto **no** está en este deploy (es estático). `server/` necesita sus variables
  configuradas aparte; sin ellas, el formulario falla en producción aunque todo lo demás ande.

## 4. Checklist antes de decir "desplegado"

- [ ] `npm run lint` sin errores nuevos
- [ ] `npm run build` terminó bien
- [ ] `dist/` contiene `cv.html`, `css/cv.css`, `js/cv.js`, `data/projects.json`, `data/projects.js`
- [ ] el sitio servido responde (no solo el build local)
- [ ] el formulario de contacto: si el backend no está desplegado, avisarlo explícitamente

## Trampas

- El root de Vercel es `client/`, pero `data/` está en la raíz del repo: de ahí el paso de copia.
- `data/projects.json` modificado sin actualizar `data/projects.js` = datos viejos en el sitio
  servido por `file://`.
- No commitear `client/dist/` ni `nul`: están (o deben estar) en `.gitignore`.
