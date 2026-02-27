# Architecture - GREEN NODE

## Overview

GREEN NODE is a full-stack web application that connects waste generators with verified collectors in Cochabamba, Bolivia. It features a dual-mode architecture (DEMO/REAL) with swappable providers.

## System Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │  Pages   │ │Components│ │    AppContext         │ │
│  │  /user/* │ │  UI.tsx   │ │  (state + API calls) │ │
│  │  /col/*  │ │  ErrorB.  │ │                      │ │
│  └──────────┘ └──────────┘ └──────────┬───────────┘ │
│                                       │              │
│  ┌────────────────────────────────────┘              │
│  │  src/lib/api.ts (fetch wrapper)                   │
│  └───────────┬────────────────────────────────────── │
└──────────────┼───────────────────────────────────────┘
               │  /api/* (Vite proxy → localhost:3001)
               ▼
┌─────────────────────────────────────────────────────┐
│                   Backend (Express)                  │
│  ┌──────────────────────────────────────────┐       │
│  │  Routes: /api/health, /api/auth/*,       │       │
│  │  /api/cases/*, /api/collectors/*,        │       │
│  │  /api/rewards/*, /api/centers/*,         │       │
│  │  /api/ai/*                               │       │
│  └──────────────────┬───────────────────────┘       │
│                     │                                │
│  ┌──────────────────▼───────────────────────┐       │
│  │  Providers (configurable via env vars)    │       │
│  │  ┌─────────┐ ┌────────┐ ┌──────────┐    │       │
│  │  │ Storage │ │   AI   │ │   Auth   │    │       │
│  │  │ local/  │ │ mock/  │ │ demo/    │    │       │
│  │  │ azure   │ │ azure  │ │ azure    │    │       │
│  │  └─────────┘ └────────┘ └──────────┘    │       │
│  └──────────────────────────────────────────┘       │
│                     │                                │
│  ┌──────────────────▼───────────────────────┐       │
│  │  Database (SQLite via better-sqlite3)     │       │
│  │  ./data/green-node.sqlite                 │       │
│  │  Auto-init + seed on first run            │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

## Demo vs Real Mode

### APP_MODE=demo (default)
- Storage: Files saved to local `./uploads/` directory
- AI: Deterministic mock responses for waste classification
- Auth: Role-based login (user/collector/admin) with simple JWT
- DB: SQLite with auto-seeded demo data
- No external credentials needed

### APP_MODE=real
- Storage: Azure Blob Storage (requires AZURE_STORAGE_* env vars)
- AI: Azure OpenAI GPT-4 Vision (requires AZURE_OPENAI_* env vars)
- Auth: Microsoft Entra External ID (requires AUTH_* env vars)
- DB: Same SQLite (upgradeable to Cosmos DB via DBProvider interface)
- All providers fail gracefully with clear error messages if config is missing

## Provider Architecture

Each provider follows an interface/implementation pattern:

```
server/providers/
├── index.ts              # Factory: creates providers based on config
├── storage/
│   ├── interface.ts      # StorageProvider interface
│   ├── local.ts          # LocalStorageProvider (multer → ./uploads)
│   └── azure.ts          # AzureBlobStorageProvider (stub)
├── ai/
│   ├── interface.ts      # AIProvider interface
│   ├── mock.ts           # AIMockProvider (deterministic)
│   └── azure.ts          # AzureAIProvider (stub)
└── auth/
    ├── interface.ts      # AuthProvider interface
    ├── demo.ts           # DemoAuthProvider (JWT)
    └── azure.ts          # AzureAuthProvider (Entra stub)
```

## Configuration

All configuration is via environment variables (see `server/config.ts`):

| Variable | Default | Description |
|----------|---------|-------------|
| APP_MODE | demo | `demo` or `real` |
| STORAGE_PROVIDER | local | `local` or `azure` |
| AI_PROVIDER | mock | `mock` or `azure` |
| AUTH_MODE | demo | `demo` or `real` |
| API_PORT | 3001 | Backend server port |
| DB_PATH | ./data/green-node.sqlite | SQLite database path |
| JWT_SECRET | (demo default) | JWT signing secret |

## Frontend Architecture

- **React 18** with TypeScript
- **React Router 7** for SPA routing
- **Tailwind CSS 4** for styling
- **AppContext** for global state management
- **src/lib/api.ts** for all backend communication
- **Sonner** for toast notifications
- **ErrorBoundary** component for graceful error handling

The frontend maintains local state fallbacks - if the API is unreachable, it gracefully degrades to using mock data from `src/data/mockData.ts`.
