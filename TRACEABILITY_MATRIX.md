# Traceability Matrix

This matrix maps high-level system requirements to their concrete implementation and verification artifacts.

| Req ID | Feature | Implementation (Files/Modules) | Tests | Documentation | Presentation | Demo |
|---|---|---|---|---|---|---|
| **FR-1** | Goal $\rightarrow$ Intent | `backend/src/modules/agents/orchestration/intent.service.ts` | `intent.spec.ts` | `spec/vision.md` | Slide 4 | Chapter 1 |
| **FR-2** | Task DAG Generation | `backend/src/modules/agents/orchestration/orchestrator.service.ts` | `orchestrator.spec.ts` | `spec/mission-flow.md` | Slide 6 | Chapter 9 |
| **FR-3** | Agent Matching | `backend/src/modules/agents/registry.service.ts` | `registry.spec.ts` | `spec/agent-contracts.md` | Slide 7 | Chapter 9 |
| **FR-4** | Visual DAG Tracking | `frontend/app/hq/workflows/page.tsx` | UI Audit | `spec/system-design.md` | Slide 8 | Chapter 9 |
| **FR-5** | VM Sandboxing | `backend/src/modules/simulation/panani-runtime.service.ts` | `runtime.spec.ts` | `spec/system-design.md` | Slide 10 | Chapter 10 |
| **FR-6** | Execution Timeouts | `backend/src/modules/simulation/panani-runtime.service.ts` | `timeout.spec.ts` | `spec/requirements.md` | Slide 10 | Chapter 10 |
| **FR-7** | Output Streaming | `backend/src/realtime/realtime.gateway.ts` | `socket.spec.ts` | `spec/system-design.md` | Slide 11 | Chapter 9 |
| **FR-8** | Security Scanning | `backend/src/modules/governance/policy.service.ts` | `policy.spec.ts` | `spec/governance.md` | Slide 12 | Chapter 11 |
| **FR-9** | Audit Ledger | `backend/src/modules/governance/audit.service.ts` | `audit.spec.ts` | `spec/governance.md` | Slide 13 | Chapter 11 |
| **FR-10** | Execution Blocking | `backend/src/modules/governance/policy.service.ts` | `block.spec.ts` | `spec/governance.md` | Slide 12 | Chapter 11 |
| **FR-11** | Semantic Search | `backend/src/modules/memory/qdrant.service.ts` | `memory.spec.ts` | `spec/memory-model.md` | Slide 14 | Chapter 12 |
| **FR-12** | pgvector/Qdrant | `backend/src/modules/memory/embeddings.service.ts` | `embedding.spec.ts` | `spec/memory-model.md` | Slide 15 | Chapter 12 |
| **FR-13** | Context Injection | `backend/src/modules/agents/orchestration/orchestrator.service.ts` | `context.spec.ts` | `spec/memory-model.md` | Slide 16 | Chapter 12 |
| **FR-14** | AMD MI300X Routing | `backend/src/modules/model/model.service.ts` | `routing.spec.ts` | `spec/provider-routing.md` | Slide 17 | Chapter 13 |
| **FR-15** | Fireworks Failover | `backend/src/modules/model/model.service.ts` | `failover.spec.ts` | `spec/provider-routing.md` | Slide 18 | Chapter 13 |
