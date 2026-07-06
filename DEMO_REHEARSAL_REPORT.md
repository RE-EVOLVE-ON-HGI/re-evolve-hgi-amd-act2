# Demo Rehearsal Report
## Complete Evaluator Workflow Verification Logs

This report documents the execution of our judge-focused guided demo workflow.

---

## 1. Guided Scenario Walkthrough Log

*   **Trigger Goal**: *"Deploy an audited database synchronization service"*
*   **Total Duration**: ~24 seconds (cinematic steps throttled to simulate realistic agent reasoning phases).

### Step Execution Timeline:
1.  **CENSA Intent Parsing (0.5s)**: Goal received. Classified intent as `DATABASE_MIGRATION_DEPLOYMENT`.
2.  **DAG Compile (1.0s)**: Generated ordered task plan nodes (`ANALYZE` ➔ `EXECUTE` ➔ `VALIDATE` ➔ `DELIVER`).
3.  **Agent Binding (2.0s)**: Loaded `DataMigrationAgent-v2.1` and `KavachaAudit-Core` from registry.
4.  **Isolate Sandboxing (4.5s)**: Instantiated Node `vm` runtime and executed Spanner SQL commands.
5.  **Governance Auditing (6.0s)**: Intercepted tool call parameters. Evaluated command safety and mapped double-entry cost ledgers.
6.  **Inference Routing (8.0s)**: Dispatched prompts to LiteLLM router (Fireworks AI primary, AMD fallback).
7.  **Final Verification (12.0s)**: Confirmed compilation tests pass and wrote records to pgvector Memory Vault.

---

## 2. Telemetry and Animation Integrity

-   **Dashboard Latencies**: Realtime charts update smoothly via Framer Motion.
-   **Judge Telemetry Matrix**: Displayed all status panels (active agent, policy check, database type, cost, latency) correctly at each stage of execution.
-   **No Dead Frames**: The transition between steps triggers immediate updates in the SVG topology nodes, preventing stale states.

**Status**: **CERTIFIED PASS**.
