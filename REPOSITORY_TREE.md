# Repository Tree
## Isolated Project Structure for re-evolve-hgi-amd-act2

This file details the structural folder layout of the dedicated AMD Hackathon repository.

---

```
re-evolve-hgi-amd-act2/
├── backend/                   # NestJS API, Prisma database model, and test suites
│   ├── src/                   # Service controllers, modules, and guards
│   ├── prisma/                # PostgreSQL schema definitions and seeds
│   └── package.json
├── frontend/                  # Next.js client console dashboards
│   ├── app/                   # Dynamic hq dashboards and routes
│   ├── components/            # Design system widgets and UI frameworks
│   └── package.json
├── sdk/                       # Unified TypeScript & Python agent client bindings
├── cli/                       # Command-line developer client wrapper
├── docs/                      # General architectural blueprints
├── [System Guides]            # README, WHY_RE_EVOLVE, ARCHITECTURE, CENSA, KAVACHA, AMD, etc.
└── [Submission Reports]       # REPOSITORY_TREE, MIGRATION_REPORT, FRONTEND_QA, BACKEND_QA, etc.
```

---

## 2. Directory Validation Status

-   **Unused prototypes**: **EXCLUDED**.
-   **Local caches & caches**: **EXCLUDED**.
-   **Production services**: **RETAINED & CERTIFIED**.
