# GREEN NODE

Plataforma de reciclaje que conecta generadores de residuos con recolectores verificados en Cochabamba, Bolivia.

## Quick Start

```bash
npm install
npm run dev
```

Abre el navegador en `http://localhost:5000`

## Modos de Operacion

### Modo DEMO (default)
Todo funciona sin credenciales externas. Datos seed, IA mock, auth por rol.

### Modo REAL
Conecta a Microsoft Azure. Requiere variables de entorno:
```
APP_MODE=real
STORAGE_PROVIDER=azure
AI_PROVIDER=azure
AUTH_MODE=real
```
Ver `docs/microsoft-integration.md` para configuracion completa.

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia frontend (5000) + backend (3001) |
| `npm run build` | Build de produccion del frontend |
| `npm run dev:frontend` | Solo frontend |
| `npm run dev:backend` | Solo backend |

## Arquitectura

```
Frontend: React + TypeScript + Vite + Tailwind + React Router
Backend:  Express + SQLite (better-sqlite3)
Providers: Storage, AI, Auth (demo/real swappable)
```

Ver `docs/architecture.md` para detalles.

## Estructura del Proyecto

```
src/                    # Frontend React
  app/pages/            # Paginas por rol (user/, collector/)
  app/components/       # Componentes UI
  context/              # AppContext (estado global)
  lib/api.ts            # Cliente API
  data/mockData.ts      # Datos mock + tipos

server/                 # Backend Express
  db/                   # SQLite (init, seed, provider)
  providers/            # Storage, AI, Auth
  routes/               # Endpoints API
  middleware/            # Logger, error handler

docs/                   # Documentacion
  architecture.md       # Arquitectura demo/real
  data-model.md         # Modelo de datos
  api-reference.md      # Referencia API
  microsoft-integration.md  # Guia Microsoft Azure
```

## Smoke Test - Usuario (10 pasos)

1. Abrir la app y ver Landing Page con "MODO DEMO"
2. Click "Entrar como Usuario" - Dashboard con puntos (1250)
3. Navegar a "Mis Casos" - Ver casos existentes (seeded)
4. Click en un caso - Ver seguimiento con timeline y PIN
5. Ir a "Crear Pedido Manual" - Seleccionar PET
6. Completar los 5 pasos - Enviar solicitud
7. Ver el nuevo caso creado en "Mis Casos"
8. Ir a "Recompensas" - Ver catalogo y puntos
9. Canjear "Recarga movil Bs 10" (100 pts) - Toast de confirmacion
10. Verificar que los puntos se descontaron

## Smoke Test - Recolector (10 pasos)

1. Volver al Landing - Click "Entrar como Recolector"
2. Completar onboarding de EcoCocha
3. Ver Dashboard del recolector - Solicitudes pendientes
4. Ir a "Solicitudes" - Ver lista de casos
5. Click en una solicitud pendiente - Ver detalle
6. Click "Aceptar recojo" - Status cambia a "Aceptado"
7. Click "Iniciar ruta" - Ver mapa de ruta
8. Ir a confirmacion - Ingresar PIN de 4 digitos
9. Completar caso - Calificar al usuario
10. Volver al Dashboard - Verificar actualizacion

## Known Limitations

- Azure providers tienen implementaciones stub (marcadas con TODO)
- OAuth real no implementado en Replit (usar demo auth)
- Mapa es mock (no integracion real con mapas)
- Fotos de camara son simuladas en la interfaz
- Sin WebSocket para actualizaciones en tiempo real
- Base de datos SQLite (no apta para produccion multi-servidor)

## Documentacion

- [Arquitectura](docs/architecture.md)
- [Modelo de Datos](docs/data-model.md)
- [Referencia API](docs/api-reference.md)
- [Integracion Microsoft](docs/microsoft-integration.md)
