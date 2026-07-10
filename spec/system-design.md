# System Design Specification

## 1. Component Deep-Dives

### 1.1 CENSA Orchestrator
- **Internal State**: Maintains the current state of the Task DAG and a set of "active" agent contexts.
- **Algorithm**: Uses a modified A* search to determine the most efficient path through the task DAG based on agent confidence scores.
- **Output**: A stream of execution events (Node Started, Node Completed, Node Failed).

### 1.2 Panani X Sandbox
- **Isolation**: Uses `vm.createContext` to create a fresh environment for every tool execution.
- **Bridge**: Implements a limited `bridge` object to allow communication between the sandbox and the host runtime for logging and result reporting.
- **Safety**: All `require` calls are intercepted and restricted to a pre-approved list of modules.

### 1.3 Kavacha Policy Engine
- **Rule Format**: JSON-based policies (e.g., `{ "action": "fs_write", "allow": false, "reason": "restricted_directory" }`).
- **Audit Trail**: Every decision is hashed and stored in a PostgreSQL audit ledger for non-repudiation.

### 1.4 Memory Vault
- **Episodic Memory**: Stores raw logs of every mission step in PostgreSQL.
- **Semantic Memory**: Stores embeddings of key outcomes and learned patterns in Qdrant.
- **Retrieval**: Uses a hybrid RAG approach: Top-K vector search $\rightarrow$ Reranking $\rightarrow$ Context injection.

## 2. Infrastructure Design

### 2.1 Backend Stack
- **Framework**: NestJS (Node.js).
- **Communication**: REST for control, WebSockets for real-time telemetry.
- **Database**: PostgreSQL + pgvector.
- **Cache/Queue**: Redis + BullMQ.

### 2.2 Frontend Stack
- **Framework**: Next.js (React).
- **Styling**: Tailwind CSS.
- **Visualization**: SVG-based DAG rendering and real-time telemetry dashboards.

### 2.3 Compute Routing (AMD Fabric)
- **Gateway**: LiteLLM.
- **Primary Path**: AMD Instinct MI300X cluster running vLLM via ROCm.
- **Fallback Path**: Fireworks AI API.
- **Switching Logic**: Latency-based failover with a 500ms timeout.
