# Hierarchical Agent Swarm Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Hierarchical Execution Architecture

Re-Evolve on HGI translates executive objectives into governed, sandboxed, multi-agent code completions.

```
                  ┌────────────────────────┐
                  │      Founder Goal      │
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │      CENSA Kernel      │
                  │  (Supreme Orchestrator)│
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │    Mission Planner     │
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │   Dynamic Task DAG     │
                  └───────────┬────────────┘
                              ▼
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Planner Agent │     │ Research Agent│     │ Coding Agent  │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                  ┌────────────────────────┐
                  │   Panani X Sandbox     │
                  │   (Isolate VM Run)     │
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │    Kavacha Governance  │
                  │    (Policy Shields)    │
                  └───────────┬────────────┘
                              ▼
                  ┌────────────────────────┐
                  │   Enterprise Payload   │
                  └────────────────────────┘
```

---

## 2. Specialist Agent Directory

We define **18 specialist agents** occupying persistent slots in our Registry.

### 2.1 Planner Agent
*   **Goal**: Intent classification & goal decomposition.
*   **Skills**: DAG compilation, dependency checking.
*   **Tools**: `censa-planner-compiler`.
*   **Memory Namespace**: `mem:planner`.

### 2.2 Research Agent
*   **Goal**: Context gathering & semantic indexing.
*   **Skills**: Web crawling, documentation parsing.
*   **Tools**: `qdrant-semantic-lookup`.
*   **Memory Namespace**: `mem:research`.

### 2.3 Architecture Agent
*   **Goal**: System layout & component designs.
*   **Skills**: Flow diagramming, contract checking.
*   **Tools**: `arch-model-compiler`.
*   **Memory Namespace**: `mem:architecture`.

### 2.4 Coding Agent
*   **Goal**: Code generation & compilation.
*   **Skills**: Typescript, NestJS, React.
*   **Tools**: `vm-compiler-isolate`.
*   **Memory Namespace**: `mem:coding`.

### 2.5 QA Agent
*   **Goal**: Static analysis & linting.
*   **Skills**: Code coverage, syntax checks.
*   **Tools**: `eslint-linter`.
*   **Memory Namespace**: `mem:qa`.

### 2.6 Testing Agent
*   **Goal**: Integration testing.
*   **Skills**: Jest execution, assertion checking.
*   **Tools**: `jest-test-runner`.
*   **Memory Namespace**: `mem:testing`.

### 2.7 Security Agent
*   **Goal**: Dependency vulnerability audits.
*   **Skills**: Pre-scan argument checking, shell blocking.
*   **Tools**: `kavacha-regex-scanner`.
*   **Memory Namespace**: `mem:security`.

### 2.8 Performance Agent
*   **Goal**: Telemetry tracing & speed audits.
*   **Skills**: Web Vital checks, queue growth latency.
*   **Tools**: `lighthouse-profiler`.
*   **Memory Namespace**: `mem:performance`.

### 2.9 Documentation Agent
*   **Goal**: Technical manuals & outline guides.
*   **Skills**: Markdown parsing, spelling verification.
*   **Tools**: `doc-validator`.
*   **Memory Namespace**: `mem:docs`.

### 2.10 Deployment Agent
*   **Goal**: Containerization & CD validations.
*   **Skills**: Vercel CLI checks, Docker Compose mapping.
*   **Tools**: `vercel-build-deploy`.
*   **Memory Namespace**: `mem:devops`.

### 2.11 UI/UX Agent
*   **Goal**: Frontend token alignment.
*   **Skills**: Glassmorphism panel designs, tailwind config.
*   **Tools**: `tailwind-compiler`.
*   **Memory Namespace**: `mem:ui-ux`.

### 2.12 Runtime Agent
*   **Goal**: BullMQ sandbox execution monitoring.
*   **Skills**: Task timeouts, thread pool audits.
*   **Tools**: `bullmq-monitor`.
*   **Memory Namespace**: `mem:runtime`.

### 2.13 Memory Agent
*   **Goal**: Cross-session index persistence.
*   **Skills**: Vector distance metrics, storage pruning.
*   **Tools**: `postgres-pgvector-pool`.
*   **Memory Namespace**: `mem:memory`.

### 2.14 Governance Agent
*   **Goal**: Compliance audits & economic ledgering.
*   **Skills**: Safe shell validations, resource cost logs.
*   **Tools**: `kavacha-audit-tracker`.
*   **Memory Namespace**: `mem:governance`.

### 2.15 Benchmark Agent
*   **Goal**: Hardware endpoint comparative logging.
*   **Skills**: LLM prompt latency tracking.
*   **Tools**: `latency-monitor`.
*   **Memory Namespace**: `mem:benchmark`.

### 2.16 AMD Integration Agent
*   **Goal**: Instinct MI300X cloud route verification.
*   **Skills**: ROCm PyTorch HIP mapping, LiteLLM bindings.
*   **Tools**: `litellm-proxy-connector`.
*   **Memory Namespace**: `mem:amd`.

### 2.17 Judge Experience Agent
*   **Goal**: Storytelling & flow audits.
*   **Skills**: Keynote transitions, simulation monitoring.
*   **Tools**: `guided-run-tracker`.
*   **Memory Namespace**: `mem:judge`.

### 2.18 Repository Management Agent
*   **Goal**: Code consistency & tag synchronization.
*   **Skills**: Conventional commit validations, tag syncs.
*   **Tools**: `git-client-wrapper`.
*   **Memory Namespace**: `mem:repo`.
