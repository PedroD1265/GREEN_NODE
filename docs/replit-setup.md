# Configuracion en Replit - GREEN NODE

Guia para configurar GREEN NODE en modo FULL REPLIT con base de datos, almacenamiento y autenticacion.

## Modo FULL REPLIT

El modo FULL REPLIT esta disenado para desarrollo y despliegue en Replit con backend completo y datos persistentes.

### Activar

Opcion A — Variable de entorno:
```bash
APP_MODE=replit
```

Opcion B — Desde la Landing Page, seleccionar el boton "FULL REPLIT".

## Base de Datos

### SQLite (default)

Por defecto, GREEN NODE usa SQLite via `better-sqlite3`:

- Archivo: `./data/green-node.sqlite`
- Se crea automaticamente al iniciar
- Datos seed se insertan en el primer arranque
- Configurable via `DB_PATH`

### PostgreSQL (opcional)

Si tienes acceso a una base de datos PostgreSQL (por ejemplo, Replit PostgreSQL):

1. Configurar la variable `DATABASE_URL`:
   ```bash
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

2. El `PostgresDBProvider` detecta `DATABASE_URL` automaticamente
3. Actualmente hace fallback a SQLite (implementacion PostgreSQL pendiente)

### Scripts de Base de Datos

| Comando | Descripcion |
|---------|-------------|
| `npm run db:seed` | Ejecuta el seed de datos (idempotente) |
| `npm run db:reset` | Elimina la DB y re-ejecuta el seed |

## Almacenamiento

### Local (default)

- Archivos de evidencia se guardan en `./uploads/`
- Servidos estaticamente por Express
- Configurable via `UPLOADS_DIR`

### Replit Object Storage (futuro)

Para despliegues en produccion en Replit:

1. Instalar `@replit/object-storage`
2. Implementar los metodos en `server/providers/storage/replit.ts`
3. El provider ya tiene la estructura preparada

## Autenticacion

### JWT (default)

- Login por rol: usuario, recolector, admin
- Tokens JWT con expiracion de 24 horas
- Secreto configurable via `JWT_SECRET`

### Replit Auth (futuro)

Para usar autenticacion nativa de Replit:

1. La autenticacion de Replit envia headers:
   - `X-Replit-User-Id`
   - `X-Replit-User-Name`
   - `X-Replit-User-Roles`
2. Implementar la validacion en `server/providers/auth/replit.ts`
3. El provider ya tiene la estructura preparada

## Variables de Entorno

| Variable | Default | Descripcion |
|----------|---------|-------------|
| `APP_MODE` | `demo` | Modo de la app (`demo`, `replit`, `real`) |
| `DATABASE_URL` | — | URL de PostgreSQL (opcional) |
| `DB_PATH` | `./data/green-node.sqlite` | Ruta del archivo SQLite |
| `UPLOADS_DIR` | `./uploads` | Directorio de archivos subidos |
| `JWT_SECRET` | (demo default) | Secreto para firmar tokens |
| `API_PORT` | `3001` | Puerto del servidor backend |

## Diferencias con Modo DEMO

| Aspecto | DEMO | FULL REPLIT |
|---------|------|-------------|
| Backend requerido | No (fallback a mock) | Si (retry con backoff) |
| Datos persistentes | No (mock en memoria) | Si (SQLite/PostgreSQL) |
| UI durante startup | Nada | "Backend starting..." spinner |
| Error si backend falla | Silencioso | Visible al usuario |
| Fallback a mock | Si | No |

## Verificacion

1. Iniciar la app: `npm run dev`
2. Seleccionar "FULL REPLIT" en la Landing Page
3. Verificar que el badge "FULL REPLIT" aparece en el header
4. El backend debe responder en `GET /api/health`:
   ```json
   {
     "status": "ok",
     "mode": "replit",
     "providers": {
       "storage": "replit",
       "ai": "mock",
       "auth": "replit"
     }
   }
   ```
5. Login y operaciones CRUD deben funcionar contra la DB

## Troubleshooting

**"Backend starting..." no desaparece:**
- Verificar que el servidor Express esta corriendo en el puerto 3001
- Revisar logs del servidor por errores de inicializacion
- El frontend hace retry con backoff exponencial (hasta ~30 segundos)

**Error al conectar a PostgreSQL:**
- Verificar que `DATABASE_URL` es correcta
- El sistema hace fallback a SQLite si PostgreSQL no esta disponible

**Datos no persisten entre reinicios:**
- En modo DEMO, los datos son mock en memoria
- Cambiar a FULL REPLIT para usar datos persistentes en SQLite
