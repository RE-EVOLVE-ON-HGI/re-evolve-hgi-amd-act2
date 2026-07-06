# RE-EVOLVE ON HGI — Backend Architecture

> Single source of truth: the HGI HQ wireframe (35 screens). This document maps
> **every** visual module to concrete backend services, events, APIs, and tables,
> and states honestly what is *implemented in code here* vs. what is *scaffolded
> for the same pattern to be extended into*.

---

## 1. What this repository actually contains

This is the **foundation layer** a principal architect lays down first — not a
finished 24-module product (that is team-scale, multi-month work that cannot be
emitted complete and verified in a single pass).

**Implemented end-to-end (real logic, no mocks):**
- Complete multi-tenant **data model** (`prisma/schema.prisma`) covering all 20+
  domains the brief lists.
- Cross-cutting **infrastructure**: config, Prisma, Kafka producer/consumer with
  a typed topic registry, Redis/BullMQ, JWT auth + **RBAC/ABAC** guard,
  WebSocket gateway, OpenTelemetry tracing, gRPC transport, GraphQL + REST +
  Swagger.
- Four **reference domain modules wired through every layer**:
  - **Agent Orchestration** — planning → routing → distributed BullMQ execution →
    Kafka events → live WebSocket push.
  - **Memory Vault** — chunking, embeddings (provider + offline fallback),
    pgvector + Qdrant, semantic retrieval, retention touch.
  - **Workflow Studio** — node-graph engine with async queued execution.
  - **Telemetry Grid + Governance/Policy engine** — ingestion, anomaly
    detection, declarative rule evaluation, violation + score aggregation.
- **Deployment surface**: Dockerfile, docker-compose (Postgres+pgvector, Redis,
  Kafka, Qdrant, OTel, Prometheus, Grafana), K8s (Deployment/Service/HPA/Ingress),
  GitHub Actions CI, seed.

**Scaffolded (documented contract; extend by replicating the reference pattern):**
the remaining modules in §3 marked _pattern_. Each is the same shape:
`module → service (Prisma + Kafka + Realtime) → controller (REST+Swagger) →
resolver (GraphQL) → optional BullMQ processor`.

This is deliberate and honest: shipping 24 shallow stubs labelled "production"
is exactly what the brief forbids. A proven, fully-wired pattern + a complete
data model is what lets the rest be added safely, module by module.

---

## 2. System topology

```
                    ┌──────────────── Clients (dashboard) ────────────────┐
                    │  REST /docs   GraphQL /graphql   WS /realtime        │
                    └───────────────┬───────────────────┬─────────────────┘
                                    │                   │ live events
                            NestJS API gateway          │
   ┌───────────────────────────────┼───────────────────┴──────────────────┐
   │  Auth (JWT/RBAC/ABAC) ·  GraphQL  ·  Swagger  ·  gRPC (internal mesh)  │
   └───────────────┬───────────────────────────────────────┬──────────────┘
                   │ Prisma                                 │ emit/subscribe
            ┌──────▼──────┐                          ┌──────▼──────┐
            │ PostgreSQL  │                          │   Kafka     │  ← nervous system
            │ + pgvector  │                          │  (topics)   │
            └─────────────┘                          └──────┬──────┘
            ┌─────────────┐   ┌─────────────┐               │
            │   Redis     │   │   Qdrant    │        BullMQ workers
            │  + BullMQ   │   │  (vectors)  │   (agent runtime, workflow runtime)
            └─────────────┘   └─────────────┘
       Observability: OpenTelemetry → OTLP → Prometheus + Grafana
```

Event-driven by default; **CQRS** is applied where read models diverge from write
models (telemetry/metrics rollups, governance scores, capacity distribution).

---

## 3. Module → backend mapping

| Wireframe module | Backend service(s) | Key events (Kafka) | Primary tables | Status |
|---|---|---|---|---|
| **Mission Control HQ** | aggregates read-models from all services | consumes all | views over `metrics`,`telemetry_events` | _read-model_ |
| **Founder Cockpit** | strategic rollups + `Decision` | `neural.decision` | `decisions`,`metrics` | _pattern_ |
| **Agent Foundry / Sārathi Orchestration** | `OrchestratorService`,`AgentsService`,`AgentRuntimeProcessor` | `agent.task.*`,`orchestration.updated`,`agent.message` | `agents`,`agent_tasks`,`orchestrations`,`agent_messages`,`agent_evaluations` | ✅ implemented |
| **Autonomous Agent Council** | orchestration consensus over `Agent` tiers | `orchestration.updated` | `orchestrations`,`agents` | _pattern (extends orchestrator)_ |
| **Neural Command Core** | `Decision` engine + intent funnel | `neural.decision` | `decisions` | _pattern_ |
| **Memory Vault / Knowledge Graph** | `MemoryService`,`EmbeddingsService`,`QdrantService` ; graph via `GraphNode/Edge` | `memory.ingested` | `memory_records`,`memory_chunks`,`graph_nodes`,`graph_edges` | ✅ memory implemented; graph schema ready |
| **Workflow Studio** | `WorkflowsService`,`WorkflowRuntimeProcessor` | `workflow.triggered`,`workflow.step.completed` | `workflows`,`workflow_executions` | ✅ implemented |
| **Governance Grid / Policy Engine / Ethics** | `PolicyService` rule engine | `governance.violation`,`governance.approval.requested` | `policies`,`policy_evaluations`,`violations`,`approvals` | ✅ implemented |
| **Risk & Compliance / Audit Intelligence** | violation aggregation + `AuditLog` | `governance.violation` | `violations`,`audit_logs` | _pattern_ |
| **Global Telemetry Grid / API Observability** | `TelemetryService` ; `ApiTraffic` middleware | `telemetry.ingested`,`telemetry.anomaly` | `telemetry_events`,`metrics`,`api_traffic` | ✅ telemetry implemented |
| **Infrastructure Atlas / Multi-Region Ops** | `InfraNode`,`Region` health services | `infra.status.changed` | `infra_nodes`,`regions` | _pattern_ |
| **Data Pipeline** | `Pipeline`,`PipelineRun` + Kafka streaming | (pipeline topics) | `pipelines`,`pipeline_runs` | _pattern_ |
| **Ecosystem Galaxy / Portfolio & Verticals** | `Ecosystem`,`EcosystemMetric` + graph | — | `ecosystems`,`ecosystem_metrics`,`graph_edges` | _pattern_ |
| **Intelligence Economy / Financial Command** | `IntelligenceAsset`,`MarketListing`,`EconomicTransaction`,`CapitalFlow` | `economy.transaction` | `intelligence_assets`,`market_listings`,`economic_transactions`,`capital_flows` | _pattern_ |
| **Quantum Simulation Lab** | `Simulation` runtime (queue → external compute adapter) | (simulation topics) | `simulations` | _pattern_ |
| **Security Center** | `AuthService`,`PermissionsGuard`,`Session` intelligence, anomaly | `telemetry.anomaly` | `users`,`roles`,`permissions`,`sessions`,`api_keys`,`audit_logs` | ✅ auth/RBAC implemented |

---

## 4. The event backbone

`src/common/events/topics.ts` defines the canonical topic set. Services **emit**
on state change and **subscribe** to react; the WebSocket gateway re-broadcasts
per-tenant to the dashboard (`org:{id}` rooms). This is what makes the wireframe's
"LIVE" feeds real rather than polled.

Example flow (Mission Control "Intelligence Flow Engine" timeline):

```
POST /agents/dispatch
  → OrchestratorService.dispatch()  (plan → route → enqueue)
  → emit agent.task.created         (per stage)
  → AgentRuntimeProcessor           (BullMQ, concurrency 8, retry/backoff)
  → emit agent.task.completed       → RealtimeGateway.publish(org, 'agents', …)
  → dashboard timeline node lights up
```

---

## 5. Running it

```bash
cp .env.example .env
docker compose up -d postgres redis kafka qdrant
npm install
npx prisma migrate dev          # creates schema incl. pgvector columns
npm run prisma:seed             # roles, permissions, founder org
npm run start:dev               # REST /docs · GraphQL /graphql · WS /realtime
# full stack incl. API container + observability:
docker compose up --build
```

Deploy: `docker build` → push → `kubectl apply -f k8s/`. HPA scales 3→20 on CPU.

---

## 6. Honest extension guide

To add any _pattern_ module, copy a reference module (e.g. `modules/telemetry`)
and:
1. add the domain methods to a `*.service.ts` (Prisma queries + `kafka.emit`),
2. expose a `*.controller.ts` (REST + `@RequirePerms` + Swagger tags),
3. add a `*.resolver.ts` (+ `.graphql`) if the dashboard needs GraphQL,
4. add a BullMQ processor only if the work is async/long-running,
5. register the module in `app.module.ts` and add seed permissions.

The data model and infrastructure already support all of them — no schema or
infra changes are required to light up the remaining screens.
