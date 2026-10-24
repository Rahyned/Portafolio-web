---
name: i18n-check
description: Verifica que todo el texto nuevo exista en ES y EN y que los datos canónicos estén sincronizados con sus fallbacks. Usar al agregar o cambiar contenido, proyectos, servicios o strings de interfaz, y antes de commitear cambios en data/ o i18n/.
disable-model-invocation: true
---

# Chequeo de i18n

Cinco archivos con responsabilidades distintas. El error típico es editar uno y olvidar otro: el
sitio **no rompe**, muestra un campo vacío o un texto en el idioma equivocado. Eso es peor que un
error visible.

| Archivo | Qué va ahí | Idioma |
|---|---|---|
| `data/projects.json` | contenido canónico | **ES** |
| `data/projects.js` | mismo contenido embebido (fallback `file://`) | **ES** |
| `client/src/data/fallback.js` | `FALLBACK_DATA`, fallback de React | **ES** |
| `client/src/i18n/content.js` | `CONTENT_EN`: prosa (bio, proyectos, cajas, servicios) | **EN** |
| `client/src/i18n/translations.js` | `translations.es` / `translations.en`: UI | **ES + EN** |

## Los 4 chequeos (comandos verificados, no inventados)

### 1. Paridad de claves ES/EN en la UI

`translations.js` tiene claves con punto (`"theme.arcade"`) y `client/package.json` es
`type: module`, así que se importa directo. **Workdir: `client/`**

```bash
node --input-type=module -e "
import { translations } from './src/i18n/translations.js';
const es = Object.keys(translations.es), en = Object.keys(translations.en);
console.log('ES:', es.length, '| EN:', en.length);
console.log('solo ES:', es.filter(k => !en.includes(k)).join(', ') || '(ninguna)');
console.log('solo EN:', en.filter(k => !es.includes(k)).join(', ') || '(ninguna)');
"
```

Una clave en un idioma y no en el otro = texto vacío en pantalla. Baseline actual: **131 / 131**.

### 2. Sincronía de ids entre los 3 archivos de datos + prosa EN

**Workdir: `client/`**. Compara los ids de proyecto de `data/projects.json` contra
`data/projects.js`, contra `client/src/data/fallback.js` y contra `CONTENT_EN.PROJECTS`.

```bash
node --input-type=module -e "
import { readFileSync } from 'node:fs';
import { CONTENT_EN } from './src/i18n/content.js';
import { FALLBACK_DATA } from './src/data/fallback.js';
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '\$1');
const canon = JSON.parse(readFileSync(root + '/data/projects.json', 'utf8'));
const vanilla = readFileSync(root + '/data/projects.js', 'utf8');
const ids = d => (d.PROJECT_BOXES ?? []).flatMap(b => (b.projects ?? []).map(p => p.id));
const canonIds = ids(canon);
const falta = (arr, etq) => { const f = canonIds.filter(id => !arr.includes(id)); console.log(etq + ':', f.join(', ') || '(ninguno)'); };
console.log('proyectos en projects.json:', canonIds.length);
falta(vanilla, 'faltan en data/projects.js   ');
falta(ids(FALLBACK_DATA), 'faltan en client fallback.js ');
falta(Object.keys(CONTENT_EN.PROJECTS ?? {}), 'sin prosa EN en content.js   ');
"
```

Baseline actual: **8 proyectos, ninguno faltante**.

### 3. JSON válido

**Workdir: raíz del repo** (no `client/`: `data/` vive en la raíz).

```bash
node -e "JSON.parse(require('fs').readFileSync('data/projects.json','utf8'));console.log('ok')"
```

### 4. Sin texto hardcodeado

Nada de strings visibles escritos directo en el JSX: van en `translations.js`. Esto no se puede
automatizar barato; es una lectura del diff. Decí qué revisaste.

## Checklist de la skill

- [ ] `translations.es` y `translations.en` con las mismas claves
- [ ] todo proyecto nuevo tiene prosa en `CONTENT_EN.PROJECTS.<id>` (y etiqueta de caja en
      `CONTENT_EN.BOXES.<cajaN>` si es una caja nueva)
- [ ] `data/projects.json` → reflejado en `data/projects.js` y `client/src/data/fallback.js`
- [ ] los `.json` parsean
- [ ] ningún string visible nuevo hardcodeado en componentes

## Salida esperada

Resumen corto: qué se chequeó, qué falta y en qué archivo. Si todo está parejo, una línea. Si no
pudiste comparar algo, decilo explícitamente: no inventes cobertura.
