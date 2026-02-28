# Modos de Operacion - GREEN NODE

GREEN NODE soporta tres modos de operacion, seleccionables desde la Landing Page o via variable de entorno.

## Resumen

| Caracteristica | DEMO | FULL REPLIT | REAL |
|----------------|------|-------------|------|
| Base de datos | SQLite local | SQLite / PostgreSQL | Supabase |
| Almacenamiento | `./uploads/` local | `./uploads/` (Replit Object Storage futuro) | Supabase Storage |
| Autenticacion | JWT demo (por rol) | JWT demo (Replit Auth futuro) | Supabase Auth |
| IA | Mock determinista | Mock determinista | Proveedor externo |
| Credenciales externas | Ninguna | Ninguna (opcional DATABASE_URL) | Obligatorias |
| Datos | Seed automatico | Seed automatico + persistentes | Produccion |

## DEMO (default)

**Ideal para:** explorar la app sin configuracion.

- Todo funciona sin credenciales externas
- Datos seed pre-cargados (usuarios, recolectores, casos, recompensas, centros)
- IA devuelve respuestas deterministas para clasificacion de residuos
- Autenticacion simplificada: selecciona un rol (usuario/recolector/admin) y entra
- Archivos de evidencia se guardan en `./uploads/` local
- Si el backend no esta disponible, el frontend usa datos mock como fallback

**Variables de entorno:** ninguna requerida.

**Seleccion:**
- Landing Page: click en boton "DEMO"
- Variable: `APP_MODE=demo` (o `VITE_APP_MODE=demo` para frontend)
- localStorage: `app_mode = demo`

## FULL REPLIT

**Ideal para:** desarrollo en Replit con backend completo y datos persistentes.

- Requiere que el backend Express este corriendo y accesible
- Base de datos SQLite por defecto, opcionalmente PostgreSQL si `DATABASE_URL` esta configurado
- Retry con backoff exponencial durante el startup del backend
- Muestra estado "Backend starting..." mientras conecta
- No hay fallback a datos mock: si el backend no responde, muestra error
- Almacenamiento local en `./uploads/` (migrable a Replit Object Storage)
- Autenticacion JWT (migrable a Replit Auth nativo)

**Variables de entorno:**

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `DATABASE_URL` | Opcional | URL de PostgreSQL (si no existe, usa SQLite) |
| `DB_PATH` | Opcional | Ruta del archivo SQLite (default: `./data/green-node.sqlite`) |

**Seleccion:**
- Landing Page: click en boton "FULL REPLIT"
- Variable: `APP_MODE=replit`
- localStorage: `app_mode = replit`

## REAL

**Ideal para:** produccion con proveedores externos.

- Requiere Supabase configurado (DB, Auth, Storage)
- Requiere proveedor de IA externo configurado
- Si faltan variables de entorno, muestra la pagina Launch Checklist con instrucciones
- La app permanece navegable en modo lectura hasta que se configure todo
- Todos los providers validan su configuracion al iniciar y reportan errores claros

**Variables de entorno:**

| Variable | Requerida | Descripcion |
|----------|-----------|-------------|
| `SUPABASE_URL` | Si | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Si | Clave publica (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Si | Clave de servicio (solo servidor) |
| `SUPABASE_BUCKET` | Si | Nombre del bucket de Storage (ej: `evidence`) |
| `EXTERNAL_AI_API_KEY` | Si | API Key del proveedor de IA |
| `EXTERNAL_AI_ENDPOINT` | Si | URL del endpoint de IA |

**Seleccion:**
- Landing Page: click en boton "REAL"
- Variable: `APP_MODE=real`
- localStorage: `app_mode = real`

## Cambiar de Modo

### Desde la Landing Page
1. Abrir la app
2. En la Landing Page, seleccionar uno de los tres botones de modo
3. La seleccion se guarda en localStorage
4. Entrar con el rol deseado

### Desde variables de entorno
1. Configurar `APP_MODE=demo|replit|real` en el servidor
2. Opcionalmente configurar `VITE_APP_MODE` para el frontend
3. Reiniciar la app

### Prioridad de seleccion
1. localStorage (`app_mode`) — prioridad mas alta
2. Variable de entorno `VITE_APP_MODE`
3. Default: `demo`

## Arquitectura de Providers por Modo

```
DEMO:
  DB       → SQLite (better-sqlite3)
  Storage  → LocalStorageProvider (./uploads/)
  Auth     → DemoAuthProvider (JWT simple)
  AI       → AIMockProvider (determinista)

FULL REPLIT:
  DB       → PostgresDBProvider (SQLite fallback)
  Storage  → ReplitStorageProvider (./uploads/)
  Auth     → ReplitAuthProvider (JWT)
  AI       → AIMockProvider (determinista)

REAL:
  DB       → SupabaseDBProvider
  Storage  → SupabaseStorageProvider
  Auth     → SupabaseAuthProvider
  AI       → ExternalAIProvider
```

## Verificacion de Salud

El endpoint `GET /api/health` devuelve el estado de cada provider:

```json
{
  "status": "ok",
  "mode": "demo",
  "providers": {
    "storage": "local",
    "ai": "mock",
    "auth": "demo"
  }
}
```

El endpoint `GET /api/health/config?mode=real` devuelve las capacidades y variables faltantes:

```json
{
  "mode": "real",
  "database": { "type": "supabase", "status": "not_configured" },
  "storage": { "type": "supabase", "status": "not_configured" },
  "auth": { "type": "supabase", "status": "not_configured" },
  "ai": { "type": "external", "status": "not_configured" },
  "missingEnvVars": ["SUPABASE_URL", "SUPABASE_ANON_KEY", "..."]
}
```
