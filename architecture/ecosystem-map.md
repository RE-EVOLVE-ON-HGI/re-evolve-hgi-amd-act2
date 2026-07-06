# Re-Evolve V3 — Ecosystem Map (Project Singularity)

This document specifies the repository topology, dependency structures, shared modules, and technical debt audit for the **Re-Evolve V3 (Project Singularity)** ecosystem.

---

## 1. Repository Relationships & Dependency Graph

Re-Evolve V3 transitions from a coupled mono-repository structure into a distributed, multi-repository architecture to handle enterprise workloads.

```mermaid
graph TD
    classDef main fill:#5C6BC0,stroke:#3F51B5,color:#fff;
    classDef lib fill:#26A69A,stroke:#00897B,color:#fff;
    classDef infra fill:#78909C,stroke:#546E7A,color:#fff;

    Gateway[re-evolve-v3-gateway]::main -->|gRPC / RPC Mesh| Auth[re-evolve-v3-auth-service]::main
    Gateway -->|gRPC / RPC Mesh| AgentOS[re-evolve-v3-agent-os]::main
    Gateway -->|gRPC / RPC Mesh| WorkspaceOS[re-evolve-v3-workspace-os]::main
    
    AgentOS -->|Subscribes / Publishes| Kafka[Kafka Event Bus]::infra
    WorkspaceOS -->|Subscribes / Publishes| Kafka
    
    AgentOS -->|Semantic Retrieval| Memory[re-evolve-v3-memory-vault]::main
    
    subgraph Shared Core Libraries
        SDK[hgi-native-sdk]::lib
        Kavacha[kavacha-shield-core]::lib
        Theme[cosmic-theme-ui]::lib
    end
    
    Auth -.-> SDK
    AgentOS -.-> SDK
    AgentOS -.-> Kavacha
    Theme -.-> Gateway
    
    subgraph Storage & Cache
        Postgres[(PostgreSQL 16 + pgvector)]::infra
        Redis[(Redis Cluster + Memorystore)]::infra
        BigQuery[(BigQuery Analytics)]::infra
    end
    
    WorkspaceOS --> Postgres
    AgentOS --> Redis
    Memory --> Postgres
    Kafka --> BigQuery
```

---

## 2. Shared Modules & Reusable Services

### 2.1 Foundational Libraries
*   `hgi-native-sdk` ([lib](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/lib)): Central client SDK that defines typed interfaces for HGI brain routing, payload wrapping, and token calculation limits.
*   `kavacha-shield-core` ([governance](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/src/modules/governance)): Policy evaluation core library defining ethics controls, max transaction thresholds, and runtime sandbox overrides.
*   `cosmic-theme-ui` ([components](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/components)): Pre-compiled React UI design system containing premium, responsive visual elements (glow metrics cards, neural pulsers, scanning bars).

### 2.2 Reusable Services
*   **Vector Retrieval Service**: Implemented within the memory vault, abstracting embeddings loading, distance calculation, and pgvector operations.
*   **Realtime Telemetry Service**: Socket.io gateway handling rooms subscriptions based on organization UUID, used by both agent execution updates and billing ledgers.

---

## 3. Technical Debt Inventory & Audit

Our analysis of the V2 codebase reveals several critical areas of structural debt:

### 3.1 Relational Schema Overhead (Prisma)
*   **Issue**: The single database model in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) spans 20+ domains in a single PostgreSQL instance. 
*   **Impact**: Creates tight coupling where schema migrations in a minor module (e.g., `simulations` or `capital_flows`) require locking tables used by core modules (`organizations`, `users`).
*   **Action**: Partition the schema. Move transient logging tables (`api_traffic`, `telemetry_events`) to time-series databases or BigQuery.

### 3.2 Dual-Vector Database Implementations
*   **Issue**: Code references contain adapters for *both* `pgvector` (via Prisma raw SQL) and `Qdrant` (via external gRPC connections).
*   **Impact**: Duplicate search indexes, dual-write synchronization complexity, and redundant memory-cache operations.
*   **Action**: Standardize on `pgvector` (PostgreSQL 16) with HNSW indexes for local episodic memory, and use Google Cloud Vertex AI Vector Search for massive multi-modal knowledge bases.

### 3.3 TypeScript JSON Force-Casting
*   **Issue**: To write nested plan topologies or reasoning traces, the code relies on strict casting overrides (`as any`) when calling Prisma database updates.
*   **Impact**: Bypasses compiler protection, risking runtime database crashes if JSON validation structures drift.
*   **Action**: Introduce Zod validator models that enforce runtime JSON validation before writing to Postgres JSONB fields.

### 3.4 Monolithic Service Boundaries
*   **Issue**: The NestJS app bundles core agent orchestration, telemetry monitoring, policy evaluations, and API routing inside a single process.
*   **Impact**: Scaling is inefficient (e.g., memory-heavy LLM routing processes scale alongside light telemetry counters), and a single code error inside an execution sandbox can crash the entire Gateway API.
*   **Action**: Refactor the monolithic service into segregated microservices (Gateway, Agent OS, Governance, Telemetry) running on containerized clusters (GKE/Cloud Run).
