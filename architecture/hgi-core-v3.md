# Re-Evolve V3 — HGI Core Blueprint (Project Singularity)

This document specifies the architecture of the **HGI Operating Core** for **Re-Evolve V3 (Project Singularity)**, built from first principles.

---

## 1. HGI Operating Core Architecture

The HGI Core serves as the operating engine of Re-Evolve V3, orchestrating user intents into structured execution outcomes.

```
                          User Intent / Prompt
                                   │
                                   ▼
                     Intent Engine (Classification)
                                   │
                                   ▼
                      Reasoning Layer (DAG Planner)
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
           Memory Engine                       Agent Registry
        (Vector Embeddings)                 (Capability matching)
                 │                                   │
                 └─────────────────┬─────────────────┘
                                   ▼
                       Execution Layer (Sandboxes)
                                   │
                                   ▼
                            Revenue Attribution
                            (Ledger tracking)
```

---

## 2. Operating Core Modules

### 2.1 Intent Engine
*   **Purpose**: Classifies incoming user prompts into domain intents (e.g. Code, Audit, Finance, Automation).
*   **Routing Logic**: Evaluates input complexity in sub-50ms using local classifiers (Groq/Cerebras). High-complexity prompts are routed to Vertex AI models.

### 2.2 Reasoning Layer
*   **Purpose**: Compiles a Directed Acyclic Graph (DAG) of the tasks required to achieve the user's goal.
*   **Dynamic Planning**: Uses Concentric Graph planning, evaluating dependencies at each step and dynamically adjusting the graph if an execution path fails.

### 2.3 Memory Engine
*   **Purpose**: Interfaces with pgvector database partitions to retrieve semantic context from the workspace.
*   **Database Partitioning**: The `memory_records` and `memory_chunks` tables are partitioned by organization to ensure fast search speeds.
*   **Retriever**: Pulls memory records using pgvector HNSW distance metrics.

### 2.4 Knowledge Graph
*   **Purpose**: Maps relationships between organizations, systems, assets, and workflows.
*   **Database Tables**: Represented in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) under `GraphNode` and `GraphEdge` tables.

### 2.5 Agent Registry
*   **Purpose**: Central registry of available agents, their models, status, capacity, and success rates.

### 2.6 Skill Registry
*   **Purpose**: Exposes atomic, sandboxed tools (e.g., File Scraper, Ledger Writer, PR Builder) that agents can call.

### 2.7 Execution Layer
*   **Purpose**: Dispatches the compiled DAG stages to target agents and runs them in secure sandbox environments.

---

## 3. Dynamic Token Tracking & Billing

To prevent budget leakage, the Revenue Engine tracks and attributes token costs dynamically:

$$TaskCost_{cents} = BaseCost_{agent} + (Tokens_{in} \cdot Rate_{in} + Tokens_{out} \cdot Rate_{out}) + (SandboxCpuMs \cdot Rate_{cpu})$$

1.  **Quota Verification**: The API Gateway checks the tenant's pre-paid balance in Redis before authorizing tasks.
2.  **Telemetry Aggregation**: Active token usage is tracked via Kafka events and recorded in the database `EconomicTransaction` table.
3.  **Balance Sync**: If a tenant's balance drops below zero, active workflows are suspended.
