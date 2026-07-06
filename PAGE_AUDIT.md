# PAGE AUDIT

This audit catalogs all production pages and layouts across the RE-EVOLVE ON HGI user interface, confirming responsive behavior, skeleton loaders, and real backend API consumption.

---

## 1. Page & Layout Directory

The web client UI is structured using React TanStack Router (`apps/censa-core`) and Next.js App Router (`apps/web`).

| Route Path | Type | Status | API Connectivity |
| :--- | :--- | :--- | :--- |
| `/` | TanStack Entry | 🟢 Active | Hydrates onboarding state client-side. |
| `/welcome` | Intro Page | 🟢 Active | Static layout with ambient animations. |
| `/onboarding` | User Setup | 🟢 Active | POSTs user profile setup to NestJS `/auth/register`. |
| `/os` | Dashboard Shell | 🟢 Active | Parent routing. |
| `/os/index` | OS Home | 🟢 Active | Consumes live feeds, active agent telemetry, and statistics. |
| `/os/censa` | CENSA Workspace | 🟢 Active | Full intent engine console, communicates with NestJS `/hgi/command`. |
| `/os/founder` | Founder Cockpit | 🟢 Active | Integrates venture metrics and active modules. |
| `/os/memory` | Memory Constellation | 🟢 Active | Pulls from long-term storage APIs. |
| `/os/knowledge` | Knowledge Universe | 🟢 Active | Retrieves processed document nodes and assets. |
| `/os/workflows` | Workflow Studio | 🟢 Active | GETs/POSTs workflow graphs to `/workflows`. |
| `/os/execution` | Execution River | 🟢 Active | Monitors background runner signals. |
| `/os/venture` | Venture Studio | 🟢 Active | Manages project pipelines. |
| `/os/agents` | Agent Galaxy | 🟢 Active | Agent builder; CRUD operations on `/agents`. |
| `/os/settings/billing` | Settings Billing | 🟢 Active | Connects to Stripe billing checkout endpoints. |
| `/terminal` | Terminal Console | 🟢 Active | Interacts with server command runner. |

---

## 2. UI Polish & Component Validation

* **Skeleton Loaders:** Implemented on Workspace, Knowledge, and Agent pages to present clean loaders during API hydration.
* **Optimistic Rendering:** Implemented on universal commands (immediate message rendering while pending server processing).
* **Animations:** Framer-motion used for smooth transitions, sidebar collapses, and ambient background flows.
* **12-Day Countdown & Waitlist:** Verified on registration landing screens.
* **Mocks Removed:** All lists (Workspaces, Agents, Tasks) bind directly to react query hooks consuming live endpoints.
