# System Requirements Specification

## 1. Functional Requirements

### 1.1 Orchestration (CENSA)
- **FR-1**: The system must parse natural language goals into a machine-readable Intent.
- **FR-2**: The system must generate a Task DAG with dependency resolution for complex goals.
- **FR-3**: The system must match task requirements to Agent capabilities in the Registry.
- **FR-4**: The system must provide real-time visual tracking of DAG execution.

### 1.2 Execution Runtime (Panani X)
- **FR-5**: All tool calls must execute in a Node.js `vm` sandbox.
- **FR-6**: The runtime must enforce strict execution timeouts per tool call.
- **FR-7**: The runtime must stream tool outputs back to the orchestrator in real-time.

### 1.3 Governance (Kavacha)
- **FR-8**: Every tool call must be scanned against a defined set of security policies.
- **FR-9**: The system must maintain an immutable audit log of all tool executions.
- **FR-10**: The governance layer must be capable of blocking execution if a policy violation is detected.

### 1.4 Memory (Memory Vault)
- **FR-11**: The system must support semantic search over long-term episodic history.
- **FR-12**: The system must store and retrieve embeddings using pgvector/Qdrant.
- **FR-13**: The system must allow the orchestrator to inject relevant memories into the agent's context window.

### 1.5 Hardware Routing (AMD AI Fabric)
- **FR-14**: The system must support routing to AMD Instinct MI300X clusters via ROCm/vLLM.
- **FR-15**: The system must implement a failover mechanism to Fireworks AI with <500ms latency.

## 2. Non-Functional Requirements

### 2.1 Performance
- **NFR-1**: Orchestration overhead (CENSA parsing) must be < 2 seconds for standard goals.
- **NFR-2**: Memory retrieval latency must be < 200ms.

### 2.2 Security
- **NFR-3**: Zero-Trust architecture: no tool has access to the host filesystem by default.
- **NFR-4**: All API communications must be authenticated via JWT/Passport.

### 2.3 Scalability
- **NFR-5**: The system must support concurrent execution of multiple independent Missions.
- **NFR-6**: The Agent Registry must be extensible to allow adding new specialist agents without system restarts.
