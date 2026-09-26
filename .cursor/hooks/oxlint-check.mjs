#!/usr/bin/env node
// Hook postToolUse: corre oxlint sobre client/ si el archivo editado es JS/JSX de esa zona.
// Sin dependencias: el hook corre en cada edicion, asi que tiene que ser barato y no romper
// al editor. Si algo falla, sale con codigo 0 (fail-open) para no bloquear el flujo.

import { spawnSync } from 'node:child_process'
import { appendFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// La raiz del repo se deriva de la ubicacion de este script (<repo>/.cursor/hooks/) y NO de
// process.cwd() ni de payload.cwd: un hook puede ejecutarse con un cwd que no es el repo
// (por ejemplo C:/Windows) y las rutas del payload pueden venir en otro casing.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const CLIENT_DIR = path.join(ROOT, 'client')
const CLIENT_SRC = path.join(CLIENT_DIR, 'src')
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
  const line = `[oxlint] ${message}`
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
    payload?.tool_input?.notebook_path,
  ]
  return candidates.find((value) => typeof value === 'string' && value.length > 0) ?? null
}

// Contencion por path.relative en vez de startsWith: asi no depende del casing con que
// venga la ruta y no acepta un sufijo que solo empareja como texto (C:\...\client\src2).
function isClientSourceFile(file) {
  const absolute = path.isAbsolute(file) ? path.normalize(file) : path.resolve(ROOT, file)
  const rel = path.relative(fold(CLIENT_SRC), fold(absolute))
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) return false
  return /\.(js|jsx)$/i.test(rel)
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

if (!isClientSourceFile(file)) {
  trace(`stdin=${stdinText.length}B tool=${tool} file=${file} decision=fuera de client/src`)
  process.exit(0)
}

if (!existsSync(path.join(CLIENT_DIR, 'node_modules'))) {
  trace(`stdin=${stdinText.length}B file=${file} decision=sin node_modules`, true)
  process.exit(0)
}

trace(`stdin=${stdinText.length}B tool=${tool} file=${file} decision=lint`)

const result = spawnSync('npm', ['run', '--silent', 'lint'], {
  cwd: CLIENT_DIR,
  encoding: 'utf8',
  shell: true,
  timeout: 90_000,
})

if (result.error || result.status !== 0) {
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
  if (!output) {
    trace(`oxlint sin salida (status=${result.status} error=${result.error ?? 'ninguno'})`, true)
    process.exit(0)
  }

  // client/ tiene 11 warnings preexistentes: solo interesan los errores, o el hook
  // terminaria volcando 11 warnings en cada edicion y gastaria tokens al pedo.
  const lines = output.split(/\r?\n/)
  const errors = lines.filter((line) => /:\d+:\d+: error /.test(line))
  const summary = lines.filter((line) => /\berrors?\b/i.test(line) && !/:\d+:\d+:/.test(line))

  if (errors.length === 0) {
    trace(`oxlint ok: 0 errores (${lines.length} lineas de salida)`)
    process.exit(0)
  }

  process.stdout.write(
    JSON.stringify({
      additional_context: [
        `oxlint fallo en client/ (${errors.length} error(es)) despues de editar ${path.basename(file)}.`,
        'Corregilos antes de seguir. Errores de `npm run lint` (workdir client/):',
        '',
        ...errors,
        ...(summary.length > 0 ? ['', ...summary.slice(-1)] : []),
      ].join('\n'),
    }) + '\n',
  )
  trace(`emitio additional_context (${errors.length} error(es))`)
}

// Salida natural en vez de process.exit() inmediato, que en Windows puede cortar el JSON ya
// escrito. El timer sin refuerzo no mantiene vivo el event loop si todo termino, pero garantiza
// la salida si algun fd (stdin, en particular) sigue abierto.
process.exitCode = 0
setTimeout(() => process.exit(0), 200).unref()
