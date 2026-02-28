# GREEN NODE - Project Overview

Full-stack recycling platform connecting waste generators with verified collectors in Cochabamba, Bolivia.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **UI Components**: Radix UI primitives, MUI, shadcn/ui-style components
- **Routing**: React Router 7
- **State**: AppContext (React Context) with API integration
- **Notifications**: Sonner (toast)
- **Charts**: Recharts
- **Animation**: Motion (Framer Motion)

### Backend
- **Runtime**: Node.js with tsx
- **Framework**: Express 5
- **Database**: SQLite via better-sqlite3
- **Auth**: JWT (jsonwebtoken)
- **Uploads**: Multer (local storage)
- **Logging**: Morgan

## Project Structure

```
src/                        # Frontend React
  app/
    App.tsx                 # Root component with ErrorBoundary + Toaster
    components/             # UI components (UI.tsx, ErrorBoundary.tsx)
    layouts/MobileLayout.tsx
    pages/user/             # 12 user pages
    pages/collector/        # 7 collector pages
    pages/LandingPage.tsx   # Entry with role selection + demo login
    routes.ts               # React Router config
  context/AppContext.tsx     # Global state + API calls
  lib/api.ts                # Fetch wrapper for /api endpoints
  data/mockData.ts          # Types + mock data (fallback)
  styles/                   # CSS files

server/                     # Backend Express
  index.ts                  # Server entry (port 3001)
  config.ts                 # Env var config (APP_MODE, providers)
  db/
    index.ts                # SQLite init + getDb()
    seed.ts                 # Seed data matching mockData.ts
    provider.ts             # DBProvider interface (future Cosmos)
  providers/
    index.ts                # Provider factory
    storage/                # local.ts, azure.ts (stub)
    ai/                     # mock.ts, azure.ts (stub)
    auth/                   # demo.ts (JWT), azure.ts (Entra stub)
  routes/                   # health, auth, cases, collectors, rewards, centers, ai
  middleware/               # logger (morgan), errorHandler

docs/                       # Documentation
  architecture.md, data-model.md, api-reference.md, microsoft-integration.md
```

## Development

- `npm run dev` - Starts frontend (0.0.0.0:5000) + backend (localhost:3001) concurrently
- `npm run build` - Vite production build to dist/
- Vite proxies /api and /uploads to backend on port 3001

## Configuration

- Frontend: port 5000, host 0.0.0.0, allowedHosts: true
- Backend: port 3001, localhost
- Deployment: static site from dist/
- Database: ./data/green-node.sqlite (auto-created + seeded)
- Uploads: ./uploads/ (auto-created)

## App Modes (DEMO / FULL REPLIT / REAL)

Three runtime modes selectable from the Landing Page or via `APP_MODE` env var:

- **DEMO** (default): No credentials needed. Mock data, mock AI, simple JWT auth. Frontend falls back to mock data if backend unavailable.
- **FULL REPLIT**: Requires backend running. SQLite/PostgreSQL DB, persistent data, retry with backoff on startup. No mock fallback.
- **REAL**: External providers (Supabase for DB/Auth/Storage, external AI). Redirects to Launch Checklist (`/launch-checklist`) if env vars are missing.

Mode selection priority: localStorage > VITE_APP_MODE env var > default (demo).
When switching modes on the Landing Page, selecting a different mode + clicking a role button triggers a full page reload to re-initialize AppContext with the new mode.

Individual provider overrides: STORAGE_PROVIDER, AI_PROVIDER, AUTH_MODE, DB_TYPE.
See docs/modes.md for full details, docs/replit-setup.md for Replit config, docs/real-launch-supabase.md for Supabase setup.

## DB Scripts

- `npm run db:seed` — Seeds the SQLite database with demo data (idempotent)
- `npm run db:reset` — Deletes DB file and re-seeds from scratch

## Provider Architecture

Provider factory (`server/providers/index.ts`) selects providers based on mode:
- **Storage**: local (DEMO/REPLIT), replit (stub), supabase (stub)
- **AI**: mock (DEMO/REPLIT), external (stub for REAL)
- **Auth**: demo JWT (DEMO), replit (stub), supabase (stub)
- **DB**: SQLite (DEMO/REPLIT default), postgres (stub), supabase (stub)
