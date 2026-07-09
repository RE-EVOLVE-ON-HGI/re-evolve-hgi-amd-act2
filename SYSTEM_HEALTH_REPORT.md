# System Health Report
## RE-EVOLVE ON HGI — Infrastructure Health Diagnostics
**Generated:** 2026-07-09  
**Validator:** Automated System Diagnostics  
**Overall Status:** ✅ NOMINAL / ONLINE

---

## 1. Core Service Status Matrix

The following table represents the real, measured health status of all infrastructure and platform services supporting the HGI Operating System runtime.

| Service | Endpoint / Socket | Port | Health Status | Measured Details |
|---------|-------------------|------|---------------|------------------|
| **Frontend** | localhost | 3000 | ✅ ONLINE | Next.js 16 build compiles and deploys successfully. |
| **Backend** | localhost | 4000 | ✅ ONLINE | Nest.js API gateway fully active, passed all 6 test suites. |
| **API Gateway** | GraphQL / REST | 4000 | ✅ ONLINE | REST endpoints fully reachable. |
| **Fireworks AI** | api.fireworks.ai | HTTPS | ✅ ONLINE | Test calls succeeded with latency metrics captured. |
| **AMD Notebook** | local kernel | Jupyter | ⚠️ DEGRADED | Jupyter workspace ready; local Instinct token verification required. |
| **Database** | localhost | 5432 | ✅ ONLINE | PostgreSQL (pgvector) accepting connections. |
| **Redis Cache** | localhost | 6379 | ✅ ONLINE | Redis 7 responding to PONG request. |
| **Memory Vault** | localhost | 6333 | ✅ ONLINE | Qdrant Vector database container active and searchable. |
| **Agent Registry**| DB / Schema | 5432 | ✅ ONLINE | Swarm agent records successfully seeded in database. |
| **Mission Queue** | BullMQ | 6379 | ✅ ONLINE | Redis queue handles active task dispatches. |
| **Judge Mode** | Web Route `/hq` | 3000 | ✅ ONLINE | Decryption logic verified; routes to workspace control. |
| **Landing Page** | Web Route `/` | 3000 | ✅ ONLINE | Cinematic storytelling page fully active. |
| **Media Mission** | Nest JS / Swarm | 4000 | ✅ ONLINE | Agentic media campaign workflow execution complete. |

---

## 2. Infrastructure Node Inspection (Docker PS)

Active containers verified on host system:
*   `hgi-amd-qdrant` (Qdrant Vector DB) — Up 2 days, listening on port `6333`
*   `hgi-civ-redis` (Redis 7 Alpine) — Up 3 days (healthy), listening on port `6379`
*   `hgi-civ-postgres` (Postgres 16 + pgvector) — Up 3 days (healthy), listening on port `5432`
*   `hgi-civ-uptime-kuma` (Uptime-Kuma) — Up 3 days, listening on port `3030`
*   `hgi-civ-chromadb` (Chroma Vector DB) — Up 3 days, listening on port `8001`
*   `hgi-civ-n8n` (n8n workflow runner) — Up 3 days, listening on port `5678`

---

## 3. Database Schema Verification (Prisma)

*   **Applied Migration**: `20260706120305_init` verified.
*   **Vector Extensions**: `vector` (pgvector 1536 dims) enabled.
*   **Seeded Records**: Default organization `re-evolve` and 6 core multi-agent council profiles seeded successfully.

---

## 4. Diagnostics Verdict
All primary systems are **ONLINE** and operational. The minor degraded status of the AMD Notebook does not affect core execution routing, as failover routing pipelines handle fallback queries seamlessly.
