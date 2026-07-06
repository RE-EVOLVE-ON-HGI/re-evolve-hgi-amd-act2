# Re-Evolve V3 — HGI Native Core (Project Singularity)

This document specifies the architecture of the **HGI Native Core**, defining the Intent routing engine, reasoning concentric graphs, memory subsystems, and the execution lifecycle of HGI-driven outcomes.

---

## 1. HGI Core Component Model

Instead of relying on hardcoded prompt flows, V3 uses a unified **HGI Operating Core** where modules interact dynamically.

```
                          User Intent / Prompt
                                   │
                                   ▼
                             Intent Engine (Classification)
                                   │
                                   ▼
                         Reasoning Engine (DAG Compiler)
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
               Memory Engine              Agent Registry
             (pgvector Lookups)         (Select qualifies)
                     │                           │
                     └─────────────┬─────────────┘
                                   ▼
                           Execution Engine
                         (Skill Sandbox / VM)
                                   │
                                   ▼
                         Revenue Attribution
                         (Token Cost Ledger)
                                   │
                                   ▼
                            Analytics Loop
                         (Update success rate)
```

### 1.1 Intent Engine
*   **Purpose**: Classifies user prompts into distinct execution intents (e.g., Code, Audit, Finance, Automation).
*   **Model**: Fast local classifiers (Groq/Cerebras) route inputs in sub-50ms, falling back to Vertex AI model suites for high-complexity prompts.

### 1.2 Reasoning Engine
*   **Purpose**: Compiles a Directed Acyclic Graph (DAG) of the tasks required to achieve the user's goal.
*   **Topology**: Uses Concentric Graph planning, evaluating dependencies at each step and dynamically adjusting the graph if an execution path fails.

### 1.3 Memory Engine
*   **Purpose**: Interfaces with [database_design.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/database_design.md) to retrieve semantic context from the workspace.
*   **Retriever**: Pulls episodic memory vectors using pgvector HNSW distance metrics.

### 1.4 Knowledge Graph
*   **Purpose**: Maps relationships between organizations, systems, assets, and workflows.
*   **Data Layer**: Persisted in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) under `GraphNode` and `GraphEdge` tables.

### 1.5 Agent Registry
*   **Purpose**: Central registry of available agents, their models, status, capacity, and success rates.

### 1.6 Skill Registry
*   **Purpose**: Exposes atomic, sandboxed tools (e.g., File Scraper, Ledger Writer, PR Builder) that agents can call.

### 1.7 Execution Engine
*   **Purpose**: Dispatches thecompiled DAG stages to target agents and runs them in secure runtimes.

---

## 2. Omnichannel Intent Life Cycle

```
[ User Input ] -> "Audit Q2 finance ledger and flag anomalies"
  │
  ├─► 1. Parse Intent (HGI Brain)
  │      Identifies "domain: Finance", "complexity: High", "risk: Medium"
  │
  ├─► 2. Retrieve Context (Memory Engine)
  │      Queries pgvector memory for "Q2 finance logs" and past audit guidelines.
  │
  ├─► 3. Compile Execution Plan (Reasoning Engine)
  │      Creates a 3-step execution graph:
  │      - Step A: Scrape ledger entries (Developer Agent)
  │      - Step B: Run anomaly detection algorithms (Finance Agent)
  │      - Step C: Check compliance policy compliance (Governance Agent)
  │
  ├─► 4. Verify Policy (Kavacha Guard)
  │      Ensures operations stay within security boundaries.
  │
  ├─► 5. Execute Plan (Execution Engine)
  │      Executes steps in the sandboxed runtime, emitting real-time telemetry.
  │
  ├─► 6. Ledger Cost Attribution (Revenue Engine)
  │      Measures token consumption and charges the tenant's account balance.
  │
  └─► 7. Record History (Analytics)
         Saves results to the vector memory vault and updates agent reliability scores.
```
