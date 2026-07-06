# Guided Demo Script
## Walking Through the Re-Evolve on HGI Visual Tracing Dashboard

This guide walks you through the guided demo scenario implemented inside Re-Evolve.

---

## 1. Visual Walkthrough Sequence

### 1.1 Goal Ingestion & Parsing
1.  Navigate to the **CENSA Cognitive Orchestration** dashboard at `http://localhost:3000/hq/workflows`.
2.  Observe the **Task Dispatch Console** at the top.
3.  Click the **Launch Judge Mode Demo** button on the right.
4.  The system automatically triggers the goal: *"Deploy an audited multi-agent database synchronization service on AMD Instinct GPU cluster"*.

### 1.2 Interactive Step Tracing
-   Watch the **Cinematic Execution Trace** timeline on the left light up.
-   Observe the **Live CENSA Orchestration Graph** nodes on the right transition states:
    -   `User Input` ➔ `Intent Engine` ➔ `Planner` (Classifies intent as `DATABASE_MIGRATION_DEPLOYMENT` and constructs the DAG).
    -   `Task Graph (DAG)` ➔ `Agent Registry` (Binds agents like `DataMigrationAgent` and `KavachaAudit`).
    -   `Memory Vault` (Retrives similarity matches).
    -   `Panani Runtime` (Isolate executes `spanner_execute_sql` tool).
    -   `Kavacha Policy` (Policy engine verifies security and bills the transaction).
    -   `LLM/AMD Infrastructure` (LiteLLM routes the final query).
    -   `Final Response` (Updated state written back to pgvector).

---

## 2. Telemetry and Analytics Indicators

-   **Judge Telemetry Matrix**: Tracks the active model, active agent, active policy, memory status, and confidence percentage at every single execution step.
-   **Explainability Panel**: Appears below the main timeline when the workflow completes, providing a breakdown of intent type, planned steps, reasoning summary, and AMD GPU utilization.
-   **pxpipe Token Compression Console**: Navigate to `/hq/infrastructure` to paste prompts and view simulated vision-token savings.
-   **Failover Simulator**: Click the *Simulate Provider Latency Spike & Failover* button to see Fireworks latency spike and traffic shift to the AMD AI Developer Cloud cluster.
