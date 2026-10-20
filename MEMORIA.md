# MEMORIA — Portafolio-web

Decisiones Tomadas

- **Estética Pokémon**: el sitio mantiene la identidad de videojuego retro tipo Pokémon (sprites
  pixel-art, PC de almacenamiento, medallas, tono lúdico) conviviendo con tipografía legible para
  el contenido profesional.
- **Sin cantidad de tests**: no se publican números de tests en el sitio, el CV ni los textos. Los
  tests se corren y se reportan al usuario, pero no son parte del discurso del portafolio.
- **Sin datos reales ni secretos**: no se versionan datos personales de terceros, credenciales,
  tokens ni archivos `.env`. Los ejemplos y demos usan datos ficticios.
- **Commits en español**: Conventional Commits en español (`feat(portafolio):`, `fix(contacto):`,
  `docs(README):`, `chore(deps):`).
- **Sin push sin mi OK**: el agente trabaja y commitea localmente; el `git push` lo hace Lautaro
  desde PowerShell. Ningún agente pushea por iniciativa propia.

## Errores a no repetir

- **Pushear sin permiso** o usar `git push --force`: prohibido siempre.
- **Commitear trabajo ajeno en curso**: `data/projects.json`, `CHANGELOG.md` y otros archivos
  suelen estar modificados sin commitear. Stagear solo lo de la tarea.
- **Arrastrar un archivo sucio al commit** para cumplir una regla: si `CHANGELOG.md` tiene cambios
  ajenos, dejar la entrada pendiente y avisar, no mezclarla.
- **Publicar cantidades de tests** en textos del sitio o del CV.
- **Inventar métricas o resultados**: si un dato no está verificado, no se escribe.
- **Exponer secretos**: leer, loguear o commitear `.env*`, tokens o configuración de SMTP.
- **Desincronizar datos**: tocar `data/projects.json` sin `data/projects.js` y
  `client/src/data/fallback.js`.
- **i18n a medias**: agregar prosa sin su versión EN o un string de UI en un solo idioma.
- **Meter TypeScript, Tailwind, ESLint o Prettier** en un proyecto que usa JavaScript, CSS propio y
  oxlint.
- **Editar a mano un SVG ya recortado**: pasar siempre por `npm run crop-sprite`.
- **Refactors no pedidos** o cambios de alcance que ensucian el diff.
- **Anunciar que algo funciona sin correrlo**: lint, tests y build son la prueba, no la intención.
