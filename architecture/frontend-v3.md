# Re-Evolve V3 — Frontend Architecture (Project Singularity)

This document specifies the Next.js 16 rendering, state hydration, edge middleware routing, and component architecture for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Directory Structure & Feature Isolation

V3 isolates features in domain modules under `/frontend` to match backend services.

```
/frontend
  ├── app/                       # Next.js 16 App Router
  │    ├── auth/                 # Auth pages
  │    └── hq/                   # Premium V3 Console
  │         ├── layout.tsx       # Core navigation shell
  │         ├── page.tsx         # Mission Control Dashboard
  │         ├── agents/          # Agent Fleet Manager
  │         ├── sarathi/         # Orchestrator Canvas (React Three Fiber)
  │         ├── governance/      # Policy dashboard
  │         └── finance/         # Financial ledger displays
  ├── components/                # Core Design System Components
  │    ├── ui/                   # Atomic elements (buttons, inputs)
  │    └── hgi/                  # Complex components (pulsers, meters)
  ├── hooks/                     # Custom React Hooks
  │    └── use-realtime.ts       # Socket room listeners
  └── lib/                       # Utility and state libraries
       ├── api.ts                # REST and GraphQL clients
       └── store.ts              # Zustand state stores
```

---

## 2. Rendering Strategy: Server & Client Boundaries

To achieve a high-performance interface, V3 enforces a strict separation between Server Components (RSC) and Client Components (`'use client'`).

```
                              Next.js Router
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼ (RSC)                                 ▼ ('use client')
      Server Components                       Client Components
   ├── Fetch initial organization static   ├── Real-time telemetry widgets
   │   metadata via Prisma.                ├── Sārathi Canvas (React Three Fiber)
   ├── Read feature flag configurations.   ├── Interactive forms & modals
   └── Hydrate state stores.               └── Websocket state hooks
```

*   **Server Component (RSC) Rules**:
    *   No hooks (`useState`, `useEffect`, `useContext`) are allowed.
    *   Prisma database operations or internal gRPC calls are executed directly in server functions to bypass REST overhead.
*   **Client Component Rules**:
    *   Delimited at the terminal nodes of the DOM tree (e.g., interactive tables, telemetry charts).
    *   Use hydration markers to prevent React mismatches during Server-Side Rendering (SSR).

---

## 3. Client State Management (Zustand)

V3 replaces heavy Redux structures with a fast, lightweight **Zustand** store framework located at [store.ts](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/lib/store.ts).

```ts
import { create } from 'zustand'

interface UserState {
  user: { id: string; email: string; tier: string; orgId: string } | null
  setUser: (user: UserState['user']) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
```

State stores are hydrated during the initial server response by passing static properties down via server-injected state context.

---

## 4. Edge Middleware Caching & Routing

V3 redirects non-authorized requests at the network edge using Google Cloud and Vercel edge routers.

*   **Route Guards**: Edge middleware parses the JWT token, extracts the tenant's tier claim, and checks Redis cache parameters.
*   **Static Assets Cache**: Dashboard assets and graphics are served with edge-native header tags:
    ```http
    Cache-Control: public, max-age=31536000, immutable
    ```
*   **Dynamic Revalidation**: Server fetches targeting external API nodes implement revalidation intervals:
    ```ts
    const res = await fetch('https://api.re-evolve.com/v3/metrics', {
      next: { revalidate: 60 } // Cache results for 60 seconds
    })
    ```
