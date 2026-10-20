# AGENTS.md — Portafolio-web

Portafolio personal en dos Applicaciones: un sitio **vanilla** en la raíz y una **app React/Vite** en
`client/`. Monorepo **sin `package.json` raíz**: cada sub-proyecto se trabaja por separado.

## Stack (no inventar nada fuera de esto)

| Zona | Stack | Comandos (siempre con workdir en la zona) |
|---|---|---|
| `client/` | React 19, Vite 8, **JS sin TypeScript**, oxlint | `npm run dev` · `npm run lint` · `npm run build` · `npm run preview` |
| raíz | HTML + JS modular (IIFE, sin bundler) + CSS propio | abrir `index.html` o servir la raíz |
| `server/` | Express 4, nodemailer, dotenv | `npm run dev` · `npm start` |
| `video-portafolio/` | HyperFrames (proyecto de video) | tiene su **propio `AGENTS.md`**: mandato propio |

**Prohibido asumir**: nada de TypeScript, nada de Tailwind, nada de ESLint/Prettier, nada de
`npm install` en la raíz. CSS propio; los tokens de color están en `css/variables.css` (raíz) y
`client/src/styles/`.

## Fuente de datos: es doble, y hay que respectarlo

`data/projects.json` es la **fuente canónica** (editable sin tocar código).
`data/projects.js` es el **fallback embebido** para que la web siga funcionando con `file://`
o si el `fetch` falla. La web vanilla lo carga con `js/data-loader.js`; React con
`client/src/context/DataContext.jsx`.

**Al agregar o cambiar contenido, actualizá siempre ambos** (JSON + fallback), o la web se
desincroniza entre el caso "con servidor" y el caso `file://`.

## i18n (ES/EN)

Cuatro archivos, con responsabilidades distintas:

| Archivo | Qué contiene |
|---|---|
| `data/projects.json` | contenido real en **ES** (canónico) |
| `data/projects.js` | mismo contenido, embebido como fallback |
| `client/src/i18n/content.js` | **prosa en EN** (bio, proyectos, servicios); se fusiona en `localizeData()` |
| `client/src/i18n/translations.js` | **strings de UI** en ES/EN (`translations.es` / `translations.en`) |

Al agregar texto nuevo: ES en `data/projects.json` (+ fallback) y EN en `content.js`. Al agregar
un string de interfaz: en `translations.js` para **ambos** idiomas. La skill `/i18n-check` lo
verifica.

## Sprites pixel-art

Los sprites son SVG en grilla, centrados en los bordes (se recentran al recortar).
Pipeline: editás en `tools/pixel-sprite-editor.html` → exportás → `npm run crop-sprite`
(`tools/crop-sprite.mjs`) → el registro de sprites está en `client/src/sprites/registry.js`.
No edites a mano un SVG ya recortado: pasalo por el cropper.

## Deploy

Vercel con **root directory = `client/`** (ver `client/vercel.json`). El build es
`npm run build` dentro de `client/`, output a `client/dist` (que se copia con `client/copy-dist.mjs`).
La skill `/deploy` tiene la secuencia exacta.

## Commits

Conventional Commits **en español**: `feat(portafolio):`, `fix(contacto):`, `docs(README):`,
`chore(deps):`. No commitear trabajo ajeno que ya esté sin commitear en el árbol.

## Cambios y entrega

- Todo PR agrega su entrada en **`CHANGELOG.md`** (formato STELLA: fecha, Added / Changed / Fixed /
  Files / Tests).
- El agente termina en **commit local**; **nunca hace `git push`**. Lautaro hace el push desde
  PowerShell.

## Agentes y configuración compartida

- **Skills compartidas**: `.agents/skills/` (`brag`, `deploy`, `i18n-check`,
  `revisar-antes-de-push`). `.cursor/skills/` sigue existiendo como fuente original de Cursor.
- **Subagentes OpenCode**: `.opencode/agents/` — `investigador` (solo lee y busca, sin bash ni
  edición), `revisor` (lee y corre lint/tests/build, sin editar) y `programador` (principal, edita,
  con push prohibido).
- **Config**: `opencode.json` define el modelo por defecto, registra `.agents/skills` y deniega
  `git push*` y la lectura de `.env*`.
- **Memoria**: `MEMORIA.md` guarda las decisiones del proyecto y los errores a no repetir. Leelo
  antes de empezar una tarea.

## Herramientas del proyecto (no están en el repo global)

- **Skills de deploy / i18n**: `.cursor/skills/` (original) y `.agents/skills/` (compartida).
- **Subagents**: `.cursor/agents/` — `verifier` (audita sin tocar), `code-reviewer`,
  `pixel-art` (sprites).
- **Hooks**: `.cursor/hooks.json` — lint (oxlint) y validación de JSON corren solos tras cada
  edición. Si ves un error de oxlint o de JSON en la conversación, viene del hook: corregilo.
- **Design skills**: los estilos visuales están archivados (fuera del repo) en
  `~/.agents/_archive/design-styles/`; no están en la lista de skills porque son ruido, no
  conocimiento. Si necesitás uno, invocá `/pixel-art` para sprites o pedí el estilo explícito.

## Learned User Preferences

- Idioma de trabajo y de commits: **español**; el código y los identificadores, también.
- Nunca commitear sin que el usuario lo pida: mostrarle el diff y que decida.
- Preferir **el cambio mínimo** que resuelve el pedido, sin refactors no solicitados.
- MCP de GitHub sustituido a propósito por `gh` CLI: usá `gh` por Bash cuando necesites GitHub.

## Learned Workspace Facts

- `data/projects.json` suele estar modificado sin commitear: es trabajo en curso, no lo reviertas.
- `brag-output-*/` son artefactos de la skill `/brag`: no se versionan.
- Los hooks de oxlint son **fail-open**: si no estás seguro, ejecutá el comando a mano.
