# Lanzamiento en Modo REAL con Supabase

Guia paso a paso para configurar GREEN NODE en modo REAL usando Supabase como proveedor de base de datos, autenticacion y almacenamiento.

## Prerequisitos

- Cuenta en [supabase.com](https://supabase.com)
- GREEN NODE funcionando en modo DEMO
- Acceso a configurar variables de entorno (Replit Secrets o `.env`)

## Paso 1: Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear una cuenta
2. Click en "New Project"
3. Seleccionar organizacion y region
4. Anotar la contrasena de la base de datos
5. Esperar a que el proyecto se inicialice

## Paso 2: Obtener Credenciales

En el dashboard de Supabase, ir a **Settings > API**:

| Credencial | Donde encontrarla |
|------------|-------------------|
| URL del proyecto | `Settings > API > Project URL` |
| Anon Key (publica) | `Settings > API > Project API Keys > anon public` |
| Service Role Key | `Settings > API > Project API Keys > service_role` |

## Paso 3: Crear Bucket de Storage

1. Ir a **Storage** en el menu lateral
2. Click en "New bucket"
3. Nombre: `evidence`
4. Configurar como privado (las URLs se generan con firma)
5. Opcionalmente configurar politicas de acceso

## Paso 4: Configurar Variables de Entorno

Configurar las siguientes variables en Replit Secrets (o archivo `.env`):

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_BUCKET=evidence
```

## Paso 5: Configurar Proveedor de IA (Opcional)

Si deseas clasificacion de residuos con IA real:

```bash
EXTERNAL_AI_API_KEY=tu-api-key
EXTERNAL_AI_ENDPOINT=https://api.openai.com/v1/chat/completions
```

Si no configuras la IA, el sistema usara respuestas mock.

## Paso 6: Activar Modo REAL

Opcion A — Variable de entorno:
```bash
APP_MODE=real
```

Opcion B — Desde la app:
1. Abrir la Landing Page
2. Seleccionar el boton "REAL"
3. La seleccion se guarda en localStorage

## Paso 7: Verificar Configuracion

1. Abrir la app en modo REAL
2. Si faltan variables, se mostrara la pagina **Launch Checklist**
3. La checklist indica que variables faltan y cuales estan configuradas
4. Tambien puedes verificar via API:

```bash
curl http://localhost:3001/api/health/config?mode=real
```

Respuesta esperada cuando todo esta configurado:
```json
{
  "mode": "real",
  "database": { "type": "supabase", "status": "ready" },
  "storage": { "type": "supabase", "status": "ready" },
  "auth": { "type": "supabase", "status": "ready" },
  "ai": { "type": "external", "status": "ready" },
  "missingEnvVars": []
}
```

## Checklist Rapido

- [ ] Proyecto creado en Supabase
- [ ] `SUPABASE_URL` configurada
- [ ] `SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] `SUPABASE_BUCKET` configurada (bucket `evidence` creado)
- [ ] `EXTERNAL_AI_API_KEY` configurada (opcional)
- [ ] `EXTERNAL_AI_ENDPOINT` configurada (opcional)
- [ ] `APP_MODE=real` activado
- [ ] `/api/health/config` muestra todo en `ready`

## Variables de Entorno Completas

| Variable | Requerida | Descripcion | Ejemplo |
|----------|-----------|-------------|---------|
| `SUPABASE_URL` | Si | URL del proyecto | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Si | Clave publica | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Si | Clave de servicio | `eyJhbGci...` |
| `SUPABASE_BUCKET` | Si | Bucket de Storage | `evidence` |
| `EXTERNAL_AI_API_KEY` | Opcional | API Key de IA | `sk-...` |
| `EXTERNAL_AI_ENDPOINT` | Opcional | URL del endpoint | `https://api.openai.com/v1/...` |
| `APP_MODE` | Opcional | Modo de la app | `real` |
| `JWT_SECRET` | Recomendado | Secreto para tokens | (cadena segura) |

## Estado Actual de los Providers

Los providers de Supabase son actualmente **stubs** (esqueletos funcionales):

- `SupabaseDBProvider` — Valida config, lanza error 501 en operaciones
- `SupabaseAuthProvider` — Valida config, lanza error 501 en login/verify
- `SupabaseStorageProvider` — Valida config, lanza error 501 en upload

Para implementarlos completamente, instalar `@supabase/supabase-js` y completar los metodos en:
- `server/providers/db/supabase.ts`
- `server/providers/auth/supabase.ts`
- `server/providers/storage/supabase.ts`

## Troubleshooting

**La app muestra Launch Checklist:**
- Verifica que todas las variables de entorno estan configuradas correctamente
- Usa `GET /api/health/config?mode=real` para ver que falta

**Error 503 en las APIs:**
- El provider no tiene las credenciales necesarias
- Revisa los logs del servidor para mensajes `[Supabase*] Missing config`

**Error 501 en las APIs:**
- El provider esta configurado pero la implementacion no esta completa
- Los stubs necesitan ser implementados con `@supabase/supabase-js`
