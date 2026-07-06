# System Architecture: Re-Evolve on HGI
## The 7-Layer Agentic Operating System Specification

This document details the architectural layers and interactions that define Re-Evolve on HGI.

---

## 1. Architectural Layers

```
   ┌────────────────────────────────────────────────────────┐
   │             Ingress / Dashboard / CLI / SDK            │  (Layer 1)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             CENSA Cognitive Orchestrator               │  (Layer 2)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │              Agent Registry & Specialist Swarms         │  (Layer 3)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │          Panani X Sandboxed Execution Runtime           │  (Layer 4)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │              Kavacha Policy Governance                 │  (Layer 5)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             Memory Vault (pgvector & Qdrant)           │  (Layer 6)
   └───────────────────────────┬────────────────────────────┘
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │        AMD AI Fabric (Instinct MI300X & ROCm)          │  (Layer 7)
   └────────────────────────────────────────────────────────┘
```

---

## 2. Component Explanations

### 2.1 Layer 1: Developer Ingress
Exposes REST, GraphQL, and WebSockets to the client. Developers can trigger goals via the CLI or initialize the TypeScript SDK.

### 2.2 Layer 2: CENSA (Cognitive Orchestration)
Parses the user prompt, determines the Intent (e.g. `CODE`, `AUDIT`, `FINANCE`), compiles a Directed Acyclic Graph (DAG) of execution, and dispatches it.

### 2.3 Layer 3: Agent Swarms
Contains specialised workers (e.g. `DataMigrationAgent`, `CodeSynth`, `KavachaAudit-Core`). The registry assigns tasks to the best candidate matching requested capabilities and skills.

### 2.4 Layer 4: Panani X Sandbox
Executes tool actions inside V8/Node VM isolates, blocking direct access to local hardware networks unless specifically verified.

### 2.5 Layer 5: Kavacha Governance
Enforces security, monitors file dependencies (using Bumblebee signatures), and performs static code analysis (using SkillSpector checks). Evaluates transactions against an economic ledger.

### 2.6 Layer 6: Memory Vault
Maintains semantic queries, episdoic history logs, and system variables in Qdrant and pgvector.

### 2.7 Layer 7: AMD AI Fabric
Routes model inference calls through LiteLLM to Fireworks AI or the AMD AI Developer Cloud (using ROCm-accelerated Instinct MI300X clusters).
