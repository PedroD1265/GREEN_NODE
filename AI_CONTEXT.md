# GREEN NODE — AI Context File
<!-- This file is designed for AI assistants to quickly understand the entire codebase -->

## PROJECT IDENTITY
- **Name**: GREEN NODE
- **Type**: Mobile-first recycling app (DEMO/MVP)
- **Location**: Cochabamba, Bolivia
- **Purpose**: Connect waste generators (users) with verified collectors
- **Language**: Spanish (Bolivia)
- **Status**: Figma Make export → React/Vite prototype, patched for demo completeness

## TECH STACK
```
React 18.3 + Vite 6.3 + Tailwind CSS 4 + React Router 7
UI: shadcn/ui (40+ primitives) + custom UI.tsx components + Lucide React icons
State: React Context (AppContext.tsx) — single provider, no Redux/Zustand
Styling: Tailwind inline classes with hardcoded hex colors (GREEN NODE palette)
Font: Inter (Google Fonts, loaded in index.html)
Build: `npm run dev` (dev) / `npm run build` (production)
```

## FILE STRUCTURE
```
src/
├── app/
│   ├── App.tsx                    # Root: AppProvider + RouterProvider
│   ├── routes.ts                  # All routes (createBrowserRouter)
│   ├── layouts/
│   │   └── MobileLayout.tsx       # Status bar + Outlet + BottomNav (user/collector)
│   ├── components/
│   │   ├── UI.tsx                 # Button, Card, Badge, Chip, StatusBadge, TimelineStepper, BucketChip
│   │   ├── CameraMock.tsx
│   │   └── figma/ImageWithFallback.tsx
│   │   └── ui/                    # ~40 shadcn/ui primitives (accordion, dialog, tabs, etc.)
│   └── pages/
│       ├── LandingPage.tsx        # U0: Mode select + demo instructions
│       ├── user/
│       │   ├── UserHome.tsx       # U1: Points, level, quick actions, active case
│       │   ├── AIHub.tsx          # U2: 3 intent buttons + quick reply chips
│       │   ├── IdentifyWaste.tsx  # U3+U4: Photo guide → capture → AI result (fused)
│       │   ├── CreateCase.tsx     # U5: AI-guided wizard (6 chat steps + receipt panel)
│       │   ├── IncentiveChoice.tsx# U6: Cash vs Points selection
│       │   ├── CollectorOffers.tsx# U7: 3 collector cards with tariffs
│       │   ├── AutoAssign.tsx     # U7b: AI assigns best collector
│       │   ├── CasesList.tsx      # Case list (filter by userId)
│       │   ├── CaseStatus.tsx     # U8+U9: Timeline + PIN reveal + rating + issues + photo evidence
│       │   ├── Rewards.tsx        # U10: Points header + penalty/bonus info + 7-item catalog
│       │   ├── Centers.tsx        # U11: 3 tabs (centros, peligrosos, precios)
│       │   └── ManualCase.tsx     # U12: 5-step wizard with inline incentive + case creation
│       └── collector/
│           ├── CollectorOnboarding.tsx  # R2+R3+R4: Type select → form (ind/emp) → verify
│           ├── CollectorHome.tsx        # R1: Dashboard + auto-accept toggle
│           ├── CollectorRequests.tsx     # R5: Sortable pending requests list
│           ├── CollectorRequestDetail.tsx# R6: Photos, materials, accept/reject
│           ├── CollectorRoute.tsx        # R7+R8: Map mock + PIN input
│           ├── PickupConfirmation.tsx    # R8+R9: Confirm + rate user + report issues
│           └── CollectorProfile.tsx      # R10: Full profile + past pickups + reset demo
├── context/
│   └── AppContext.tsx              # Global state: mode, user, cases, collector, points
├── data/
│   └── mockData.ts                 # All types + seed data (materials, collectors, rewards, cases, centers)
├── styles/
│   ├── theme.css                   # CSS variables (shadcn tokens + GREEN NODE brand tokens)
│   ├── index.css
│   ├── fonts.css
│   └── tailwind.css
└── main.tsx                        # Entry point
```

## ROUTING TABLE
```
/                         → LandingPage (mode select)
/user/home                → UserHome
/user/ai                  → AIHub
/user/photos              → IdentifyWaste (fullscreen, no bottom nav)
/user/create-case         → CreateCase (fullscreen, no bottom nav)
/user/incentive           → IncentiveChoice
/user/collector-offers    → CollectorOffers
/user/auto-assign         → AutoAssign
/user/cases               → CasesList
/user/case/:id            → CaseStatus
/user/rewards             → Rewards
/user/centers             → Centers
/user/manual-case         → ManualCase
/collector/onboarding     → CollectorOnboarding (fullscreen, no bottom nav)
/collector/home           → CollectorHome
/collector/requests       → CollectorRequests
/collector/request/:id    → CollectorRequestDetail
/collector/route          → CollectorRoute
/collector/pickup/:id     → PickupConfirmation
/collector/profile        → CollectorProfile
*                         → LandingPage (fallback)
```

## STATE MANAGEMENT (AppContext.tsx)
```typescript
interface AppContextType {
  mode: 'user' | 'collector';
  setMode: (m) => void;
  userPoints: number;              // starts at 1250
  userLevel: UserLevel;            // computed: >=2000 Oro, >=800 Plata, else Bronce
  userName: string;                // 'Ana'
  cases: PickupCase[];             // DEMO_CASES from mockData
  addCase: (c) => string;          // returns new case ID (CASE-{timestamp})
  updateCaseStatus: (id, status) => void;
  addPoints: (p) => void;
  collectorId: string;             // 'col-3' (EcoCocha)
  collectorAutoAccept: boolean;
  toggleAutoAccept: () => void;
  collectorRequests: PickupCase[]; // filtered: Pendiente | Aceptado | En camino
  acceptCase: (id) => void;        // sets Aceptado + reveals address
  completeCase: (id) => void;
  activeCollector: Collector;      // COLLECTORS[2] (EcoCocha)
  collectorOnboarded: boolean;
  setCollectorOnboarded: (v) => void;
  resetDemo: () => void;
}
```

## DATA MODEL (mockData.ts)
```
Types: Bucket, CaseStatus, UserLevel, IncentiveType, CollectorType
       Material, CaseItem, PickupCase, Collector, Reward, Center

MATERIALS: 15 items → 5 buckets (Reciclable, Biodegradable, No aprovechable, Peligroso, Especial)
COLLECTORS: 3 (Carlos M. ind, María R. ind, EcoCocha empresa)
REWARDS: 7 items (recarga, café, cupón, bolsa, compost, botella, crédito)
CENTERS: 3 (EcoPunto, Centro RAEE, Punto Verde EMSA)
POINTS_RULES: 7 materials with pointsPerKg
DEMO_CASES: 6 cases across 4 statuses
BUCKET_CONFIG: colors + icons per bucket
```

## COLOR PALETTE (CSS vars in theme.css)
```css
--gn-primary-700: #0B3D2E   /* headers, emphasis */
--gn-primary-600: #0F5132   /* primary buttons */
--gn-primary-500: #146C43   /* active states */
--gn-primary-100: #DFF3E7   /* soft highlights */
--gn-secondary-600: #0B5D6B /* trust/safety/collector */
--gn-secondary-100: #D6F2F5
--gn-accent-600: #C77D00    /* rewards/points */
--gn-accent-100: #FFF2CC
--gn-bg: #F7F8FA             --gn-surface: #FFFFFF
--gn-text: #111827            --gn-text-secondary: #4B5563
--gn-border: #E5E7EB
--gn-success: #16A34A  --gn-warning: #F59E0B  --gn-danger: #DC2626  --gn-info: #2563EB
```

## CUSTOM COMPONENTS (UI.tsx)
```
Button(variant: primary|secondary|ghost|danger|outline, size: sm|md|lg, isLoading)
Card(className, onClick)
Badge(variant: success|warning|danger|neutral|primary|info|accent)
Chip(active, onClick, color)
StatusBadge(status: Pendiente|Aceptado|En camino|Completado)
TimelineStepper(steps[], currentIdx)
BucketChip(bucket, icon)
```

## NAVIGATION FLOWS
```
Flow A (User AI):    / → /user/home → /user/ai → /user/create-case → /user/incentive → /user/collector-offers|auto-assign → /user/case/:id
Flow B (Identify):   /user/home → /user/ai → /user/photos → /user/create-case | /user/centers
Flow C (Manual):     /user/home → /user/manual-case → (creates case) → /user/case/:id
Flow D (Collector):  / → /collector/onboarding → /collector/home → /collector/requests → /collector/request/:id → /collector/route → /collector/pickup/:id → /collector/profile
```

## KEY BEHAVIORS
- `addCase()` returns the new ID → callers navigate to `/user/case/{id}`
- Address is "Dirección protegida" until `addressVisible: true` (set on accept)
- PIN is 4 random digits stored in `PickupCase.pin`
- `hideNavPaths` in MobileLayout: ['/user/photos', '/user/create-case', '/collector/onboarding']
- User mode bottom nav: Inicio | IA | Casos | Recompensas
- Collector mode bottom nav: Inicio | Solicitudes | Ruta | Perfil
- `userLevel` computed: points >= 2000 → Oro, >= 800 → Plata, else Bronce
- Reject button in R6 only shows if `userLevel === 'Bronce'`

## SAFETY NOTES FOR MODIFICATIONS
- mockData.ts: don't change existing required fields; use optional (?) for new ones
- AppContext: addCase returns string; all callers expect this
- routes.ts: catch-all `*` must stay last
- theme.css: GREEN NODE vars (--gn-*) are additive; don't replace shadcn tokens
- MobileLayout hideNavPaths: add new fullscreen routes here
- Fixed footers use max-w-[390px] for iPhone frame
