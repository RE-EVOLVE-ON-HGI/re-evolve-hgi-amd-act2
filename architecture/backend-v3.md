# Re-Evolve V3 — Backend Architecture (Project Singularity)

This document specifies the microservice separation boundaries, Gateway layers, gRPC mesh interactions, Kafka event definitions, and database partitioning rules for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Monolith Refactoring & Microservice Boundaries

To eliminate scale-up bottlenecks found in V2, V3 separates execution workloads into five distinct microservice containers:

```
                            API Gateway (REST / GraphQL / WS)
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     │ (gRPC)               │ (gRPC)               │ (gRPC)
                     ▼                      ▼                      ▼
               Auth Service           Agent OS Service      Governance Service
             (Tenants / RBAC)        (BullMQ / Workflows)     (Kavacha Shield)
                     │                      │                      │
                     └──────────────┬───────┴──────────────┬───────┘
                                    │ (Kafka Events)       │ (Kafka Events)
                                    ▼                      ▼
                            Observability Service   Revenue Service
                             (Telemetry / Logs)    (Ledger / Billing)
```

---

## 2. Microservice Layer Catalog

### 2.1 Gateway Layer (APIs & Access Controls)
*   **Purpose**: Single entry point for routing external requests. Exposes REST (Swagger docs) and GraphQL endpoints.
*   **Protocol Support**: Converts incoming REST/GraphQL queries into internal gRPC payloads. Manages active WebSocket connections under the `/realtime` namespace.

### 2.2 Service Layer (Workflows & Business Logic)
*   **Purpose**: Manages organization details, user lifecycle, and metadata state changes.
*   **Communication**: Connects to the Core Database using connection pooling. Emits transactional events to Kafka.

### 2.3 Agent Layer (State Orchestration & Runtime)
*   **Purpose**: Computes task Directed Acyclic Graphs (DAGs) and runs agents.
*   **Execution Grid**: Uses distributed Redis/BullMQ worker queues. Long-running tasks run in isolated agent runtimes to prevent gateway blocking.

### 2.4 Knowledge Layer (Vector Vault & Semantics)
*   **Purpose**: Houses pgvector and Vertex AI Vector Search clients.
*   **Optimization**: Implements HNSW indexes to search memory tables in sub-milliseconds.

### 2.5 Revenue Layer (Billing Ledger)
*   **Purpose**: Tracks API token usage and manages double-entry bookkeeping tables.
*   **Reliability**: Processes payment records asynchronously via Kafka to prevent data loss.

### 2.6 Observability Layer (OTel Metrics & Anomaly Engine)
*   **Purpose**: Collects telemetry events, measures API latency, and detects anomalous traffic patterns.

---

## 3. Internal gRPC Interface Schema

Internal microservices communicate using gRPC over HTTP/2. Below is the proto contract definition for the **Orchestrator Coordination Engine**:

```proto
syntax = "proto3";

package v3.orchestrator;

service OrchestrationEngine {
  rpc DispatchDag (DagRequest) returns (DagResponse);
  rpc QueryTaskStatus (TaskQuery) returns (TaskStatusResponse);
}

message DagRequest {
  string org_id = 1;
  string workspace_id = 2;
  string goal = 3;
  repeated string preferred_agent_ids = 4;
}

message DagResponse {
  string orchestration_id = 1;
  string initial_status = 2;
  int32 total_steps = 3;
}

message TaskQuery {
  string task_id = 1;
}

message TaskStatusResponse {
  string status = 1;
  string current_agent_id = 2;
  int32 duration_ms = 3;
  string output_json = 4;
}
```

---

## 4. Time-Series Telemetry Partitioning Rules

To handle 1M+ daily event logs, the core database implements monthly table partitioning on metrics and traffic data:

```sql
-- Partitioning configuration script
CREATE TABLE metrics_raw (
    id UUID NOT NULL,
    org_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    value FLOAT NOT NULL,
    ts TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);

-- Pre-creating monthly partition tables for Q3 2026
CREATE TABLE metrics_y2026m07 PARTITION OF metrics_raw
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');
    
CREATE TABLE metrics_y2026m08 PARTITION OF metrics_raw
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');
```
