# PROMPT: Portafolio Web Interactivo con Estética Pokémon Retro

**Target:** Desarrolladores + Clientes Freelance (50-50) | Placeholder Data

---

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO

Desarrolla una web de portafolio que funciona como una **carta de presentación interactiva** con estética de videojuego retro tipo Pokémon (8/16-bits). La web debe combinar nostalgia visual con funcionalidad profesional, permitiendo a visitantes (devs + clientes freelance) explorar proyectos, stack técnico y opciones de contacto de forma memorable y lúdica.

La experiencia **NO usa un marco de consola física**; es pantalla completa con interfaz retro integrada. El contenido actual es **PLACEHOLDER**—será reemplazado con datos reales más adelante.

---

## 2. STACK TÉCNICO RECOMENDADO

### Frontend:
- **HTML5** semántico
- **CSS3** (Grid, Flexbox, animaciones, variables de color)
- **JavaScript vanilla** (NO framework por ahora—puede ser React después)
- **Tipografías:** Press Start 2P (menús/títulos en píxeles), font-family legible para texto largo

### Herramientas Opcionales:
- Web Audio API para sonidos retro (8-bits)
- LocalStorage para persistencia de preferencias (tema, mute)
- Fetch API para contacto (formulario → backend)
- Git para versionado

---

## 3. ESTRUCTURA DE LA WEB

### 3.1 HEADER / BARRA DE ESTADO

**Ubicación:** Arriba, fijo (fixed/sticky)

**Elementos:**
- `[NOMBRE EN PÍXELES]` — Ej: LAUTARO.DEV (Press Start 2P, clickeable → scroll a hero)
- `[🔊 / 🔇]` — Botón mute/unmute (controla sonidos retro)
- **Selector de Tema** — Buttons con opciones: Red Version | Blue Version | Dark Mode
- **Estado/Badge** — Ej: '⚡ DISPONIBLE PARA PROYECTOS' (actualizable, cambiar según estado real)

**Estilos:** Fondo oscuro (#0D1117 o similar), borde inferior sutil, altura compacta (~60px)

---

### 3.2 HERO / LANDING INICIAL

**Ubicación:** Justo debajo del header

**Contenido:**
- Línea clara: `"Desarrollador Web & Sistemas | Automatización • Arquitectura • APIs"`
- Frase secundaria: `"Explora mis proyectos y servicios →"` (typewriter animation)
- Botón principal: `[ENTRAR A LA PC]` → Scroll/fade hacia ficha de entrenador
- Ícono/decoración: pequeño sprite de entrenador píxelado (opcional)

**Duración del typewriter:** ~2-3 segundos, puede saltarse con clic/Enter

---

### 3.3 FICHA DE ENTRENADOR (SOBRE MÍ)

**Ubicación:** Primera sección interactiva tras hero

**Estructura visual tipo card retro:**

- **AVATAR:** Pequeño sprite píxelado (64x64px, circular o cuadrado con borde)
- **NOMBRE:** `[LAUTARO]` (Press Start 2P)
- **DATOS BÁSICOS:**
  - Clase: Desarrollador Web & Sistemas
  - Nivel: `[EXP LEVEL]` / 99
  - Años de Exp: `[PLACEHOLDER: 5+]`
  - Proyectos Completados: `[PLACEHOLDER: 15+]`
- **MEDALLAS (Stack Principal):**
  - `[React] [Node.js] [Python] [PostgreSQL] [Docker]`
  - Cada medalla es un badge visual con icono

**BIO / PRESENTACIÓN (Typewriter):**

> "Soy un desarrollador enfocado en construir soluciones de software escalables y automatizaciones eficientes. Trabajo en web (frontend/backend) y sistemas, con énfasis en código limpio, performance y arquitectura. Disponible para proyectos freelance o colaboraciones técnicas. Presiona cualquier tecla para continuar."

---

### 3.4 NAVEGACIÓN / BREADCRUMB RETRO

**Ubicación:** Debajo del hero, antes de la ficha (o en sidebar sticky)

**Formato:** `INICIO > FICHA > PC > CONTACTO` (links internos, resalta la sección actual)

---

### 3.5 SISTEMA DE ALMACENAMIENTO PC (PROYECTOS)

**Ubicación:** Sección central de la web

**Concepto:** Emula la interfaz de la PC de Bill (Sistema de Almacenamiento de Pokémon)

**Funcionalidades:**

- **CAJAS NAVEGABLES:** Dropdown/Tabs para cambiar entre categorías:
  - `[CAJA 1: DESARROLLO WEB]`
  - `[CAJA 2: SISTEMAS & AUTOMATIZACIÓN]`
  - `[CAJA 3: INTEGRACIONES & APIs]`
- **GRILLA DE ALMACENAMIENTO:** 4x3 o 5x3 (12-15 slots), algunos ocupados, otros vacíos
- **SPRITES/THUMBNAILS:** Cada proyecto es un pequeño ícono o sprite píxelado clickeable
- **TRANSICIONES:** Sonido retro al cambiar de caja, efecto fade/slide

**AL SELECCIONAR UN PROYECTO:**

Se abre un **PANEL MODAL** con:

```
┌─────────────────────────────────────┐
│ [NOMBRE DEL PROYECTO] | [Sprite]   │
│                                     │
│ [VER DETALLES]  [STACK/TECH]  [DEMO/CÓDIGO]
│                                     │
│ 1️⃣ Problema → Solución → Resultado │
│                                     │
│ 2️⃣ React • Node.js • PostgreSQL    │
│                                     │
│ 3️⃣ [🌐 LIVE DEMO]  [💾 GITHUB]    │
│                                     │
│ Completado: [Timeline]             │
└─────────────────────────────────────┘
```

**Tres Secciones Visibles (No tabs—bloques lado a lado o stacked en mobile):**

1. **[VER DETALLES]:** Problema → Solución → Resultado
2. **[STACK/TECH]:** Lista de tecnologías, lenguajes, librerías
3. **[DEMO/CÓDIGO]:** Dos botones → `[🌐 LIVE DEMO] [💾 GITHUB]`

---

### 3.6 SECCIÓN DE CONTACTO DINÁMICO

**Ubicación:** Cercana al final, antes de footer

#### PANEL PRINCIPAL — PokéNav (Contactos Directos):

- **Encabezado:** `"CONTACTOS"` (Press Start 2P)
- **Tres opciones claras con botones retro:**
  - 📧 EMAIL → `[lautaro@mail.com]` + botón `[ENVIAR]`
  - 💼 LINKEDIN → `[/in/lautaro]` + botón `[ABRIR]`
  - 🔗 GITHUB → `[@lautaro]` + botón `[VER PERFIL]`
- Sonido retro al pasar mouse (opcional, respeta mute)

#### PANEL SECUNDARIO — Centro de Intercambio (Formulario de Proyecto):

- **Encabezado:** `"¿TIENES UN PROYECTO? INICIA UN INTERCAMBIO"`
- **Transición visual:** Efecto glitch o slide desde PokéNav
- **Campos del formulario:**
  - Nombre (Text input)
  - Email (Email input)
  - Tipo de Proyecto (Dropdown: Web | Sistema | Automatización | Otro)
  - Presupuesto (Radio buttons: Pequeño | Mediano | Grande)
  - Descripción / Detalles (Textarea)
  - Timeline (Dropdown: ASAP | 2-4 semanas | 1-3 meses | Flexible)
- **Botón de Envío:** `[CONFIRMAR INTERCAMBIO]` (con sonido retro, animación)

---

### 3.7 EASTER EGGS & FUNCIONALIDADES OCULTAS

- **TERMINAL RETRO** (En la PC de Almacenamiento):
  - Presionar `T` abre una terminal interactiva tipo línea de comandos
  - Comandos disponibles: `help | projects | skills | about | contact | cv | clear`
  - Respuestas retro pero informativas

- **CÓDIGO KONAMI** (Easter Egg de Tema):
  - Secuencia: `↑ ↑ ↓ ↓ ← → ← → B A`
  - Efecto: Cambia la paleta a una versión alternativa sorpresa

- **SALTEAR TYPEWRITER:**
  - Presionar cualquier tecla o clic avanza el texto al 100%

---

### 3.8 FOOTER / CIERRE

- Créditos mínimos: `"© 2024 Lautaro | Diseño & Código custom"`
- Links secundarios: CV Descargable | Términos (si aplica)
- Estilo: Fondo oscuro, tipografía pequeña, discreto

---

## 4. ESPECIFICACIONES DE DISEÑO VISUAL

### 4.1 PALETA DE COLORES

#### Base (Dark Mode por defecto):
- **Fondo primario:** `#0D1117` (gris muy oscuro, casi negro)
- **Fondo secundario:** `#161B22` (gris oscuro ligeramente más claro)
- **Texto principal:** `#E6EDF3` (blanco suave)
- **Texto secundario:** `#8B949E` (gris claro)
- **Acentos:** `#58A6FF` (azul) / `#79C0FF` (azul claro) / `#FF6B6B` (rojo)
- **Bordes:** `#30363D` (gris muy oscuro)

#### Red Version Theme:
- **Acentos:** Tonos rojos (`#FF1744`, `#E53935`)
- **Fondo:** Rojo muy oscuro (`#2A1515`)
- **Botones:** Bordes rojos, hover en rojo brillante

#### Blue Version Theme:
- **Acentos:** Tonos azules (`#0066FF`, `#1E90FF`)
- **Fondo:** Azul muy oscuro (`#0A1528`)
- **Botones:** Bordes azules, hover en azul brillante

### 4.2 TIPOGRAFÍAS

- **Press Start 2P** (Google Fonts) — Menús, títulos, headers, badges. Tamaño: 12-24px
- **JetBrains Mono** o **Fira Code** (Google Fonts) — Código, valores técnicos. Tamaño: 11-14px
- **Inter** o **Roboto** (Google Fonts) — Cuerpo de texto, descripciones. Tamaño: 14-18px

### 4.3 EFECTOS & ANIMACIONES

- **Typewriter Text:** Animación de escribir letra por letra. Duración: 2-3s. Puede saltarse.
- **Hover Effects:** Botones se iluminan, bordes cambian de color, sombra sutil.
- **Transiciones de Caja:** Fade/slide suave al cambiar de caja en PC (0.3-0.5s)
- **Modal Animation:** Ficha de proyecto aparece con efecto scale-in (0.4s)
- **Glitch Effect (Opcional):** Efecto glitch al abrir formulario de contacto (1-2 frames de desplazamiento)
- **Efectos de Sonido (8-bits):** Clic en botones, cambio de caja, envío de formulario. Controlado por botón mute.

### 4.4 ESPACIADO & DIMENSIONES

- **Header:** Altura 60px, padding horizontal 20px
- **Hero:** min-height 300px, padding 40px
- **Secciones:** Max-width 1200px, padding lateral 40px, vertical 60px
- **Cards/Modales:** Border 2px solid, padding 20px, gap entre elementos 10-20px
- **Mobile:** Padding reducido a 20px, tipografía más pequeña (respeto legibilidad)

---

## 5. DATOS PLACEHOLDER (A REEMPLAZAR MÁS ADELANTE)

⚠️ **TODOS LOS DATOS SIGUIENTES SON PLACEHOLDER. Serán reemplazados con información real en futuras iteraciones.**

### 5.1 DATOS DEL PERFIL

| Campo | Placeholder |
|-------|-------------|
| Nombre | `[LAUTARO]` |
| Clase | Desarrollador Web & Sistemas |
| Nivel | `[45]` / 99 |
| Años de Experiencia | `[5+]` |
| Proyectos Completados | `[15+]` |
| Ubicación | `[Rosario, Argentina]` |
| Estado | ⚡ DISPONIBLE PARA PROYECTOS |

### 5.2 PROYECTOS PLACEHOLDER (CAJA 1: DESARROLLO WEB)

#### Proyecto 1: Abstracto Shopp (E-commerce)
- **Problema:** Cliente necesitaba vender streetwear online sin plataforma existente
- **Solución:** E-commerce custom con carrito, inventario, pasarela de pago
- **Resultado:** 300+ pedidos en primer mes, 95% uptime
- **Stack:** React, Node.js, PostgreSQL, Stripe, Docker
- **Timeline:** Nov 2023
- **Demo:** https://abstractoshopp.example.com (PLACEHOLDER)
- **GitHub:** https://github.com/lautaro/abstracto-shopp (PLACEHOLDER)

#### Proyecto 2: Florería Susi (Landing + Booking)
- **Problema:** Floristería sin presencia digital, pedidos por teléfono
- **Solución:** Landing atractivo + sistema de reserva de flores online
- **Resultado:** 60% de pedidos now online, reducción de 10 horas/semana en coordinación
- **Stack:** Next.js, Tailwind, Firebase, WhatsApp API
- **Timeline:** Sep 2023
- **Demo:** https://floreriasusi.example.com (PLACEHOLDER)
- **GitHub:** https://github.com/lautaro/floreria-susi (PLACEHOLDER)

#### Proyecto 3: Herramienta de Gestión de Tareas
- **Problema:** Equipo pequeño sin herramienta de tracking centralizada
- **Solución:** App web minimalista de tareas con drag-drop, filtros, comentarios
- **Resultado:** 40% reducción en tiempo de coordinación
- **Stack:** Vue.js, Express, MongoDB, Socket.io
- **Timeline:** Jun 2023
- **Demo:** https://tasks-app.example.com (PLACEHOLDER)
- **GitHub:** https://github.com/lautaro/tasks-app (PLACEHOLDER)

### 5.3 PROYECTOS PLACEHOLDER (CAJA 2: SISTEMAS & AUTOMATIZACIÓN)

#### Proyecto 1: STELLA (ERP de Taller Automotriz)
- **Problema:** Taller de GNC sin sistema de gestión, facturas manuales, inventario descontrolado
- **Solución:** ERP desktop con gestión de órdenes, inventario, AFIP (facturas electrónicas), reportes
- **Resultado:** 100% automatización de facturación, trazabilidad completa de stock
- **Stack:** Python (PyQt5), SQLAlchemy, SQLite, AFIP APIs
- **Timeline:** En curso
- **Demo:** Instalable en Windows (PLACEHOLDER)
- **GitHub:** https://github.com/lautaro/stella-erp (PLACEHOLDER)

#### Proyecto 2: Script de Sincronización de Datos
- **Problema:** Cliente con 3 plataformas de venta sin sincronización de inventario
- **Solución:** Script Python que sincroniza stock entre Shopify, WooCommerce y base local cada 30min
- **Resultado:** 0 sobreventa, 15 horas/semana recuperadas
- **Stack:** Python, Requests, Webhooks, Celery, PostgreSQL
- **Timeline:** Feb 2024
- **GitHub:** https://github.com/lautaro/sync-inventory (PLACEHOLDER)

### 5.4 STACK TÉCNICO (MEDALLAS)

**Frontend:**
- React, Vue.js, Next.js
- HTML5, CSS3, JavaScript/TypeScript
- Tailwind CSS, Styled Components

**Backend:**
- Node.js (Express, Fastify)
- Python (FastAPI, Django)
- APIs REST, GraphQL, Webhooks

**Bases de Datos:**
- PostgreSQL, MongoDB, SQLite
- Firebase, Redis

**DevOps & Herramientas:**
- Docker, Docker Compose
- Git/GitHub, CI/CD (GitHub Actions)
- Linux, AWS (EC2, S3), Vercel

### 5.5 INFORMACIÓN DE CONTACTO PLACEHOLDER

- **Email:** `[lautaro@example.com]`
- **LinkedIn:** `[linkedin.com/in/lautaro-example]`
- **GitHub:** `[@lautaro-example]`
- **Teléfono:** `[+54 341 XXXX-XXXX]`

---

## 6. INSTRUCCIONES PARA GENERAR EL CÓDIGO

### 6.1 ENFOQUE GENERAL

- Genera **HTML/CSS/JavaScript vanilla** (NO frameworks por ahora)
- Usa **variables CSS** para la paleta de colores (facilita cambio de tema)
- Código **limpio, modular**, comentarios clave en secciones complejas
- **Responsive:** Mobile-first, funcional en 375px y 1920px
- **Accesibilidad:** ARIA labels donde sea necesario, contraste suficiente, navegación por teclado
- **Opcionales pero recomendadas:** Web Audio API para sonidos, LocalStorage para preferencias (tema, mute)

### 6.2 ESTRUCTURA DE ARCHIVOS SUGERIDA

```
project/
├── index.html
├── css/
│   ├── variables.css (colores, tipografías, spacing)
│   ├── global.css (reset, tipografía base)
│   ├── header.css
│   ├── hero.css
│   ├── trainer-card.css
│   ├── pc-storage.css
│   ├── contact.css
│   └── animations.css
├── js/
│   ├── main.js (inicialización)
│   ├── theme.js (selector de tema, LocalStorage)
│   ├── audio.js (sonidos retro, mute)
│   ├── typewriter.js (efecto de escritura)
│   ├── pc-storage.js (lógica de PC/cajas)
│   ├── modal.js (abrir/cerrar detalles de proyecto)
│   ├── terminal.js (easter egg terminal)
│   └── contact.js (formulario + validación)
├── assets/
│   ├── sounds/ (8-bit SFX, copyright-free)
│   ├── sprites/ (pequeños PNG píxelados)
│   └── fonts/ (Press Start 2P, etc. local o @import de Google)
└── data/
    └── projects.js (array de proyectos con datos placeholder)
```

### 6.3 PRIORIDADES DE IMPLEMENTACIÓN

#### Fase 1 (MVP):
- Header funcional (navegación, selector de tema)
- Hero landing
- Ficha de entrenador (estática, sin animación typewriter aún)
- PC de almacenamiento básica (cajas, grilla, selección de proyecto)
- Modal de detalles de proyecto (3 secciones visibles)
- Sección de contacto (ambos paneles)
- Responsive layout

#### Fase 2 (Polish):
- Animaciones typewriter (ficha + descripciones)
- Efectos sonoros retro (con control mute)
- Transiciones de caja (fade/slide)
- Easter egg terminal funcional
- Código Konami para tema alternativo
- LocalStorage para persistir tema + mute
- Validación de formulario de contacto

#### Fase 3 (Futuro/Opcional):
- Backend para email (envío de formulario contacto)
- Migración a React/Vue si se requiere complejidad
- Integración con CMS (cambio dinámico de datos placeholder)
- Sección blog/mochila (notas técnicas)
- Estadísticas de visitas (Google Analytics)
- Descargar CV en PDF

---

## 7. CONSIDERACIONES TÉCNICAS CLAVE

- **TIPOGRAFÍA PÍXELADA:** Press Start 2P es efectiva para títulos pero difícil de leer en cuerpos largos. Combina con Inter/Roboto para párrafos.
- **CONTRASTE:** Verifica ratios WCAG AA (#E6EDF3 sobre #0D1117). Los efectos de píxeles no deben comprometer legibilidad.
- **PERFORMANCE:** Lazy-load imágenes de proyectos. Minimiza animaciones en mobile. Test con Lighthouse.
- **SONIDOS:** Todos copyright-free (Freesound, OpenGameArt). Formato MP3 o WAV comprimido. Mute por defecto respeta UX.
- **DATOS PLACEHOLDER:** Mantén estructura JSON/array para fácil reemplazo futuro. Evita hardcoding de valores en HTML si es posible.
- **SEO:** Usa tags semánticos HTML (header, section, article). Meta tags básicos. No es crítico aún (target es devs/freelance, no Google).

---

## 8. CHECKLIST DE ENTREGA

- ☐ Toda la web funciona sin errores en consola
- ☐ Responsive en 375px (mobile), 768px (tablet), 1024px+ (desktop)
- ☐ Todos los links internos navegan correctamente
- ☐ Botones mute/unmute funciona, guarda estado en LocalStorage
- ☐ Selector de tema cambia colores correctamente
- ☐ Animaciones typewriter funcionan (pueden saltarse)
- ☐ PC de almacenamiento: cambio de cajas smooth, selección de proyecto abre modal
- ☐ Modal de proyecto: 3 secciones visibles, botones de demo/GitHub funcionan
- ☐ Formulario de contacto valida campos, botón enviar funciona (backend TBD)
- ☐ Terminal easter egg abierta con 'T', comandos responden
- ☐ Código Konami funciona (↑ ↑ ↓ ↓ ← → ← → B A)
- ☐ Código limpio, comentado, sin console.log() de debug
- ☐ Archivo README.md con instrucciones de uso/edición

---

## 9. NOTAS FINALES

→ **FLEXIBILIDAD:** Este prompt es una guía. Siéntete libre de proponer mejoras o ajustes que mejoren UX/diseño.

→ **ITERATIVO:** Esto es v1. Después de generar, se iterará para refinar contenido, agregar datos reales, y posiblemente migrar a React.

→ **PLACEHOLDER CLARAMENTE MARCADO:** Todos los datos de ejemplo están entre corchetes `[]`. Cuando reemplaces, mantén la estructura pero sustituye los valores.

→ **CREDIBILIDAD PARA DEVS & FREELANCE:** La estética es memorable, pero la claridad de información es clave. Devs evaluarán código/arquitectura; clientes evaluarán resultados.

---

d