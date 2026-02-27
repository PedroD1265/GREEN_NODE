# Project Overview

This is a React + TypeScript + Vite frontend application with a rich UI component library setup.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **UI Components**: Radix UI primitives, MUI (Material UI), shadcn/ui-style components
- **Routing**: React Router 7
- **Charts**: Recharts
- **Animation**: Motion (Framer Motion)
- **Drag & Drop**: React DnD
- **Forms**: React Hook Form

## Project Structure

```
src/
  app/
    App.tsx          - Root application component
    components/      - App-level components
    layouts/         - Page layout components
    pages/           - Route pages
    routes.ts        - Route definitions
  components/
    layout/          - Shared layout components
  context/
    AppContext.tsx   - Global app context
  data/
    mockData.ts      - Mock/static data
  styles/            - Global CSS files
  main.tsx           - Entry point
  index.css          - Root styles
index.html           - HTML entry point
vite.config.ts       - Vite configuration
```

## Development

- Run: `npm run dev` (serves on 0.0.0.0:5000)
- Build: `npm run build`

## Replit Configuration

- Frontend served on port 5000 with `host: '0.0.0.0'` and `allowedHosts: true`
- Deployment: static site, build with `npm run build`, serve from `dist/`
