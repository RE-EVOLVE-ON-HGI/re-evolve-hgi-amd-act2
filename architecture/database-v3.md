# Re-Evolve V3 — Database Architecture (Project Singularity)

This document specifies the PostgreSQL 16 database layout, Row-Level Security (RLS) configurations, pgvector settings, and partitioning strategies for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Relational & Vector Schema Models

The core data models are declared in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma), combining multi-tenant relational tables with `pgvector` memory extensions:

```prisma
// schema.prisma snippet
model MemoryRecord {
  id          String   @id @default(uuid())
  orgId       String
  kind        MemoryKind
  content     String
  summary     String?
  // pgvector extension column
  embedding   Unsupported("vector(1536)")?
  vectorRef   String?                          
  retention   RetentionTier @default(WARM)
  createdAt   DateTime @default(now())
}
```

---

## 2. Row-Level Security (RLS) Isolation

To prevent cross-tenant data leaks, all tables representing tenant assets are protected by PostgreSQL RLS policies matching the active connection context:

```sql
-- Enable Row-Level Security on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_records ENABLE ROW LEVEL SECURITY;

-- Define tenant isolation policy matching orgId context
CREATE POLICY tenant_isolation_policy ON memory_records
    FOR ALL
    USING (org_id = current_setting('app.current_org_id'));
```

### RLS Context Injection (NestJS Middleware):
On every incoming REST or GraphQL request, the API Gateway retrieves the tenant's `orgId` from the JWT token and sets it in the active database transaction context:

```ts
// Prisma connection context setting
await prisma.$executeRawUnsafe(
  `SET LOCAL app.current_org_id = '${user.orgId}';`
);
```

---

## 3. pgvector Indexing Rules (HNSW)

To keep memory query latency under 10ms at scale, we use **HNSW** (Hierarchical Navigable Small World) indexes over cosine distance:

```sql
CREATE INDEX memory_hnsw_idx ON memory_records 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```

### Composite Scoping Index:
Queries must use composite indexes to filter by organization before performing vector comparisons:
```sql
CREATE INDEX idx_memory_composite ON memory_records (org_id, kind, created_at DESC);
```

---

## 4. Telemetry Time-Series Partitioning

To prevent index bloat on high-volume tables, `telemetry_events` and `api_traffic` tables are partitioned by month:

```sql
CREATE TABLE telemetry_events (
    id UUID NOT NULL,
    org_id VARCHAR(50) NOT NULL,
    service VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    ts TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id, ts)
) PARTITION BY RANGE (ts);

-- Pre-creating monthly partition tables for Q3 2026
CREATE TABLE telemetry_y2026m07 PARTITION OF telemetry_events
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');
```
