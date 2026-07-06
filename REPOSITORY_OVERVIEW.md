# Repository & Codebase Overview
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

This document outlines the codebase layout, folder hierarchy, and database architecture models of the Re-Evolve repository.

---

## 1. Project Directory Blueprint

The repository is organized as a monorepo containing NestJS backend logic, Next.js frontend presentation layers, and setup docker templates.

```
re-evolve-hgi-amd-act2/
├── backend/                  # NestJS API backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── agent/        # Specialist capability registers
│   │   │   ├── model/        # AMD / ROCm / Fireworks routing
│   │   │   ├── security/     # Panani X Sandbox & Kavacha audits
│   │   │   └── memory/       # pgvector & Qdrant vault syncers
│   │   └── app.module.ts
│   └── pnpm-lock.yaml
├── frontend/                 # Next.js Presentation & Demo portal
│   ├── app/
│   │   ├── builder/          # Companion Mission Builder page
│   │   ├── hq/               # Enterprise workspace (gated)
│   │   ├── page.tsx          # 12-chapter keynote landing page
│   │   └── not-found.tsx     # Custom 404 router interceptor
│   ├── components/
│   │   └── hgi/
│   │       ├── design-system.tsx # Custom GlassPanel / badge styling
│   │       ├── neural-earth.tsx  # ThreeJS particle globe
│   │       └── navigation.tsx    # Left sidebar menu link registry
│   └── pnpm-lock.yaml
├── docs/                     # Comprehensive architectural documentation
│   └── AMD_INTEGRATION_GUIDE.md
└── docker-compose.yml        # Setup template for local environments
```

---

## 2. Component Logic Configurations

### 2.1 Model Router Abstraction
All chat operations route through `backend/src/modules/model/model.service.ts`:
- Local ROCm serving is targeted when `AMD_CLOUD_API_KEY` is present.
- Hosted Fireworks AI acts as a fallback connection point during local node timeout sequences.

### 2.2 Custom Route Interceptor
- `frontend/app/not-found.tsx` acts as the global client-side router interceptor.
- Gated paths under `/hq/*` display the **Enterprise Platform Modules** notification page.
- Other invalid paths perform a 3-second fading redirect back to `/`.
