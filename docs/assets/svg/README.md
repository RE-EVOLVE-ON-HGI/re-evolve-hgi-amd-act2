# HGI Architecture Diagram Suite

This directory contains **23 SVG diagrams** documenting the complete HGI (Human-Governed Intelligence) architecture — a 7-layer orchestration stack for enterprise AI agent systems built on AMD Instinct hardware.

---

## Diagram Catalog

### System Architecture (7 Layer Stack)

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`architecture-overview.svg`](architecture-overview.svg) | High-level 7-layer stack: Hardware → Runtime → Orchestration → Governance → Memory → Intelligence → Interface | `packages/*`, `apps/*`, `infra/*` |
| [`system-architecture.svg`](system-architecture.svg) | Detailed layer breakdown with component names, data flows, and technology choices | `packages/censa`, `packages/panani`, `packages/kavacha`, `packages/memory-vault` |
| [`architecture-galaxy.svg`](architecture-galaxy.svg) | Constellation view showing all services, agents, and infrastructure as interconnected stars | All packages + `infra/amd`, `infra/k8s` |

### Orchestration & Intelligence (CENSA)

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`censa.svg`](censa.svg) | CENSA internal pipeline: Intent Classification → DAG Construction → Agent Matching → Confidence Scoring | `packages/censa/src/pipeline.ts`, `packages/censa/src/intent-classifier.ts` |
| [`censa-orchestrator.svg`](censa-orchestrator.svg) | Full orchestration flow: Mission → Intent → DAG → Registry → Swarm → Execute → Memory → Result | `packages/censa/src/orchestrator.ts`, `apps/backend/src/missions/` |
| [`amd-routing.svg`](amd-routing.svg) | Adaptive provider routing: Intent → Semantic Router → Priority Engine (AMD-first) → Budget Guard → Fallback Chain | `packages/censa/src/adaptive-router.ts`, `packages/litellm-gateway/config.yaml` |
| [`provider-routing.svg`](provider-routing.svg) | Unified inference gateway: LiteLLM → CENSA Router → Multi-Provider Pool → Telemetry → Feedback Loop | `packages/litellm-gateway/`, `packages/censa/src/feedback-loop.ts` |

### Runtime & Execution (Panani X)

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`panani-runtime.svg`](panani-runtime.svg) | VM isolate architecture: Compiler → Sandbox → Runtime → Metering → Cleanup | `packages/panani/src/sandbox.ts`, `packages/panani/src/compiler.ts` |
| [`runtime-lifecycle.svg`](runtime-lifecycle.svg) | Execution lifecycle: Submit → Validate → Isolate → Compile → Execute → Stream → Meter → Cleanup | `packages/panani/src/runtime.ts`, `packages/panani/src/metering.ts` |
| [`agent-lifecycle.svg`](agent-lifecycle.svg) | Agent registry → Swarm formation → Execution → Memory integration → Result aggregation | `packages/agents/src/registry.ts`, `packages/agents/src/swarm.ts` |

### Governance & Security (Kavacha)

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`kavacha.svg`](kavacha.svg) | Zero-trust pipeline: Input Scan → OPA Decision → Execution → Output Scan → Audit Ledger | `packages/kavacha/src/scanner.ts`, `packages/kavacha/policies/`, `packages/kavacha/src/ledger.ts` |

### Memory & Knowledge (Memory Vault)

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`memory.svg`](memory.svg) | Dual-store architecture: Episodic (PostgreSQL+pgvector) + Semantic (Qdrant) | `packages/memory-vault/src/episodic.ts`, `packages/memory-vault/src/semantic.ts` |
| [`memory-flow.svg`](memory-flow.svg) | Retrieval pipeline: Query → Embed → Hybrid Search → Rerank → Context Injection | `packages/memory-vault/src/retrieval.ts`, `packages/memory-vault/src/reranker.ts` |

### End-to-End Flows

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`mission-flow.svg`](mission-flow.svg) | Mission execution: CLI/API → CENSA → DAG → Agents → Panani → Kavacha → Memory → Result | `apps/backend/src/missions/`, `apps/cli/src/commands/mission.ts` |
| [`system-flow.svg`](system-flow.svg) | Complete request flow with all 7 layers, observability, and governance checkpoints | All packages + `infra/monitoring/` |

### Infrastructure & Deployment

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`deployment-pipeline.svg`](deployment-pipeline.svg) | CI/CD: GitHub Actions → Turborepo → Multi-arch Docker → Railway (Backend) + Vercel (Frontend) + npm (CLI) | `.github/workflows/*.yml`, `Dockerfile.*`, `railway.json`, `vercel.json` |
| [`enterprise-stack.svg`](enterprise-stack.svg) | Regulated deployment: FedRAMP/HIPAA/SOC2, Air-gap, DR, Supply Chain (SLSA L3) | `infra/terraform/`, `infra/helm/`, `policies/kavacha/` |

### Enterprise Context

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`enterprise-usecases.svg`](enterprise-usecases.svg) | 6 mission archetypes: Regulated Code Review, Incident Response, Threat Hunting, Data Governance, AI Model Governance, Developer Productivity | `apps/backend/src/missions/`, `packages/agents/src/*` |
| [`amd-ecosystem.svg`](amd-ecosystem.svg) | AMD technology alignment: MI300X/MI325X/MI350, ROCm, vLLM, LiteLLM, HIP, RCCL | `infra/amd/`, `packages/litellm-gateway/` |

### Developer Experience

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`developer-journey.svg`](developer-journey.svg) | Four personas: CLI User, SDK Developer, API Consumer, Dashboard Operator | `apps/cli/`, `packages/sdk/`, `apps/frontend/`, `apps/backend/` |
| [`sdk-layers.svg`](sdk-layers.svg) | 6-layer SDK: Transport → Protocol → Contracts → Core → Domain → Integrations | `packages/sdk/src/` |

### Hardware & Strategy

| Diagram | Description | Key Files Referenced |
|---------|-------------|---------------------|
| [`roadmap.svg`](roadmap.svg) | 3-phase roadmap (Q3'24–Q1'26+) + AMD hardware alignment (MI300X → MI325X → MI350 → MI400) | `infra/amd/`, `docs/roadmap.md` |
| [`timeline.svg`](timeline.svg) | Historical milestones and future milestones with AMD hardware releases | `docs/history.md`, `docs/roadmap.md` |

### Branding

| Diagram | Description |
|---------|-------------|
| [`hero-banner.svg`](hero-banner.svg) | Hero banner for documentation landing page |

---

## Visual Design System

All diagrams share a consistent design language:

| Element | Specification |
|---------|---------------|
| **Background** | Dark gradient (`#080D16` → `#0C1522`) with subtle grid pattern |
| **Primary Accent** | Gold/Amber (`#F59E0B` → `#FBBF24`) — AMD brand alignment |
| **Layer Colors** | Blue (Orchestration), Purple (Intelligence), Green (Runtime), Red (Governance), Cyan (Memory), Orange (Hardware) |
| **Cards** | Glassmorphism: `#1E293B`/`#0F172A` gradient, colored borders, glow filters |
| **Typography** | JetBrains Mono (monospace) for technical content, varied weights |
| **Arrows** | Gold gradient with arrowhead markers |
| **Status Indicators** | Green (✓ Done), Yellow (~ In Progress), Red (✗ Blocked), Blue (Info) |

---

## Usage in Documentation

### Markdown Embedding

```markdown
![HGI 7-Layer Architecture](../assets/svg/system-architecture.svg)
```

### HTML Embedding (with fallback)

```html
<picture>
  <source type="image/svg+xml" srcset="../assets/svg/system-architecture.svg" media="(prefers-color-scheme: dark)">
  <img src="../assets/svg/system-architecture.svg" alt="HGI 7-Layer Architecture" width="100%">
</picture>
```

### Responsive Container

```html
<div class="diagram-container">
  <object type="image/svg+xml" data="../assets/svg/system-architecture.svg" class="diagram"></object>
</div>

<style>
.diagram-container { width: 100%; max-width: 1200px; margin: 2rem auto; }
.diagram { width: 100%; height: auto; }
@media (max-width: 768px) {
  .diagram-container { transform: scale(0.75); transform-origin: top center; }
}
</style>
```

---

## Regeneration

Diagrams are hand-authored SVG files. To modify:

1. Edit the `.svg` file directly (XML structure)
2. Or use the diagram generation scripts in `scripts/diagrams/` (if available)
3. Commit changes — they're version controlled alongside docs

**Do not** use raster formats (PNG/JPG) — SVGs scale infinitely, are searchable, and editable.

---

## File Naming Convention

```
{domain}-{view}.svg
 Domains: architecture, censa, panani, kavacha, memory, runtime, agent,
          deployment, enterprise, developer, sdk, amd, roadmap
 Views: overview, galaxy, stack, flow, lifecycle, pipeline, routing,
        usecases, journey, layers, ecosystem, timeline, banner
```

---

## Cross-References

Each diagram footer includes a **key files reference line** linking to source code:

```xml
<text fill="#64748B">
  <tspan fill="#FBBF24">packages/censa/src/adaptive-router.ts</tspan>  ·
  <tspan fill="#FBBF24">packages/litellm-gateway/config.yaml</tspan>  ·
  <tspan fill="#FBBF24">infra/amd/cluster.tf</tspan>
</text>
```

Clickable in IDEs that support `file:line` references (VS Code, JetBrains).

---

## Accessibility

- **High contrast** — WCAG AA compliant on dark backgrounds
- **Semantic structure** — Logical reading order via transform groups
- **Text-based** — All labels are selectable text, not paths
- **Scalable** — No raster elements, infinite zoom without quality loss

---

*Generated as part of HGI AMD Act 2 documentation initiative. Last updated: 2026-07-11*