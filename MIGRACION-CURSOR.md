# Migración de setup: opencode → Cursor 3.22.7

> Documento de planificación, ejecución, verificación y rollback de la migración del
> setup de herramientas de IA hacia Cursor IDE, con mínimo esfuerzo manual del usuario.
>
> **Versión:** 1.2 · **Inicio:** 2026-09-26 · **Alcance:** configuración global (`~/.cursor/*`)
> + configuración del repo `Portafolio-web`.
>
> v1.1 = auditoría en vivo con `/verifier`: 4 bugs reales en los hooks (raíz tomada del `cwd`,
> casing, `matcher` sin anclar, mensaje de fallback) y sus fixes, más el estado real de lo que
> se verificó dentro y fuera de Cursor.
>
> v1.2 = el test de disparo real falló: Cursor ejecutaba los hooks (`exit code: 0`, 1887 ms) pero
> con `OUTPUT: (empty)` → "none returned a valid response". Se rehízo la lectura de `stdin`
> (asíncrona, con watchdog y traza en `.cursor/hooks/hooks.log`), se acotó el `matcher` a `^Write$`
> según la doc oficial y se sumaron los casos de regresión que faltaban: spawn con pipe y escritura
> *después* de arrancar el proceso, más el red-manning de todos los caminos de filtro.
>
> v1.3 = **causa raíz del bug 5 encontrada y corregida**: Cursor manda el payload con un **BOM
> (U+FEFF) antes del `{`**, y `JSON.parse` truena con eso → `exit 0` + stdout vacio = exactamente
> el `OUTPUT: (empty)` que registraba Cursor. Se extrajo el payload real de su log de hooks, se
> reprodujo el fallo (`Unexpected token 'U+FEFF', "U+FEFF{...}" is not valid JSON`) y se agregó
> `stripBOM()` a ambos hooks. Los 2 payloads reales, con y sin BOM, ahora emiten `additional_context`.

---

## 1. Auditoría (evidencia verificada)

Todo lo de esta sección fue comprobado contra el sistema el 2026-09-26, no asumido.

### 1.1 Entorno

| Dato | Valor |
|---|---|
| SO | Windows 10/11 · Git Bash (shell `bash` sobre win32) |
| Home | `C:\Users\Lau\` |
| Repo | `C:\Users\Lau\Portafolio-web` (git, rama activa con 5 commits recientes) |
| Editor destino | Cursor **3.22.7** |
| Fuente actual | `~/.config/opencode/opencode.jsonc` (4 MCPs) |
| Node | v20+ (npx disponible; los MCP locales ya usaban `cmd /c npx`) |

### 1.2 Estructura real del proyecto (verificada)

Monorepo sin `package.json` raíz — **cada sub-proyecto tiene su propio contexto**:

```
Portafolio-web/
├── index.html, cv.html          # sitio vanilla (raíz)
├── js/  (11 módulos)            # analytics, audio, contact, cv, data-loader,
│                                # main, modal, pc-storage, terminal, theme, typewriter
├── css/ (14 archivos)           # propio, SIN Tailwind
├── data/
│   ├── projects.json            # ← FUENTE CANÓNICA de contenido
│   └── projects.js              # fallback embebido (funciona en file://)
├── assets/, tools/              # crop-sprite.mjs, pixel-sprite-editor.html, split-sprite.js
├── server/                      # Express 4 + nodemailer + dotenv (API /api/contact)
│   └── server.js, .env, inbox/
├── client/                      # React 19 + Vite 8 (la "app nueva")
│   ├── src/{components(17),context,data,hooks,i18n,sprites,styles,assets}
│   ├── .oxlintrc.json           # oxlint: react/rules-of-hooks=error
│   ├── vercel.json              # root directory de Vercel
│   └── package.json             # dev/build/lint(oxlint)/preview/crop-sprite
├── video-portafolio/            # ⚠ SUB-PROYECTO INDEPENDIENTE (HyperFrames)
│   ├── AGENTS.md (103 líneas)   #  ya tiene su propio contexto de agente
│   ├── CLAUDE.md (idéntico)     #  esqueleto duplicado
│   └── hyperframes.json, index.html, assets/, snapshots/
└── brag-output-2026-09-23-.../  # output de /brag, sin ignorar en git
```

**Stack y restricciones confirmadas:** JavaScript (**no** TypeScript), CSS propio (**no** Tailwind),
linter **oxlint** (no ESLint), i18n **ES/EN**, sprites SVG pixel-art, Vercel con root=`client/`,
commits **Conventional Commits en español**.

### 1.3 Hallazgos que cambiaron el plan

| # | Hallazgo | Impacto en el plan |
|---|---|---|
| 1 | **`afterFileEdit` no puede devolver output** (es side-effect only; su respuesta es `none`) | El feedback de lint/JSON **debe** ir por `postToolUse` con `additional_context`. El plan original era incorrecto. |
| 2 | **Los schemas de MCP son el mayor coste fijo de tokens** (GitHub MCP ≈ 50 tools) | Se **elimina** GitHub MCP → se usa `gh` CLI por Bash (0 tokens de schema). De paso desaparece el paso manual de rotar `GITHUB_TOKEN` (que además fallaba con *Bad credentials*). |
| 3 | `~/.cursor/plugins/local/` **ya existe y está vacío** | El destino del clonado de plugins ya está listo. |
| 4 | `~/.cursor/mcp.json` y `~/.cursor/hooks.json` **no existen** | Se crean desde cero (migración no destructiva). |
| 5 | `~/.agents/skills` tiene **102 skills**; duplicados en `~/.claude/skills` (10) y `~/.config/opencode/skills` (10) y `~/.opencode/skills` (1) | Fase de dedup + archivado. Cada skill no usada es coste fijo de contexto. |
| 6 | El roster real de estilos de diseño es **68** (la estimación previa de 66 estaba desfasada) | Apéndice B lista los 68 exactos. |
| 7 | **`video-portafolio/` tiene su propio `AGENTS.md`** (HyperFrames, 103 líneas) | El `AGENTS.md` raíz **no** debe contradecirlo ni duplicarlo: es un sub-proyecto autónomo. |
| 8 | **La fuente de datos es dual**: `data/projects.json` (canónica) + `data/projects.js` (fallback) | Regla obligatoria: agregar contenido = tocar ambos (y los equivalentes de `client/`). |
| 9 | **i18n repartido en 4 archivos** (`data/projects.json` ES, `data/projects.js` fallback, `client/src/i18n/content.js` prosa EN, `client/src/i18n/translations.js` UI) | Se captura como checklist en la rule de React y en la skill `/i18n-check`. |
| 10 | Estado de git sucio **preexistente** (`data/projects.json` modificado + 6 untracked) | Los cambios de esta migración se aíslan; nunca se commitea trabajo ajeno. |

### 1.4 Estado de partida en `~/.cursor/`

```
~/.cursor/
├── agents/          (existe, vacío)      → no se usa: los subagents van al repo
├── ai-tracking/
├── argv.json
├── extensions/
├── plugins/local/   (existe, VACÍO)      → destino de plugins (Fase 2)
├── projects/
├── skills-cursor/   (26 built-ins)       → NO se modifica
├── mcp.json         ✗ no existe          → Fase 1
├── hooks.json       ✗ no existe          → (los hooks de este proyecto van en el repo)
└── skills/          ✗ no existe          → skill global /create-project-rules
```

---

## 2. Objetivos y criterios de aceptación

### 2.1 Objetivo

Que Cursor 3.22.7 quede con un setup **completo, coherente y barato en tokens**, equivalente
(o superior) al que tenía opencode, documentado y **reversible**.

### 2.2 Criterios de aceptación

| # | Criterio | Cómo se comprueba |
|---|---|---|
| A1 | 4 MCPs conectados y respondiendo | `notion`, `memory`, `sequential-thinking`, `vercel` listados como activos en Settings |
| A2 | Plugins `playwright` + `continual-learning` instalados | Listados en Cursor tras Reload Window |
| A3 | El modelo conoce el stack sin pedir información | Respuesta correcta a "¿cómo linto esto?" sin leer archivos |
| A4 | Un error de lint llega al modelo automáticamente | Se introduce un error de hooks y el agente lo ve sin que se lo pidas |
| A5 | Un JSON roto se detecta | Se rompe `data/projects.json` y el hook lo reporta |
| A6 | Subagents disponibles | `verifier`, `code-reviewer`, `pixel-art` invocables |
| A7 | Sin duplicados de skills | 1 sola copia de cada skill en todo el sistema |
| A8 | Presupuesto de tokens respetado | `AGENTS.md` ≤ 1200 palabras; 0 rules `alwaysApply` |
| A9 | Nada preexistente roto | `data/projects.json` (modificado) y untracked intactos |
| A10 | Todo reversible | Cada fase tiene rollback documentado (§6) |

---

## 3. Plan de ejecución

Cada fase indica **qué** se hace, **cómo** y **con qué** (herramienta/archivo responsible).

### Fase 0 — Documento de planificación (este archivo)
- **Qué:** crear `MIGRACION-CURSOR.md` en la raíz del repo.
- **Cómo:** documento versionado con auditoría, plan, checklist vivo, verificación, rollback,
  metodología de rules, presupuesto de tokens y apéndices con el contenido exacto de cada archivo.
- **Con qué:** edición directa. **Reversible:** `git rm MIGRACION-CURSOR.md`.

### Fase 1 — MCPs globales
- **Qué:** `~/.cursor/mcp.json` con 4 servidores.
- **Cómo:** Notion y Vercel como MCP **hosted** (URL + OAuth en el navegador, sin secretos en disco);
  memory y sequential-thinking como MCP **locales** vía `cmd /c npx -y`, apuntando memory al mismo
  archivo que usa opencode.
- **Con qué:** `notion_notion-get-tool-access` para validar el alcance tras conectar.
- **Manual del usuario:** 2 clics de OAuth (Notion, Vercel).
- **Reversible:** borrar `~/.cursor/mcp.json`.

### Fase 2 — Plugins oficiales de Cursor
- **Qué:** clonar `github.com/cursor/plugins` y dejar en `~/.cursor/plugins/local/`:
  `playwright`, `continual-learning` + 3 cherry-picks de skills (`blast-radius`, `unslop`,
  `principle-prove-it-works`) que vienen en ese mismo repo.
- **Cómo:** clonado superficial a un temporal, copia selectiva al destino.
- **Con qué:** `git clone --depth 1`, `cp`.
- **Manual del usuario:** Reload Window.
- **Reversible:** borrar las carpetas copiadas en `~/.cursor/plugins/local/`.

### Fase 3 — Contexto y reglas del proyecto
- **Qué:** `AGENTS.md` raíz (≤1200 palabras) + 4 rules `.mdc` con globs:
  `client-react.mdc`, `server-express.mdc`, `vanilla-fallback.mdc`, `anti-sycophancy.mdc`.
- **Cómo:** `AGENTS.md` = contexto transversal y navegación (sin duplicar las rules);
  las `.mdc` = estándares de cada área, con `globs` para que solo carguen cuando aplican
  (0 coste fijo). La anti-sycophancy va con `alwaysApply: false` + globs amplo.
- **Con qué:** frontmatter `.mdc` (`description`, `globs`, `alwaysApply`).
- **Reversible:** `git rm` de los 5 archivos.

### Fase 4 — Higiene de skills
- **Qué:** archivar 68 estilos visuales, borrar duplicados, consolidar `brag`,
  instalar `grill-me` y `skill-creator`.
- **Cómo:** `mv` de estilos a `~/.agents/_archive/design-styles/` (fuera del discovery de Cursor,
  reversible con un `mv` de vuelta); dedup verificado por comparación antes de borrar;
  `brag` unificado en `.cursor/skills/brag/` del repo.
- **Con qué:** `mv`, `diff` para verificar duplicados, `curl` de los `SKILL.md` upstream.
- **Reversible:** todo es `mv`; los borrados de duplicados se reconstruyen desde
  `~/.agents/skills/` (que es el dueño canónico).

### Fase 5 — Hooks de calidad
- **Qué:** `.cursor/hooks.json` + 2 scripts Node: oxlint y validación JSON.
- **Cómo:** hook `postToolUse` (NO `afterFileEdit`, que es side-effect only) que filtra por
  `file_path`, ejecuta la comprobación y devuelve `additional_context` para que el modelo veas el
  error. `type: command` siempre (0 tokens de modelo). `failClosed: false` (fail-open: nunca
  bloquear el trabajo por un linter).
- **Con qué:** Node (no bash/jq) por compatibilidad Windows; `oxlint` de `client/node_modules`.
- **Esquema:** plano y validado contra la doc oficial — `command`/`type`/`failClosed`/`timeout`/
  `matcher` en el mismo nivel, y `matcher` acotado a `^Write$`: el único nombre que la doc de
  Cursor confirma como herramienta que edita archivos. Los scripts salen siempre con `0` y avisan
  por `additional_context`.
- **Lectura de `stdin`:** asíncrona (`data`/`end`/`error`) con detección de JSON completo para no
  esperar `end`, watchdog de 5 s que destruye el stream y `trace()` que registra siempre en
  `.cursor/hooks/hooks.log` (gitignored por `*.log`) y habla por `stderr` solo en los casos
  sospechosos. La salida se cierra con `'\n'` — la doc oficial lo hace así en todos sus ejemplos —
  y el proceso sale por `exitCode = 0` + `setTimeout().unref()`, nunca con `process.exit()` a la
  fuerza en medio del flush.
- **Robustez de rutas:** los dos scripts sacan la raíz del repo de `import.meta.url`
  (`<repo>/.cursor/hooks/`), nunca de `process.cwd()` ni de `payload.cwd`, y-containing con
  `path.relative`/`path.dirname` en vez de `startsWith`. Motivo: un hook puede correr con un
  `cwd` que no es el repo y las rutas del payload pueden venir en otro casing.
- **Reversible:** borrar `.cursor/`.

### Fase 6 — Subagents
- **Qué:** `.cursor/agents/{verifier,code-reviewer,pixel-art}.md`.
- **Cómo:** frontmatter `name`/`description`/`model: inherit`; `verifier` con `readonly: true`
  para que nunca "arregle" en vez de reportar.
- **Con qué:** YAML frontmatter (formato confirmado por la doc oficial).
- **Reversible:** borrar la carpeta.

### Fase 7 — Skills de proyecto
- **Qué:** `.cursor/skills/deploy/SKILL.md` e `i18n-check/SKILL.md`.
- **Cómo:** `disable-model-invocation: true` (son checklists de pasos: solo las lanza el usuario).
- **Reversible:** borrar la carpeta.

### Fase 8 — Limpieza de repo
- **Qué:** añadir `brag-output-*/` y `nul` a `.gitignore`; borrar el archivo `nul`.
- **Cómo:** append a `.gitignore`; `rm` del archivo-basura de 165 bytes.
- **Reversible:** `git checkout .gitignore`; el archivo `nul` no tiene contenido útil.

### Extra — Skill global reutilizable
- **Qué:** `~/.cursor/skills/create-project-rules/SKILL.md`.
- **Cómo:** skill de usuario que genera el set de rules para un proyecto nuevo siguiendo la
  metodología de §7.
- **Reversible:** borrar la carpeta.

---

## 4. Ejecución (checklist vivo)

Actualizado al terminar la ejecución. "Evidencia" = comando ejecutado, no inspección visual.

| Fase | Estado | Evidencia |
|---|---|---|
| 0 · `MIGRACION-CURSOR.md` | ✅ hecho | este archivo |
| 1 · `~/.cursor/mcp.json` | ✅ hecho | JSON válido; 4 MCP (notion, memory, sequential-thinking, vercel) |
| 2 · plugins | ✅ hecho | `playwright` y `continual-learning` en `~/.cursor/plugins/local/`, v1.0.0; 3 skills de `pstack` extraídas |
| 3 · rules + `AGENTS.md` | ✅ hecho | `AGENTS.md` 633 palabras; 4 rules lazy (38–51 líneas) |
| 4 · higiene de skills | ✅ hecho | 3 duplicados borrados con backup; 68 estilos archivados; `/brag` consolidado (288 archivos); 40 skills activas |
| 5 · hooks | ✅ hecho | 4/4 ramas probadas (aplica / JSON roto / lint con error / fuera de scope) + 17 casos de regresión de filtros + 11 casos de transporte `stdin` + 5 casos de BOM (payload real de Cursor) tras el fix del bug 5 |
| 6 · subagents | ✅ hecho | `verifier.md`, `code-reviewer.md`, `pixel-art.md` |
| 7 · skills deploy/i18n | ✅ hecho | ambos con comandos **ejecutados y verificados** antes de documentarlos |
| 8 · `.gitignore` + `nul` | ✅ hecho | `nul` borrado; `git check-ignore` confirma `brag-output-*/` y `/nul` |
| Extra · `/create-project-rules` | ✅ hecho | `~/.cursor/skills/create-project-rules/SKILL.md` |
| Manual · OAuth Notion + Vercel | ✅ hecho | el usuario los autorizó en el navegador |
| Manual · Reload Window | ✅ hecho | el usuario recargó; la config empezó a cargarse |
| Manual · abrir la carpeta en Cursor | ✅ hecho | el repo se abrió como workspace: `file:///c%3A/Users/Lau/Portafolio-web` |

### Desviaciones del plan (y por qué)

- **GitHub MCP se sacó del alcance** y `gh` no está instalado: el MCP devuelve
  `Authentication Failed: Bad credentials`. Para recursos públicos alcanza con HTTPS. No se
  instaló `gh` sin permiso.
- **Los hooks filtran solo errores de oxlint**, no la salida completa: el repo tiene 11 warnings
  preexistentes y volcarlos en cada edición gastaría tokens sin información útil.
- **`json-check` solo valida `data/*.json`**, no cualquier `.json`: el foco declarado son los
  datos del portafolio. Así evita falsos positivos en `.cursor/`, `skills-lock.json` o
  `client/package.json`. Compara con `path.resolve(path.dirname(...))` porque el payload puede
  mandar la ruta con `/` o con `\` y la comparación sin normalizar fallaba siempre.
- **Los hooks usan el esquema plano de `https://cursor.com/docs/agent/hooks`**: cada definición
  de `hooks.postToolUse[]` lleva `command`, `type`, `failClosed`, `timeout` y `matcher` en el mismo
  nivel. Un `hooks: [{...}]` anidado (como en Claude Code) se acepta como JSON válido pero
  **no se carga**.
- **El `matcher` de `postToolUse` compara contra el tipo de herramienta de Cursor**
  (`Shell`, `Read`, `Write`, `Grep`, `Delete`, `Task`, `MCP:<tool>`), no contra los nombres de
  herramienta de Claude (`Edit`, `StrReplace`, `MultiEdit` no existen en Cursor). Va anclado
  (`^...$`) y acotado a **`^Write$`**: un `Write|Edit|MultiEdit` sin anclar matcheaba
  `EditNotebook`, y dejar afuera variantes ruidosas no pierde nada porque las que importan —
  las que editan el repo — son `Write` y `Delete` (que no tiene lint que correr).
- **Los hooks no tocaron `.oxlintrc.json`.** Se midió y se descartó: `no-undef` en `error`
  genera falsos positivos masivos (`window`, `document`, `fetch`, `setInterval`, `AbortSignal`)
  porque la config no define `env`/`globals`, y escalar la categoría `correctness` desde el hook
  convertía en error los 4 `no-unused-vars` preexistentes → el hook avisaría en cada edición
  por problemas viejos. Con `rules-of-hooks` como única regla `error` más los errores de
  sintaxis, el hook cubre lo grave sin ruido; el resto se ve en `npm run lint`.

### Bugs que encontró la auditoría en vivo (y cómo quedaron)

`/verifier` auditó `.cursor/hooks/` y reportó `FAIL` con 4 defectos reales; un quinto apareció
cuando el test de disparo real devolvió `OUTPUT: (empty)`. Los cinco eran míos, no de la
configuración:

| # | Defecto | Consecuencia | Arreglo |
|---|---|---|---|
| 1 | Ambos scripts usaban `process.cwd()` / `payload.cwd` como raíz del repo | con `cwd: C:/Windows` el hook se callaba frente a un JSON inválido, y el de oxlint nunca encontraba `client/src` | raíz desde `import.meta.url` |
| 2 | Contención con `startsWith` y casing sensible | una ruta en minúsculas no entraba al lint; `client/src2/` habría pasado el filtro | `path.relative` + `fold()` en win32/macOS |
| 3 | `matcher` sin anclar y con nombres de Claude | matcheaba `EditNotebook`; `Edit`/`StrReplace`/`MultiEdit` no son herramientas de Cursor y nunca matcheaban | `^Write$` (única herramienta que edita) |
| 4 | El aviso de JSON pedía actualizar el fallback gemelo para cualquier `data/*.json` | ruido en archivos sin gemelo | la receta twin solo si es `data/projects.json` |
| 5 | `stdin` leído con `readSync(0)` + `process.exit()` inmediato, sin traza alguna, y **`JSON.parse` sin quitar el BOM** | Cursor registraba `exit code: 0` pero `OUTPUT: (empty)` → "none returned a valid response". El BOM (U+FEFF) que Cursor escribe antes del `{` hacía tronar a `JSON.parse`; el `catch` salía mudo | lectura asíncrona con watchdog, `stripBOM()` antes de parsear, salida con `'\n'`, salida natural (`exitCode=0` + `setTimeout().unref()`), y traza persistente en `hooks.log` |

Además, la primera prueba en vivo del hook de lint usó un `valorIndefinido`: no disparó nada
porque `no-undef` no está habilitada, así que el hook se calló correctamente. El caso de prueba
correcto es una violación de `react/rules-of-hooks`, que sí está en `error`.

**Sobre el bug 5 (causa raíz, confirmada en v1.3):** Cursor manda el payload con un **BOM
(U+FEFF) antes del `{`**. `JSON.parse` truena con eso (`Unexpected token 'U+FEFF', "U+FEFF{...}"
is not valid JSON`), el `catch` salía mudo, y el hook terminaba con `exit 0` + stdout vacio —
que es exactamente lo que Cursor reportaba: `OUTPUT: (empty)`. Se extrajo el payload real del log
de hooks de Cursor (1035 B y 974 B) y se reprodujo el fallo al 100 % con el código viejo.
También se descartó la hipótesis de `EAGAIN` (lectura parcial por `readSync`): el código viejo sí
leía el payload completo cuando el pipe se cerraba, y `process.exit(0)` no troncaba la salida.
Lo que el código viejo *sí* reproducía aparte de eso era colgarse indefinidamente si el escritor
nunca cerraba el pipe y no dejar ni un renglón de traza. El fix es `stripBOM()` antes de parsear,
tanto en la detección de JSON completo como en el parse final, en ambos hooks.

- **Las skills se redactaron contra comandos reales verificados**: el primer borrador del
  `i18n-check` traía un script que devolvía 0 claves y otro que fallaba por workdir. Ambos se
  reemplazaron por los que corren.

### Pendiente del usuario

Nada. Las tres acciones manuales quedaron resueltas:

- ~~Reload Window~~ y ~~OAuth de Notion y Vercel~~: hechos.
- `skills-lock.json` y `video-portafolio/`: **decidido dejarlos untracked y sin tocar**. No
  forman parte de esta migración; si algún día se versionan, es una decisión aparte.


---

## 5. Verificación

Cómo se comprueba que todo funciona, en orden:

1. **MCPs** — Settings ▸ MCP: los 4 con estado *connected*. Prueba: `notion_notion-get-tool-access`
   responde; `sequential-thinking` completa un razonamiento.
2. **Plugins** — tras Reload Window, las skills de `playwright` y `continual-learning` aparecen
   disponibles.
3. **Rules** — abrir un archivo de `client/src/` y preguntar por el stack: la respuesta cita React 19
   + Vite + oxlint sin necesidad de leer. Abrir un archivo de `server/` y la rule de Express carga.
4. **Hook de lint** — crear un componente con una violación de `rules-of-hooks` (hook dentro de
   un `if`, o hook en una función que no es componente) y confirmar que el agente reporta el
   error sin que se le pida. Importante: el caso de prueba tiene que ser un error de
   verdad —`no-undef` no está habilitada, así que una variable indefinida no dispara nada.
5. **Hook de JSON** — romper `data/projects.json` (o cualquier `data/*.json`) y confirmar que el
   hook lo reporta.
6. **Subagents** — invocar `/verifier` y comprobar que reporta sin editar archivos.
7. **Skills** — `/deploy` y `/i18n-check` aparecen en el picker de `/` y solo se lanzan a mano.
8. **Tokens** — `AGENTS.md` bajo 1200 palabras; ninguna rule con `alwaysApply: true`.
9. **No regresión** — `git status` solo muestra los cambios de esta migración + lo preexistente
   intacto.

> **Cómo se confirma un hook en vivo:** `additional_context` no se imprime en la conversación,
> lo recibe el modelo. Así que "no vi nada" no es evidencia de que el hook no disparó. La
> comprobación es preguntarle al modelo: *"¿te llegó algún aviso de un hook recién? cítalo
> textual"*. Si cita el mensaje del hook, disparó.

> **Antes de empezar:** con la carpeta del repo abierta en Cursor. Sin workspace abierto no
> cargan ni las rules ni los hooks ni las skills de proyecto, y el agente responde como si el
> repo estuviera vacío.

### Ya verificado por script (no requiere abrir el editor)

| Qué | Resultado |
|---|---|
| Estructura de `mcp.json` | 4 servidores, `github` ausente, `MEMORY_FILE_PATH` preservado |
| Esquema de `hooks.json` | `version: 1`, 2 hooks `postToolUse` planos, `type: command`, `failClosed: false`, `matcher: ^Write$`, scripts presentes, sin `readSync(0)` |
| Comportamiento de los 2 hooks | 17 casos de regresión (`hook-filter-test.mjs`), todos OK — JSON (roto en `data/` emite, `projects.json` y el resto de `data/*.json` válidos silencian, subcarpeta/`skills-lock.json`/`client/package.json` silencian, `cwd: C:/Windows` y ruta en mayúsculas emiten, sin `file_path` y `stdin` vacío dejan traza) y oxlint (error real de `rules-of-hooks` emite, `js/` de la raíz, `client/src2/`, `.css`, `node_modules/`, `data/` silencian, carpeta en mayúsculas igual entra al lint) |
| Transporte de `stdin` | 11 casos con pipe y escritura diferida (`hook-stdin-test.mjs`): JSON 7/7, oxlint 4/4 OK — incluye payload en una sola escritura con el pipe abierto, en 3 chunks con retraso, sin cerrar nunca, `stdin` vacío y **payload con BOM** (el caso del bug 5) |
| Payload real de Cursor con BOM | 5 casos (`hook-bom-test.mjs`): los 2 payloads extraídos del log de Cursor, con y sin BOM, más BOM + pipe que nunca se cierra → ambos hooks emiten `additional_context` en <1 s |
| Los 5 bugs de la auditoría | cubiertos por los casos anteriores: `cwd`=`C:/Windows`, `cwd` de otro repo, ruta absoluta en mayúsculas y ruta relativa al repo → los 4 primeros activan el hook; el 5 está cubierto por los 11 casos de transporte + los 5 de BOM |
| Lint de `client/` | 11 warnings preexistentes, 0 errors, exit 0 |
| Build de `client/` | `✓ built in 736ms` + `copy-dist.mjs` copió `cv.html`, `css/cv.css`, `js/cv.js`, `data/projects.json`, `data/projects.js` |
| Frontmatter de 3 subagents y 3 skills, y `disable-model-invocation` de las 2 skills | válido |
| Duplicados de skills | `~/.claude/skills`, `~/.config/opencode/skills` y `~/.opencode/skills` no existen; 40 activas, 68 estilos archivados |
| Tokens | `AGENTS.md` 633 palabras; las 4 rules con `alwaysApply: false` y globs que matchean archivos reales |
| Higiene | `.gitignore` cubre `brag-output-*/`, `/nul` y `*.log` (trazas de `hooks/hooks.log`); `nul` borrado; `client/dist` ignorado por `client/.gitignore`; sin CJK ni typos |
| `verify-migration.mjs` | `TODO VERIFICADO`, exit 0 |

Los cuatro scripts viven en `%TEMP%\opencode\` (fuera del repo, no se versionan): `verify-migration.mjs`
(inspección estática), `hook-filter-test.mjs` (17 casos de filtros, contra la traza de `hooks.log`),
`hook-stdin-test.mjs` (11 casos de transporte `stdin` con pipe real) y `hook-bom-test.mjs` (5 casos
del payload real de Cursor con BOM). Se regeneraron en v1.2/v1.3 y cualquiera se puede volver a
correr con `node <script>` — **uno por vez**: los que crean/borran `__hooktest.*` comparten fixtures.

### Verificado en vivo (con la carpeta abierta en Cursor)

| Qué | Resultado |
|---|---|
| Rules | ✅ el modelo responde con el stack del monorepo (React 19 + Vite 8 + oxlint, Express, fallbacks, i18n, Vercel) sin necesidad de leer archivos |
| Skills de proyecto | ✅ `deploy`, `i18n-check` y `brag` aparecen en el picker de `/` |
| Plugins | ✅ `playwright` y `continual-learning` listados y habilitados en Settings ▸ Plugins |
| Subagent `/verifier` | ✅ audits y reporta sin editar archivos (por eso encontró los 4 primeros bugs de los hooks) |
| Hook de lint y hook de JSON | ⏳ **el primer intento en vivo no llegó a ejecutarlos**: Cursor registraba `exit code: 0` pero `OUTPUT: (empty)`. Causa raíz hallada y corregida en v1.3 (BOM antes del `{`), y los payloads reales de Cursor ya emiten en local — falta **repetir el test** pidiéndole al agente que *escriba* el archivo con su herramienta `Write` (crearlo a mano en el IDE no dispara `postToolUse`) |

Los puntos 1, 2, 3, 6, 7 y 8 de la lista de arriba quedaron confirmados en vivo. Falta el
disparo real de los hooks (4 y 5) y el `git status` final (9).

> **Cómo leer la traza del próximo test en vivo:** cada corrida de un hook deja una línea en
> `.cursor/hooks/hooks.log`. `stdin=NNB tool=Write file=… decision=lint` (o `decision=json valido`)
> significa que el payload llegó bien y se procesó; `emitio additional_context` es la confirmación
> de que salió el aviso. `stdin vacio` = Cursor no mandó nada; `stdin no es JSON (…, BOM=false)` =
> llegó ilegible sin BOM (raro, copiar el `stdin bruto:` que sigue); `keys=[…] tool_input=[…]` sin
> `file_path` = shape distinto. Si no hay ninguna línea nueva, el hook no se ejecutó: el archivo
> se creó a mano en vez de con la herramienta `Write`, o el `matcher` no matcheó.

---

## 6. Rollback

Toda la migración es **no destructiva**: no se borra configuración previa, solo se añaden archivos
nuevos o se mueven skills a un archivo.

| Fase | Rollback |
|---|---|
| 0 | `git rm MIGRACION-CURSOR.md` |
| 1 | `rm ~/.cursor/mcp.json` |
| 2 | `rm -rf ~/.cursor/plugins/local/{playwright,continual-learning,...}` |
| 3 | `git rm AGENTS.md .cursor/rules/` |
| 4 | `mv ~/.agents/_archive/design-styles/* ~/.agents/skills/`; `brag` vuelve a `.claude/skills/` |
| 5 | `rm -rf .cursor/hooks.json .cursor/hooks/` |
| 6 | `rm -rf .cursor/agents/` |
| 7 | `rm -rf .cursor/skills/` |
| 8 | `git checkout .gitignore` |
| Extra | `rm -rf ~/.cursor/skills/create-project-rules` |

**Punto de no retorno:** ninguno. No se modifica `opencode.jsonc`, ni la memoria, ni
`~/.cursor/skills-cursor/`. Si Cursor molesta, se borra lo añadido y se vuelve a opencode intacto.

---

## 7. Metodología: cómo se escriben rules para Cursor

El objetivo declarado del usuario es *"darle siempre contexto y herramientas a la IA para hacer los
proyectos lo más profesional posible"*. Esta sección es el método, para que las rules futuras se
escriban con criterio y no se conviertan en ruido.

### 7.1 Los 4 mecanismos y cuándo usar cada uno

| Mecanismo | Se carga… | Uso correcto |
|---|---|---|
| `AGENTS.md` | **siempre** (todo request) | Contexto transversal: qué es el repo, cómo se ejecuta, dónde está cada cosa. |
| Rule `.mdc` con `globs` | cuando un archivo del glob está abierto | Estándares de un área (React, Express, vanilla). |
| Skill | cuerpo bajo demanda; solo la descripción siempre | Procedimientos repetibles con pasos (`/deploy`, `/i18n-check`). |
| Subagent | bajo demanda (agente aparte) | Trabajo que necesita foco y contexto propio (`verifier`). |
| Hook | no carga contexto; ejecuta un comando | Automatizar comprobaciones mecánicas (lint, JSON). |

### 7.2 Reglas de redacción (consenso de la comunidad + doc oficial)

1. **Corta y reactiva.** 50–80 líneas por rule; <500 el techo oficial. Una rule que podría estar en
   cualquier proyecto no debería estar en *tu* repo.
2. **Budget de contexto.** Todo lo `alwaysApply` + `AGENTS.md` combinado debe quedar **<2000–3000
   tokens**. Aquí: `AGENTS.md` solo, ~0 rules always-apply.
3. **Un solo lugar por tema.** Si un estándar está en `AGENTS.md`, no se repite en una `.mdc` ni en
   una skill. La duplicación es el bug #1 de los setups de IA.
4. **Concreto y verificable.** "Usar `data/projects.json` como fuente canónica y espejar en
   `data/projects.js`" es accionable; "mantener los datos ordenados" no.
5. **Escribir en imperativo y con "por qué".** La IA mejora cuando entiende la razón
   (p. ej. "oxlint, no ESLint, porque el proyecto es JS puro y no hay transpilación de tipos").
6. **Los globs mueren en silencio.** Si renombrás una carpeta, las rules dejan de disparar sin
   avisar. Revisar las rules tras cada refactor grande.
7. **Podar.** Si una regla no cambió una decisión en 30 días, sobra. Cursor 3.9+ tiene un
   leaderboard en *Customize* que muestra qué skills/MCPs se usan de verdad: es la guía de poda.
8. **Regla vs skill.** Si es un *estándar* → `.mdc`. Si es una *secuencia de pasos* → skill.
   Los "Apply Intelligently" se están migrando a skills (comando `/migrate-to-skills`).
9. **Un hook no es una regla de estilo, es un seguro.** Solo para lo mecánico y lo grave
   (JSON roto, lint en error). Y tres cosas que se/learneron al probar:
   - **Nunca usar `process.cwd()` o `payload.cwd` como raíz.** El hook se puede ejecutar con
     un cwd que no es el repo; la raíz sale de `import.meta.url`.
   - **`additional_context` es invisible para el usuario.** Lo recibe el modelo. "No vi nada" no
     prueba que el hook no disparó: hay que preguntarle al modelo qué recibió.
   - **Probalo con un error que exista.** Una regla en `warning` (o no habilitada) hace que el
     hook se calle y parece un hook roto.

### 7.3 Herramientas de mantenimiento propias de Cursor

No hay que instalar nada para mantener esto: `create-rule`, `create-skill`, `create-hook`,
`create-subagent`, `migrate-to-skills`, `review`, `blame`, `split-to-prs`, `loop`.

---

## 8. Presupuesto de tokens

El setups de IA se paga en contexto, y el contexto se paga en cada request. Presupuesto acordado:

| Concepto | Techo | Estado inicial |
|---|---|---|
| `AGENTS.md` + rules `alwaysApply` | <2000 tokens | `AGENTS.md` solo, ≤1200 palabras |
| Rules con `globs` | 0 fijo (lazy) | 4 rules, 0 `alwaysApply` |
| Schemas de MCP | minimizar | 4 servers (se quitó GitHub MCP: ~50 tools) |
| Lista de skills | descripciones de 1 línea | 34 skills activas (68 estilos archivados) |
| Hooks | 0 tokens de modelo | solo `type: command` (nunca `type: prompt`) |
| Subagents | 3 descripciones | 3 subagents, prompts cortos |

**Regla de oro:** si una instrucción se puede dejar en un archivo que solo se lee cuando aplica
(rule con globs, skill, o doc), no va en `AGENTS.md`.

---

## Apéndice A — Contenido exacto de los archivos a crear

> Los contenidos definitivos se vuelcan en este apéndice a medida que se ejecutan las fases.

### A.1 `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "notion": { "url": "https://mcp.notion.com/mcp" },
    "memory": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-memory"],
      "env": { "MEMORY_FILE_PATH": "C:\\Users\\Lau\\.opencode\\memory.jsonl" }
    },
    "sequential-thinking": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "vercel": { "url": "https://mcp.vercel.com" }
  }
}
```

*(Notion y Vercel usan OAuth por navegador: no se guarda ningún secreto en disco.
GitHub se sustituye por `gh` CLI — 0 tokens de schema, sin token que rotar.)*

### A.2 Los demás archivos

Se documentan aquí al ejecutarse cada fase (Fases 2–8).

---

## Apéndice B — Roster de skills (verificado)

### B.1 Se archivan (68 estilos visuales) → `~/.agents/_archive/design-styles/`

`agentic, ant, artistic, basic, bento, bold, brutalism, cafe, claude, claymorphism, clean, codex,
colorful, contemporary, corporate, cosmic, creative, dithered, doodle, dramatic, editorial, enterprise,
expressive, fantasy, fiction, flat, friendly, futuristic, genjutsu, geometric, glassmorphism, gradient,
immersive, impeccable, levels, lingo, material, matrix, minimal, modern, mono, neobrutalism, neon,
neumorphism, pacman, paper, perspective, power, premium, professional, pulse, refined, retro, riso,
roku, sega, shadcn, sketch, skeumorphism, sleek, spacious, square, stitch, storytelling, terracotta,
tetris, vibrant, vintage`

### B.2 Se mantienen activas (34) en `~/.agents/skills/`

`code-review-security, design-dna, django-security, extract-design-system, find-skills, gsap,
hyperframes, hyperframes-animation, hyperframes-audio, hyperframes-cli, hyperframes-core,
hyperframes-creative, hyperframes-keyframes, hyperframes-registry, hyperframes-studio,
internationalization-i18n, material-ui-styling, material-ui-theming, media-use, motion-design,
pyqt6-ui-development-rules, python-logging-best-practices, python-performance-optimization,
python-testing-patterns, seo, seo-audit, sqlalchemy-orm, three.js, twilio-sendgrid-email-send,
ui-ux-designer, vercel-react-best-practices, vite, vitest, xss-prevention`

*(Se conservan las skills de metodología —no son estilos— y todo el stack de video/HyperFrames,
que este repo usa en `video-portafolio/`.)*

### B.3 Se borran como duplicados

`~/.claude/skills/` (10) · `~/.config/opencode/skills/` (10) · `~/.opencode/skills/` (1) —
tras verificar que son copias idénticas del dueño canónico `~/.agents/skills/`.

### B.4 Se añaden

`grill-me` (cuestiona requisitos antes de codificar) · `skill-creator` (authoring de skills).

---

## Apéndice C — Fuentes consultadas

- Doc oficial de Cursor: hooks, subagents, rules, skills, MCP, página *Customize* (leaderboard 3.9+).
- `github.com/cursorrulespacks/cursorrules-collection` (110+ `.mdc` validadas) y
  `github.com/PatrickJS/awesome-cursorrules` (257 `.mdc`) — de ahí sale la rule anti-sycophancy.
- `github.com/spencerpauly/awesome-cursor-skills` — patrones de construcción de skills.
- `skills.sh` (leaderboard por installs reales) — selección de `grill-me` y `skill-creator`.
- `github.com/cursor/plugins` (93 skills oficiales) — de ahí salen `playwright`,
  `continual-learning`, `blast-radius`, `unslop`, `principle-prove-it-works`.
- `~/.config/opencode/opencode.jsonc` — fuente de los MCP a migrar.
