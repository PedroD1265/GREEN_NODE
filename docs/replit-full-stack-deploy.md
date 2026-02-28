# GREEN NODE — Replit Full-Stack Deploy Guide

## Quick Start

```bash
# Build frontend
npm run build

# Start full-stack server (serves API + frontend on one port)
npm run start
```

## How It Works

`npm run start` starts a single Express server that:
- Serves the REST API at `/api/*`
- Serves uploaded evidence files at `/uploads/*`
- Serves the Vite-built frontend from `dist/`
- SPA fallback: any route not matching `/api` or `/uploads` returns `dist/index.html`

## Port Configuration

The server reads port in this order:
1. `process.env.PORT` (Replit assigns this dynamically in Published/Deployed mode)
2. `process.env.API_PORT` (for dev, if you want a custom port)
3. `3001` (default fallback)

## Required Secrets

| Secret | Required? | Description |
|---|---|---|
| `APP_MODE` | Recommended | Set to `replit` for FULL REPLIT mode. Default: `demo` |
| `JWT_SECRET` | Required in non-demo | Random string, 32+ chars. Generate: `openssl rand -hex 32` |

> **IMPORTANT:** Workspace Secrets are NOT automatically copied to Published App / Deployment Secrets. You must duplicate them manually in the Published App settings.

## Replit Publishing Settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Run command | `npm run start` |
| Port | Leave default (server auto-detects `$PORT`) |

## Object Storage (evidence uploads)

When `REPLIT_STORAGE_BUCKET` is set in Secrets (e.g. `evidence`), the server automatically stores uploaded evidence files in Replit App Storage instead of the local filesystem.

| Secret | Description |
|---|---|
| `REPLIT_STORAGE_BUCKET` | Bucket name created in Replit App Storage (e.g. `evidence`) |

**How it works:**
- Upload: `POST /api/cases/:id/evidence` → multer receives file → stored in Object Storage under key `evidence/<caseId>/<timestamp>-<kind>.<ext>`.
- Serve: `GET /uploads/evidence/<caseId>/...` → server fetches from Object Storage and streams to browser.
- Fallback: If Object Storage is not configured or fails, files are stored/served from `./uploads/` (local filesystem).

**Local dev:** Leave `REPLIT_STORAGE_BUCKET` unset — uses `./uploads/` directory automatically.

## Evidence Upload — Verification Checklist

1. **Login** as any user (FULL REPLIT mode)
2. **Create or open a case** → advance to "Completado" status
3. On the rating screen, click **"Subir foto evidencia"** → select an image
4. Verify **toast** shows "Evidencia subida correctamente"
5. Verify **thumbnail** appears with green border and filename
6. Open **Network tab** → check `POST /api/cases/<id>/evidence` → 200 OK
7. Check **Replit App Storage** panel → bucket `evidence` → object `evidence/<caseId>/...` exists
8. Copy the returned URL path → open in browser (`/uploads/evidence/...`) → image loads

Repeat for **collector side**: login as collector → Confirmar recojo → "Subir foto evidencia"

## Dev Mode (npm run dev)

In development, `npm run dev` runs Vite (port 5000) and Express (port 3001) concurrently. Vite proxies `/api` and `/uploads` to Express. This is separate from the production setup above.
