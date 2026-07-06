# HGI Ecosystem Audit: nextunicorn2026
## AMD Developer Hackathon ACT II — Reusable Capabilities Matrix

This document maps out the available engineering assets under the **nextunicorn2026** GitHub organization. We treat every repository as a reusable component or service to avoid duplication and optimize Re-Evolve on HGI.

---

## 1. Key Repositories & Reusable Assets

| Repository | Purpose | Reusable Components | Tech Stack | Integration Priority | Technical Debt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[RE-EVOLVE-ON-HGI-Os](https://github.com/nextunicorn2026/RE-EVOLVE-ON-HGI-Os)** | Core AI Agent Operating System | CENSA orchestrator, Panani X runtime scheduler, Memory Vault database schema, Kavacha governance | NestJS, Next.js, Prisma, Kafka, Redis | **CRITICAL (Primary Platform)** | Core scheduler needs more structured capability mapping. |
| **[pxpipe-token-cutdown-](https://github.com/nextunicorn2026/pxpipe-token-cutdown-)** | Text-to-PNG token compressor | `transformAnthropicMessages` API, `renderTextToImages` layout canvas, verbatim-risk checking rules | TypeScript, Node, Canvas, Wrangler | **HIGH (Token Optimization)** | OCR substitutions on Opus model are degraded; solved by strict Fable-5 routing. |
| **[Autgentication-HGI](https://github.com/nextunicorn2026/Autgentication-HGI)** | Multi-tenant OIDC/OAuth SSO Auth | OAuth 2.1 authorization servers, RBAC/ABAC middleware policies | Node, TypeScript, Docker | **MEDIUM (Security)** | Requires custom OAuth provider bindings inside NestJS auth guards. |
| **[LLM-models-HGI](https://github.com/nextunicorn2026/LLM-models-HGI)** | AI Gateway & Provider Router | smart fallbacks, multi-provider aggregator, Caveman token compression | TypeScript, Express | **MEDIUM (Infrastructure)** | Overlaps with LiteLLM routing; unified via unified LiteLLM router configs. |
| **[litellm-proxy](https://github.com/nextunicorn2026/litellm-proxy)** | Python API Proxy | Model load balancing, OpenAI-compatible proxy, cost logging | Python, FastAPI | **HIGH (Infrastructure)** | Managed in separate containers; integrated using unified API endpoints. |
| **[VulnClaw-for-kavacha-](https://github.com/nextunicorn2026/VulnClaw-for-kavacha-)** | Pentest & Vulnerability Scanner | Vulnerability discovery workflows, MCP scan tools | Python, MCP, LLM | **MEDIUM (Governance Security)** | Heavy reliance on external security lists; needs local DB caching. |
| **[Bumblebee-for-Kavacha-](https://github.com/nextunicorn2026/Bumblebee-for-Kavacha-)** | Package Supply-Chain Audit | Extension and developer-tool endpoint scanner, IoC databases | Python, Shell | **MEDIUM (Governance Security)** | Requires regular IoC signature updates. |
| **[SkillSpector-HGI](https://github.com/nextunicorn2026/SkillSpector-HGI)** | Skill security parser | Static scan rules for YAML manifests, file access check filters | TypeScript, Node | **HIGH (Safety Validation)** | Integrated directly into Kavacha check loops before agent load. |
| **[brain-for-HGI-](https://github.com/nextunicorn2026/brain-for-HGI-)** | OpenViking Context Database | Hierarchical context delivery pipelines, state serializers | Rust, SQLite | **HIGH (Memory System)** | Bindings are Rust-native; accessed via gRPC microservice. |
| **[ECC-HGI](https://github.com/nextunicorn2026/ECC-HGI)** | Harness Performance System | 251 skills, 63 agents, 79 command shims (CLI helpers) | JavaScript, Shell, Python | **HIGH (Skill Assets)** | Large repository surface; components must be lazy-loaded on request. |
| **[loop-engineering-HGi](https://github.com/nextunicorn2026/loop-engineering-HGi)** | Prompt & Loop Auditing | `loop-audit` and `loop-cost` command templates | JavaScript, Node | **MEDIUM (Performance)** | Relies on manual configuration; automated via telemetry metrics. |

---

## 2. Shared Domain Modules

*   **Trading Swarms**: `OpenAlice-HGI`, `crypto-trading-HGI`, `AutoHedge-hgi-`, `Vibe-Trading-hgi-`, and `TradingAgents-hgi` share financial analysis skills. We leverage their prompt templates inside the CENSA finance agent logic.
*   **Media Production Swarms**: `video-generation-hgi`, `OpenCut-HGI`, `HunyuanVideo-hgi`, and `MoneyPrinterTurbo-HGI` provide video synthesis pipelines.
*   **Knowledge extraction**: `MinerU-HGI` and `markitdown-Hgi-` parse PDFs/Office files into markdown for RAG. We utilize these libraries inside the Memory Vault chunking service.

---

## 3. Convergence Integration Plan

1.  **Orchestrator**: Upgrade Re-Evolve's scheduler capability routing using the `ECC-HGI` agent definition templates.
2.  **Memory**: Access hierarchical contexts from `brain-for-HGI-` (OpenViking) to enrich Memory Vault retrievals.
3.  **Governance**: Run `SkillSpector-HGI` static checks on loaded agents.
4.  **Token Compression**: Run `pxpipe-token-cutdown-` proxy logic for token compression on dense contexts.
