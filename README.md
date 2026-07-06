# Re-Evolve on HGI
## Human-Governed Adaptive Intelligence Operating System

Re-Evolve on HGI is a complete, production-grade AI Agent Operating System designed for the AMD Developer Hackathon ACT II. It orchestrates specialists, manages persistent vector memory, enforces real-time governance, and runs containerized tool isolates on AMD hardware infrastructure.

---

## 1. System Topology (7-Layer Stack)

1.  **Ingress / Developer Console**: Command-line interfaces, SDK wrappers, and the Next.js Mission Control dashboard.
2.  **CENSA Cognitive Orchestrator**: The neural planner that parses goals, infers user intent, and generates Task Directed Acyclic Graphs (DAGs).
3.  **Agent Registry**: Specialists loaded dynamically based on required capabilities (e.g. `SupportArchitect`, `CodeSynth`, `KavachaAudit`).
4.  **Panani X Runtime**: High-throughput task worker execution environments utilizing sandboxed isolates.
5.  **Kavacha Governance**: A zero-trust checker that validates tool execution calls, logs audits, and bills agents via an economic ledger.
6.  **Memory Vault**: Multi-tiered memory combining PostgreSQL (pgvector) and Qdrant semantic indices.
7.  **AMD AI Fabric**: Accelerated model serving powered by the AMD AI Developer Cloud (Instinct MI300X clusters), ROCm, and Fireworks AI.

---

## 2. Quick Start (30 Seconds)

### 2.1 Start Backend (NestJS + PostgreSQL)
```bash
cd backend
npm run prisma:migrate
npm run start:dev
```

### 2.2 Start Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Mission Control cockpit.

---

## 3. Integrated Ecosystem Capabilities

Re-Evolve converges the strongest capabilities from the `nextunicorn2026` organization:
-   **[pxpipe-token-cutdown-](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/pxpipe-token-cutdown-)**: Text-to-PNG token compressor. Compresses bulky prompts saving ~68% token input size on dense contexts.
-   **[Autgentication-HGI](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/Autgentication-HGI)**: Multi-tenant OAuth 2.1 / OIDC user security structure.
-   **[Bumblebee-for-Kavacha-](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/Bumblebee-for-Kavacha-)**: Checks tool dependencies for supply-chain compromises.
-   **[SkillSpector-HGI](https://github.com/nextunicorn2026/SkillSpector-HGI)**: Static analysis scanner validating agent skill files.
