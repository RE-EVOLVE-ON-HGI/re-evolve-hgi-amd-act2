# Re-Evolve V3 — Ecosystem Repository Catalog (Project Singularity)

This document specifies the technical parameters, status, reusable architectures, APIs, and AI integrations for the active components of the **Re-Evolve V3 (Project Singularity)** workspace.

---

## 1. Core Services Catalog (`backend/`)

*   **Location**: `/Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend`
*   **Purpose**: The multi-tenant, event-driven orchestration core of the AI Business Operating System. It exposes external API gateways, compiles agent DAGs, runs security compliance policies, and emits real-time telemetry events.
*   **Tech Stack**: NestJS 10, TypeScript 5, Prisma ORM (PostgreSQL + pgvector), Redis 7 (BullMQ), Apache Kafka 3, gRPC, GraphQL (Apollo), REST (Swagger/OpenAPI), OpenTelemetry, Winston Logger.
*   **Status**: Core infrastructure fully implemented and compiling successfully. Key modules (Auth, Workflows, Memory, Governance, and Telemetry) are active; remaining business stubs are scaffolded as documented patterns.
*   **Architecture**: Modular Monolith with transition boundaries designed for containerized microservice execution. Event-driven architecture (EDA) using Kafka for asynchronous workflows and Socket.io for client broadcasts.

### 1.1 Reusable Backend Modules & Services
*   **Memory Vault Service** (`modules/memory`): Handles document parsing, recursive text chunking, and embedding generation. Connects to the database using `pgvector` HNSW indexes and provides adapters for Qdrant vector retrieval.
*   **Orchestration Engine** (`modules/workflows`): Parses trigger conditions and executes node-graph configurations. Manages job lifecycles using Redis-backed BullMQ runner queues.
*   **Kavacha Shield Compliance** (`modules/governance`): Evaluates declarative JSON rule definitions against inbound payloads before database writes or third-party API executions are authorized.

### 1.2 APIs & External Interfaces
*   **GraphQL Endpoint**: Exposes active queries for agent states, workspace metrics, and user configurations under `/graphql`.
*   **REST Swagger Console**: Exposes routes for telemetry ingestion (`POST /telemetry`) and task dispatch (`POST /agents/dispatch`) under `/docs`.
*   **WebSocket Gateway**: Manages per-tenant Socket.io room subscriptions under `/realtime` for metrics streaming.

### 1.3 AI Integrations
*   **Embeddings API**: Connects to OpenAI (`text-embedding-3-large`) and Google Vertex AI API endpoints, with automatic fallback adapters to local transformers in case of rate-limiting or network downtime.
*   **Orchestration Prompts**: LangGraph-style agent planning routines that structure reasoning paths into typed JSON steps.

### 1.4 Deployment Infrastructure
*   **Compose Configuration**: Multi-container docker orchestration in `docker-compose.yml` including PostgreSQL, Redis, Kafka, Qdrant, OpenTelemetry Collector, Prometheus, and Grafana.
*   **Kubernetes Manifests** (`k8s/`): Production deployment files defining Deployments, cluster Services, Horizontal Pod Autoscalers (HPAs), and Ingress controls.

---

## 2. Cosmic Console Web App (`frontend/`)

*   **Location**: `/Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend`
*   **Purpose**: The premium visual command center for founders, agencies, and enterprises to coordinate their autonomous workforces.
*   **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Framer Motion, Socket.io-client, Lucide Icons, Zustand.
*   **Status**: Active layout routes and component libraries compile successfully. Wired to live Socket.io events and local API helpers.
*   **Architecture**: Client-Server App Router configuration. Edge-native middleware guards handle authentication claims. Interactive client panels fetch data through a central API layer.

### 2.1 Reusable UI Component Libraries
*   **Cosmic Design System** (`components/hgi/design-system.tsx`): Pre-compiled, responsive visual widgets:
    *   `MetricCard`: Glowing dashboard metrics displays featuring status markers and custom trend lines.
    *   `NeuralPulse`: Concentric circle indicators that animate in real-time to visualize system workloads.
    *   `ScanLine`: Security scanning overlays that animate to show active threat scans.
*   **Client Hook System** (`hooks/use-realtime.ts`): React hook that handles WebSocket connection management, channel subscription boundaries, and state changes.

### 2.2 Client APIs
*   **Central Dispatcher** (`lib/api.ts`): Central client SDK exposing REST/GraphQL fetches with built-in mock telemetry fallbacks to allow front-end page rendering even when the NestJS server is offline.
