#!/usr/bin/env node
// Hook postToolUse: valida el JSON editado cuando es un .json del proyecto.
// El foco es data/*.json (fuente canonica del portafolio): un JSON invalido rompe la web
// en silencio, asi que avisamos al modelo en el mismo momento en que lo escribe.

import { appendFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// La raiz del repo se deriva de la ubicacion de este script (<repo>/.cursor/hooks/) y NO de
// payload.cwd ni de process.cwd(): si el evento trae un cwd que no es el repo, resolver
// desde ahi dejaba al hook mudo frente a un JSON invalido.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA_DIR = path.join(ROOT, 'data')
const PROJECTS_JSON = path.join(DATA_DIR, 'projects.json')
const LOG_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'hooks.log')
const CASELESS = process.platform === 'win32' || process.platform === 'darwin'
const fold = (value) => (CASELESS ? value.toLowerCase() : value)
// Cursor escribe el payload con un BOM (U+FEFF) antes del '{'. JSON.parse truena con eso, el
// hook sale con exit 0 y stdout vacio, y Cursor lo reporta como "OUTPUT: (empty)" — exactamente
// el bug 5. Se limpia antes de parsear, tanto en la deteccion de JSON completo como al final.
const stripBOM = (value) => value.replace(/^\uFEFF/, '')

// Un hook mudo es indetectable: Cursor imprime "none returned a valid response" y un exit 0
// por decision legitima se ve identico a un exit 0 porque el payload no se pudo leer. Por eso
// toda decision queda en hooks.log (gitignored) y los casos sospechosos ademas van a stderr,
// que Cursor registra en su propio log de hooks.
function trace(message, noisy = false) {
  const line = `[json-check] ${message}`
  try {
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ${line}\n`)
  } catch {}
  if (!noisy) return
  try {
    process.stderr.write(`${line}\n`)
  } catch {}
}

function readStdin(timeoutMs = 5_000) {
  return new Promise((resolve) => {
    let raw = ''
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // Liberar el fd: si el escritor nunca cierra el pipe, el event loop seguiria vivo y el
      // hook no terminaria solo. Se destruye el stream, no se hace pause().
      try {
        process.stdin.destroy()
      } catch {}
      resolve(raw)
    }
    const timer = setTimeout(finish, timeoutMs)
    process.stdin.setEncoding('utf8')
    // Cursor puede escribir el payload en varios chunks o dejar el pipe abierto: se acumula y
    // se termina apenas el JSON es completo, sin esperar 'end' (y con watchdog por si jamas
    // llega nada).
    process.stdin.on('data', (chunk) => {
      raw += chunk
      try {
        JSON.parse(stripBOM(raw))
        finish()
      } catch {
        /* JSON incompleto: faltan chunks */
      }
    })
    process.stdin.on('end', finish)
    process.stdin.on('error', finish)
    process.stdin.resume()
  })
}

function editedPath(payload) {
  const candidates = [
    payload?.file_path,
    payload?.filePath,
    payload?.path,
    payload?.tool_input?.file_path,
    payload?.tool_input?.filePath,
    payload?.tool_input?.path,
  ]
  return candidates.find((value) => typeof value === 'string' && value.length > 0) ?? null
}

// Solo data/*.json de primer nivel: es la fuente canonica del portafolio. Validar cualquier
// .json del repo generaria falsos positivos (skills-lock.json, .cursor/**, package.json) sin
// valor. path.normalize resuelve separadores: el payload puede mandar C:/... o C:\...
function isDataJson(file) {
  const resolved = path.isAbsolute(file) ? path.normalize(file) : path.resolve(ROOT, file)
  if (path.extname(resolved).toLowerCase() !== '.json') return null
  if (path.dirname(fold(resolved)) !== fold(DATA_DIR)) return null
  return resolved
}

const raw = await readStdin()
const stdinText = stripBOM(raw)

if (stdinText.trim() === '') {
  trace('stdin vacio (0 bytes): el payload nunca llego', true)
  process.exit(0)
}

let payload = null
try {
  payload = JSON.parse(stdinText)
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  trace(`stdin no es JSON (${stdinText.length} bytes, BOM=${raw.charCodeAt(0) === 0xfeff}): ${reason}`, true)
  trace(`stdin bruto: ${JSON.stringify(raw.slice(0, 600))}`, true)
  process.exit(0)
}

const tool = typeof payload?.tool_name === 'string' ? payload.tool_name : '-'
const file = editedPath(payload)
if (!file) {
  const topKeys = payload && typeof payload === 'object' ? Object.keys(payload).join(',') : typeof payload
  const input = payload?.tool_input
  const inputKeys = input && typeof input === 'object' ? Object.keys(input).join(',') : String(input)
  trace(`stdin=${stdinText.length}B tool=${tool} keys=[${topKeys}] tool_input=[${inputKeys}] decision=sin file_path`, true)
  process.exit(0)
}

const target = isDataJson(file)
if (!target) {
  trace(`stdin=${stdinText.length}B tool=${tool} file=${file} decision=fuera de data/*.json`)
  process.exit(0)
}

let text
try {
  text = readFileSync(target, 'utf8')
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  trace(`stdin=${stdinText.length}B file=${target} decision=no legible: ${reason}`, true)
  process.exit(0)
}

try {
  JSON.parse(text)
  trace(`stdin=${stdinText.length}B tool=${tool} file=${target} decision=json valido`)
  process.exitCode = 0
  setTimeout(() => process.exit(0), 200).unref()
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error)
  const relPath = path.relative(ROOT, target).split(path.sep).join('/')
  // El gemelo con fallback es solo projects.json; el resto de data/*.json no tiene par.
  const fallbackAdvice =
    fold(target) === fold(PROJECTS_JSON)
      ? [
          'Arreglalo ahora y actualiza tambien el fallback gemelo',
          '(data/projects.js para la raiz, client/src/data/fallback.js para React).',
        ]
      : ['Arreglalo ahora (este archivo no tiene fallback gemelo).']

  process.stdout.write(
    JSON.stringify({
      additional_context: [
        `${relPath} no es JSON valido y lo acabas de editar.`,
        `Motivo: ${detail}`,
        ...fallbackAdvice,
      ].join('\n'),
    }) + '\n',
  )
  trace(`emitio additional_context para ${relPath}`)
  // Salida natural en vez de process.exit() inmediato, que en Windows puede cortar el JSON ya
  // escrito. El timer sin refuerzo no mantiene vivo el event loop si todo termino, pero
  // garantiza la salida si el pipe de stdin sigue abierto.
  process.exitCode = 0
  setTimeout(() => process.exit(0), 200).unref()
}
