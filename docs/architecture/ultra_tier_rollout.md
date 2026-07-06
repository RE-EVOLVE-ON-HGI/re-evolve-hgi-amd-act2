# Re-Evolve V3 — Ultra Tier Rollout Plan (Project Singularity)

This document specifies the rollout phases, data migration plans, and zero-trust onboarding gates for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Zero-Downtime Data Migration from V2

Because V3 introduces a partitioned multi-tenant database with vector index fields, migrating users from the V2 schema requires a zero-downtime, three-stage strategy.

```
V2 Stable Database
  │
  ├─► Stage 1: Dual-Write (Writes go to both V2 and V3 databases)
  │
  ├─► Stage 2: Backfill (Background worker backfills memory vectors using embeddings)
  │
  └─► Stage 3: Cutover (Verify checksums, toggle DNS routes to V3 Gateway)
```

For schema definition, see [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) and its pgvector fields specified in [database_design.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/database_design.md#3-vector-embeddings-schema).

### Backfill memory loader:
A NestJS background worker is dispatched for each migrated workspace:
1.  Pulls episodic chat history logs from V2.
2.  Batches documents to Google's HGI embedding API.
3.  Inserts vectors into `MemoryRecord` table and indexes with pgvector HNSW.
4.  Updates progress status in Redis.

---

## 2. Zero-Trust Access & Credentials

V3 enforces strict zero-trust parameters for all Ultra tier accounts:
*   **Biometric Scanning (MFA)**: Verification of neural fingerprint hash before session issuance.
*   **Ephemeral Token Lifetimes**: Access tokens expire in 15 minutes (900 seconds) to prevent session hijacking.
*   **ABAC Constraints**: Checks requesting IP, geolocation threat score, and time window parameters using **Kavacha Shield** policies outlined in [service_architecture.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/service_architecture.md#4-kavacha-shield-runtime-protection-policies).

---

## 3. Rollout Waves & Cohort Gates

Access is rolled out in scheduled waves to maintain performance and scale. Realtime telemetry logs monitor queue capacities during waves as detailed in [production_readiness.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/production_readiness.md).

### Wave 1: Internal Devs & Red Team (Day 1)
*   **Focus**: Security testing, Kavacha bypass attempts, and stress testing the AI router (Cerebras/Groq).
*   **Scale**: 50 users, 10 workspaces.
*   **Schedule**: Controlled in Phase 10 of the [development_roadmap.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/development_roadmap.md#phase-10-production-cutover--migration).

### Wave 2: Strategic Partners & Alpha Founders (Day 15)
*   **Focus**: Integrates revenue telemetry and custom tool registries.
*   **Scale**: 500 users, 100 workspaces.

### Wave 3: Ultra Tiers (Day 30)
*   **Focus**: Marketplace transactions, live goal tracking, and global billing rollups.
*   **Scale**: 100,000+ users, 10,000+ workspaces.
