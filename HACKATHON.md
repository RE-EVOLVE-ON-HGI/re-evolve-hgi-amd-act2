# AMD Developer Hackathon Submission: Re-Evolve on HGI
## Act II Submission and Verification Overview

This document summarizes our submission for the AMD Developer Hackathon ACT II.

---

## 1. Submission Overview

Re-Evolve on HGI is an **Agentic Operating System** built to orchestrate specialist swarms on AMD AI Fabric.

### Core Value Proposition:
-   **True OS Architecture**: Translates abstract goals into sandboxed isolate executions under inline policy audits.
-   **Hardware Acceleration**: Integrates with the AMD AI Developer Cloud (MI300X clusters) using ROCm, using vLLM and LiteLLM load balancers.
-   **Token Optimization**: Integrates the `pxpipe` text-to-image token compression paradigm, cutting input tokens on dense contexts by ~68%.

---

## 2. Key Features Showcased

1.  **CENSA Orchestration**: Dynamic 12-stage execution timelines and SVG graph visualization representing real-time system state flows.
2.  **Panani X Sandboxed Isolate execution**: BullMQ task queues, Node isolates, and tool execution logs.
3.  **Kavacha Governance**: In-line policy verification (blocking supply-chain curl/wget actions) and economic transaction billing ledger tracking.
4.  **Memory Vault**: Multi-tiered semantic retrieval graphs utilizing pgvector and Qdrant.
5.  **Multi-Provider Failover Router**: Automatically shifts routing path away from degraded servers to AMD Instinct clusters.
6.  **Judge Mode Tracing Dashboard**: One-click demo representing all 12 stages with latencies, active models, active agents, and confidence scores.
