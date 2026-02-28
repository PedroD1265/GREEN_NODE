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

## Dev Mode (npm run dev)

In development, `npm run dev` runs Vite (port 5000) and Express (port 3001) concurrently. Vite proxies `/api` and `/uploads` to Express. This is separate from the production setup above.
