---
name: revisar-antes-de-push
description: Corre lint, tests y build en client/, muestra git status y el diff completo, y resume riesgos antes de un push. Usar cuando el usuario pide "revisar antes de push", "chequear que está todo", "verificar la rama" o "¿puedo pushear?".
---

# Revisar antes de push

Verificación completa antes de publicar. **Nunca hacés `git push`**, ni stageás ni commiteás sin
que el usuario lo pida explícitamente.

## 1. Comprobaciones en `client/`

Trabajá siempre con el workdir en `client/` (es un monorepo sin `package.json` raíz).

```bash
npm run lint
npm test
npm run build
```

- **Lint**: oxlint debe terminar con 0 errores. Los warnings preexistentes no bloquean, pero
  listalos si aparecen nuevos.
- **Tests**: vitest tiene que pasar entero. Si falla, no sigas: reportá el test y el error.
- **Build**: `vite build && node copy-dist.mjs`. Si falla, mostrá el error completo.

Si el cambio toca la raíz (HTML/CSS/JS vanilla) o `server/`, agregá una verificación acorde:
JSON que parsee, servidor que arranque, o revisión manual del código. Si toca datos, comprobá que
`data/projects.json`, `data/projects.js` y `client/src/data/fallback.js` estén sincronizados.

## 2. Estado y diff

```bash
git status --short
git diff --stat
git diff
```

Mostrá también los archivos sin trackear (`git status --short`) y aclará cuáles son parte de este
cambio y cuáles son trabajo en curso ajeno.

## 3. Resumen de riesgos

Cerrá con un informe breve y concreto:

- Resultado de lint, tests y build.
- Archivos cambiados y si el alcance coincide con lo pedido.
- Riesgos reales: regresiones, contratos de datos desincronizados, i18n incompleto, secretos o
  `.env` expuestos, cambios ajenos que se colarían en el commit.
- Veredicto: **listo para push** o **no listo**, con el motivo.

## 4. Límites

- **Nunca** ejecutes `git push`, `git push --force` ni equivalentes.
- **Nunca** hagas `git add`, `git commit` ni `git reset` por iniciativa propia.
- Si el usuario pide el push, recordale que lo hace él desde PowerShell.
