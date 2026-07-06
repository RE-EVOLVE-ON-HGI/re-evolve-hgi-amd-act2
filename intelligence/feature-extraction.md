# Re-Evolve V3 — Feature Extraction Playbook (Project Singularity)

This document specifies the extraction classification matrix, categorizing current features as **KEEP, IMPROVE, REWRITE, or REJECT** to transition to **Re-Evolve V3 (Project Singularity)**.

---

## 1. Feature Extraction Decision Matrix

```
┌───────────────────────────┬───────────┬────────────────────────────────────────────────────────┐
│ Feature Subsystem         │ Action    │ Implementation Strategy & Justification                │
├───────────────────────────┼───────────┼────────────────────────────────────────────────────────┤
│ MetricCard / NeuralPulse  │ KEEP      │ Visual look is polished; keep as core design elements.  │
│ BullMQ Worker Queues      │ KEEP      │ Redis-backed queue system runs reliably.               │
│ OpenTelemetry Tracing     │ KEEP      │ Clean instrumentation; trace IDs link queries.         │
│ pgvector Memory Storage   │ IMPROVE   │ Keep pgvector 1536 schema, but optimize HNSW index.    │
│ Text Chunking Parser      │ IMPROVE   │ Keep recursive parsing, but add file formats (PDFs).   │
│ Telemetry Databases       │ IMPROVE   │ Partition telemetry tables monthly to prevent bloat.   │
│ UI Navigation Sidebar     │ REWRITE   │ Replace with unified Cosmic sidebar with transitions.  │
│ Agent Council Consensus   │ REWRITE   │ Replace with dynamic voting consensus protocol.        │
│ Intent Routing Engine     │ REWRITE   │ Replace hardcoded prompts with provider score formula.  │
│ GraphNode Schema Queries  │ REWRITE   │ Replace relational schema joins with graph queries.     │
│ Double-Entry Bookkeeping  │ REWRITE   │ Replace V2 billing stub with ledger database schema.   │
│ Qdrant Vector Adapter     │ REJECT    │ Remove duplicate adapter; standardize on pgvector.     │
│ REST Telemetry Route      │ REJECT    │ Remove REST endpoints; pipe directly to Kafka.         │
└───────────────────────────┴───────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Extraction Playbook Details

### 2.1 UI Components (Cosmic Theme Integration)
*   **KEEP**: `MetricCard`, `NeuralPulse`, `StatusIndicator`, and `ScanLine` components in [design-system.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/components/hgi/design-system.tsx).
*   **IMPROVE**: The main dashboard shell, adding keyboard navigation commands and transition animations.

### 2.2 Agent Workflows
*   **KEEP**: Redis-backed BullMQ runner queues for scheduling asynchronous tasks.
*   **IMPROVE**: The DAG workflow parser, adding step-level retry mechanisms.
*   **REWRITE**: The Agent Council system. Implement a dynamic voting consensus protocol that evaluates and approves agent plans before execution.

### 2.3 Memory & Knowledge Systems
*   **KEEP**: Recursive paragraph text chunking methods in the memory service.
*   **IMPROVE**: pgvector schema configurations.
*   **REWRITE**: GraphNode query logic. Implement graph query methods to replace slow relational joins.
*   **REJECT**: The Qdrant vector adapter. Standardizing on pgvector reduces maintenance overhead and simplifies operations.

### 2.4 Marketplace & Billing Logic
*   **REWRITE**: Pre-execution validation checks. Marketplace uploads must run in isolated sandboxes to verify logic and prevent security leaks.
*   **REWRITE**: Double-entry financial bookkeeping systems. Implement ledger database tables to track token usage, subscription pools, and developer payouts.

### 2.5 Routing & Observability
*   **REWRITE**: The Intent Routing engine. Replace static configurations with a dynamic scoring engine that routes queries based on real-time latency, quality, and cost.
*   **IMPROVE**: The Telemetry database, partitioning tables monthly.
*   **REJECT**: High-frequency REST endpoints for telemetry ingestion. Directing events through Kafka prevents Gateway connection bottlenecks.
