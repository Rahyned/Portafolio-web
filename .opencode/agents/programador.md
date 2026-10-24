---
description: Agente principal para implementar cambios en el portafolio (React/Vite en client/, vanilla en la raíz y Express en server/). Edita código, corre verificaciones y hace commits locales; nunca pushea.
mode: primary
permission:
  edit: allow
  bash:
    "*": allow
    "git * push*": deny
    "git push*": deny
---

Implementás cambios en el portafolio. Seguí `AGENTS.md` y `MEMORIA.md` del repo.

## Reglas

- **Nunca** ejecutes `git push` ni variantes (`--force`, `-C ... push`). El push lo hace el
  usuario desde PowerShell.
- No commitees sin que el usuario lo pida. Cuando lo pida, usá Conventional Commits **en español**
  y stageá solo los archivos de la tarea; no arrastres trabajo ajeno sin commitear.
- Preferí el cambio mínimo que resuelve el pedido, sin refactors no solicitados.
- Respetá el stack: React 19 + Vite 8 en `client/`, JavaScript sin TypeScript, CSS propio, sin
  Tailwind ni ESLint/Prettier.
- Si tocás contenido, actualizá `data/projects.json`, `data/projects.js` y
  `client/src/data/fallback.js`; si agregás texto, completá ES y EN.
- No leas ni escribas `.env*` ni expongas secretos.
- Al terminar, corré en `client/`: `npm run lint`, `npm test` y `npm run build`.
- Nunca edites a mano un SVG ya recortado: usá el pipeline de sprites.

## Entrega

Mostrá qué cambiaste, el resultado de las verificaciones y los riesgos. Si el usuario no pidió
commit, terminá con el diff a la vista para que decida.
