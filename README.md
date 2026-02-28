<p align="center">
  <img src="docs/assets/green-node-logo.png" width="320" alt="GREEN NODE logo" />
</p>

<h3 align="center">Reciclaje inteligente para Cochabamba 🌿</h3>
<p align="center">Conecta hogares y comercios con recolectores verificados de material reciclable.</p>

---

## ¿Qué es GREEN NODE?

GREEN NODE resuelve dos problemas reales en Cochabamba:

1. **Confusión sobre qué se recicla** — muchas personas no saben cómo clasificar residuos ni dónde llevarlos.
2. **Coordinación desorganizada de recojos** — no existe un canal simple para conectar a quien genera residuos con quien los recolecta.

La app conecta **generadores** (hogares/comercios) con **recolectores verificados**, usando un flujo guiado, asistencia de IA, y un sistema de confianza con PIN + evidencia.

---

## ¿Cómo funciona?

### 🌿 Usuario (genera residuos)

- Toma fotos del material → la IA lo clasifica (material, categoría, confianza, tips)
- Crea un pedido de recojo: elige material, cantidad, horario, incentivo (efectivo o puntos)
- La app sugiere recolectores verificados ordenados por compatibilidad, rating y tarifas
- Sigue el caso en tiempo real: Pendiente → Aceptado → En camino → Completado
- Muestra un **PIN de 4 dígitos** al recolector para cerrar el caso de forma segura
- Gana puntos y canjea recompensas (recargas, cupones, productos eco)

### 🚛 Recolector (recoge material)

- Se registra con tipo (Independiente / Empresa), materiales, tarifas y horarios
- Recibe solicitudes con fotos, materiales, kg estimado y dirección
- Acepta, genera ruta, ingresa PIN del usuario al llegar
- Sube foto de evidencia y califica al usuario

### 🔒 Confianza y seguridad

- **Dirección protegida** hasta que un recolector verificado acepta el caso
- **PIN de 4 dígitos** para confirmar entrega (evita fraude)
- **Foto de evidencia** al completar (trazabilidad)
- **Sistema de reputación** — niveles Bronce → Plata → Oro

---

## Features

- ✅ Clasificación de residuos por IA (5 categorías + 15 materiales)
- ✅ Wizard de creación de caso (manual o guiado por IA)
- ✅ Matching de recolectores con scoring automático
- ✅ Seguimiento de casos en tiempo real
- ✅ Sistema de puntos y recompensas canjeables
- ✅ Mapa de centros de acopio de Cochabamba
- ✅ Onboarding de recolector con verificación
- ✅ 3 modos de operación: DEMO / FULL REPLIT / REAL
- ✅ Backend completo con API REST, auth JWT, uploads
- ✅ Provider factory para auth, storage, AI (extensible)

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 |
| UI | shadcn/ui · Lucide Icons · Sonner (toasts) |
| Backend | Node.js · Express 5 · tsx |
| DB | SQLite (better-sqlite3) — preparado para Postgres |
| Auth | JWT (jsonwebtoken) — preparado para Replit Auth |
| Uploads | multer + filesystem — preparado para Replit Object Storage |
| IA | Mock provider funcional — stubs para OpenAI / Azure OpenAI |

---

## Correr localmente (dev)

```bash
# Instalar dependencias
npm install

# Iniciar frontend + backend concurrentes
npm run dev
```

Esto levanta:
- **Vite** (frontend dev server) con hot reload
- **Express** (API backend) con proxy automático desde Vite

Abrir la URL que muestre la terminal (generalmente `http://localhost:5000`).

---

## Ejecución tipo producción

```bash
# Generar build de frontend
npm run build

# Iniciar servidor full-stack (API + frontend en un solo puerto)
npm run start
```

El servidor Express sirve:
- `/api/*` → rutas de la API REST
- `/uploads/*` → archivos de evidencia
- `/*` → frontend (SPA fallback a `dist/index.html`)

---

## Deploy en Replit

| Setting | Valor |
|---|---|
| **Build command** | `npm run build` |
| **Run command** | `npm run start` |
| **Port** | Automático (el server lee `$PORT`) |

### Variables de entorno (Secrets)

| Variable | Descripción |
|---|---|
| `APP_MODE` | Modo de operación: `demo`, `replit`, o `real` |
| `JWT_SECRET` | Clave secreta para tokens JWT (requerido en modo no-demo) |
| `PORT` | Asignado automáticamente por Replit |

> **Nota:** Los Secrets del Workspace NO se copian automáticamente al Published App / Deployment. Deben duplicarse manualmente en la configuración del deploy.

---

## Estructura del proyecto

```
├── src/                    # Frontend React
│   ├── app/pages/          # Pantallas (21 screens)
│   ├── app/components/     # Componentes reutilizables
│   ├── context/            # Estado global (AppContext)
│   └── lib/                # API client
├── server/                 # Backend Express
│   ├── routes/             # Endpoints API
│   ├── providers/          # Auth, Storage, AI (factory pattern)
│   ├── db/                 # Schema SQLite, seed, reset
│   └── middleware/         # Auth JWT, logging, errors
├── docs/                   # Documentación técnica
├── dist/                   # Build de producción (generado)
└── uploads/                # Evidencia de recojos (generado)
```

---

## Modos de operación

| Modo | Backend | DB | IA | Para qué |
|---|---|---|---|---|
| **DEMO** | Opcional (funciona sin él) | Mock local | Mock | Probar la UI sin infraestructura |
| **FULL REPLIT** | Requerido | SQLite real | Mock | Flujo completo con persistencia |
| **REAL** | Requerido | Postgres/Supabase | OpenAI/Azure | Producción real (stubs preparados) |

---

## Roadmap

- 🔜 Integración con **Replit Object Storage** para uploads/evidencia
- 🔜 Integración con **Replit Auth** (headers `X-Replit-User-*`)
- 🔜 Provider de IA real (Azure OpenAI / Gemini) con costo mínimo
- 🔜 Migración de DB a **Postgres** (Replit Database o Supabase) para escala
- 🔜 Tests automatizados (smoke + E2E)
- 🔜 PWA + notificaciones push

---

## Contribuir

GREEN NODE es un proyecto de impacto social para Cochabamba. Si quieres contribuir:

1. Revisa los [docs/](docs/) para entender la arquitectura
2. Los cambios deben ser **aditivos y mínimos** — no refactors grandes
3. Mantén compatibilidad con los 3 modos (DEMO / REPLIT / REAL)
4. Prueba que `npm run build` pase antes de hacer PR

---

<p align="center">
  Hecho con 💚 para Cochabamba, Bolivia
</p>
