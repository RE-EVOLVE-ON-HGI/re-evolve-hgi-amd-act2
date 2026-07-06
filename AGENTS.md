# Specialist Agent Swarm Registry
## Agent Profiles, Roles, and Capability Declarations

Re-Evolve on HGI coordinates a swarm of specialist agents. Each agent supports intent parsing, episodic memory retrieval, sandbox tool usage, self-reflection, and compliance checks.

---

## 1. Specialist Profiles

### 1.1 Orchestrator-Prime
-   **Role**: Lead cognitive engine. Parses goals, classifies intents, and compiles Directed Acyclic Graphs (DAGs).
-   **Skills**: Dynamic task scheduling, load balancing.
-   **Model**: Llama-3-70b-Instruct (AMD ROCm).

### 1.2 ResearchAgent-Alpha
-   **Role**: Semantic searcher. Queries the Memory Vault and conducts web research.
-   **Skills**: Vector chunking, similarity ranking.
-   **Model**: Llama-3-8b (Fireworks).

### 1.3 CodeSynth-v2.3
-   **Role**: Software engineer. Modifies codebase targets inside isolated Panani runtime environments.
-   **Skills**: Multi-file replacement, test diagnostics.
-   **Model**: Llama-3-70b-Instruct (AMD ROCm).

### 1.4 QATester-Agent
-   **Role**: Validation engineer. Executes test harnesses and confirms compile success.
-   **Skills**: Lint checking, Mocha/Jest execution.
-   **Model**: Llama-3-8b (Fireworks).

### 1.5 KavachaAudit-Core
-   **Role**: Security auditor. Checks execution commands and agent actions against compliance logs.
-   **Skills**: Dependency threat scanning.
-   **Model**: Deterministic Policy Engine.

### 1.6 DataMigrationAgent-v2.1
-   **Role**: Database manager. Executes schema updates and migrations.
-   **Skills**: Spanner SQL query executions.
-   **Model**: Llama-3-70b-Instruct.

---

## 2. Integrated Agent Frameworks

We leverage agent design patterns from:
-   **[ECC-HGI](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/ECC-HGI)**: High-performance CLI integrations and 63+ pre-defined specialist agents.
-   **[openclaude-CLI](https://github.com/nextunicorn2026/openclaude-CLI)**: Command-line agent loops.
-   **[awesome-openclaw-agents](https://github.com/nextunicorn2026/awesome-openclaw-agents)**: 162 production-ready agent configurations.
-   **[ruflo](https://github.com/nextunicorn2026/ruflo)**: Dynamic swarm orchestrations.
-   **[goose-hgi-](https://github.com/nextunicorn2026/goose-hgi-)**: Open-source extensible agent workspace executors.
