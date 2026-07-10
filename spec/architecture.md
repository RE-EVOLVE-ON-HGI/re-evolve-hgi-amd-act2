# System Architecture Specification

## 1. High-Level Topology
Re-Evolve on HGI follows a 7-layer decoupled architecture to ensure that orchestration, execution, governance, and compute are independent concerns.

### Layer 1: Ingress
The entry point for all requests.
- **Interfaces**: REST API, GraphQL, TypeScript SDK, CLI.
- **Responsibility**: Authentication, rate limiting, and goal submission.

### Layer 2: CENSA (Cognitive Orchestrator)
The "brain" of the system.
- **Process**: Goal $\rightarrow$ Intent $\rightarrow$ Task DAG $\rightarrow$ Agent Matching.
- **Key Logic**: Dependency resolution and confidence scoring.

### Layer 3: Agent Registry & Swarms
The specialist library.
- **Logic**: Maps capability tags to specific agent configurations.
- **Swarms**: Groupings of agents for specific domains (e.g., "Engineering", "Media").

### Layer 4: Panani X Runtime
The execution sandbox.
- **Implementation**: Node.js `vm` isolates.
- **Constraints**: No direct FS access, enforced timeouts, resource metering.

### Layer 5: Kavacha Governance
The security shield.
- **Implementation**: Policy-based interceptor.
- **Responsibility**: Input/Output scanning, audit logging, threat blocking.

### Layer 6: Memory Vault
The persistent state.
- **Storage**: PostgreSQL (pgvector) for episodic; Qdrant for semantic.
- **Interface**: Vector retrieval and context injection.

### Layer 7: AMD AI Fabric
The compute substrate.
- **Infrastructure**: AMD Instinct MI300X / ROCm / vLLM.
- **Routing**: LiteLLM gateway for provider-agnostic inference.

## 2. Data Flow (The Mission Lifecycle)
1. **Submission**: User submits goal via SDK/CLI $\rightarrow$ Layer 1.
2. **Planning**: CENSA parses goal, generates DAG $\rightarrow$ Layer 2.
3. **Matching**: Tasks matched to agents in Registry $\rightarrow$ Layer 3.
4. **Governance**: Tool call requested $\rightarrow$ Kavacha scans and approves $\rightarrow$ Layer 5.
5. **Execution**: Approved tool runs in Panani X sandbox $\rightarrow$ Layer 4.
6. **Inference**: Model request routed to AMD Fabric/Fireworks $\rightarrow$ Layer 7.
7. **Persistence**: Outcome stored in Memory Vault $\rightarrow$ Layer 6.
8. **Loop**: CENSA evaluates outcome and proceeds to next DAG node $\rightarrow$ Layer 2.
