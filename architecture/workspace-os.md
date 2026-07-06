# Re-Evolve V3 — Workspace Operating System (Project Singularity)

This document specifies the workspace types, multi-tenant isolation patterns, shared memory systems, and resource limits for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Workspace Tier Architecture

V3 structures workspaces to match organization growth, implementing partition limits at the database and memory levels.

```
                  ┌────────────────────────────────────────┐
                  │          Enterprise Workspace          │
                  │   (Multi-Region, Active-Active, RLS)    │
                  └───────────────────┬────────────────────┘
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            Agency Workspace            │
                  │   (Isolated Tenant Nodes, Multi-Org)    │
                  └───────────────────┬────────────────────┘
                                      ▼
                  ┌────────────────────────────────────────┐
                  │           Startup Workspace            │
                  │   (Shared Memory, Collaborative Agent)  │
                  └───────────────────┬────────────────────┘
                                      ▼
                  ┌────────────────────────────────────────┐
                  │           Personal Workspace           │
                  │   (Single Tenant, Local Sandboxing)    │
                  └────────────────────────────────────────┘
```

### 1.1 Personal Workspace
*   **Target**: Individual creators and developers.
*   **Scale**: 1 active user, 1 workspace.
*   **Capabilities**: Basic intent resolution, local sandboxed execution, and single-agent memory vault.

### 1.2 Startup Workspace
*   **Target**: Growing teams and early startups.
*   **Scale**: Up to 10 users, 3 workspaces.
*   **Capabilities**: Shared vector memory vault, collaborative agents (A2A), and basic billing limits.

### 1.3 Agency Workspace
*   **Target**: Service providers managing multiple clients.
*   **Scale**: Unlimited users, parent-child workspace hierarchy.
*   **Capabilities**: Strict isolation between client data rooms, shared agency templates, and customizable team resources.

### 1.4 Enterprise Workspace
*   **Target**: Large-scale corporations and global enterprises.
*   **Scale**: Unlimited users, multi-region database replication.
*   **Capabilities**: Zero-trust access controls, neural fingerprint MFA checks, compliance audits, and custom Kavacha policy configurations.

---

## 2. Multi-Tenant Memory & Data Isolation

To prevent data leakage, workspaces enforce strict isolation policies at both relational and vector levels.

```
                    Incoming Query / Workspace Context
                                    │
                                    ▼
                     Row-Level Security (RLS) Check
             "current_setting('app.current_workspace_id')"
                                    │
                    ┌───────────────┴───────────────┐
                    ▼ (Authorized)                  ▼ (Denied)
           Query Execution Context           Security Exception
        ├── Filters memory_records table      └── Logs violation to Kavacha
        │   by orgId and workspaceId.
        └── Limits pgvector search to HNSW
            index within the tenant.
```

### 2.1 pgvector Index Scoping
Because vector search operations (`pgvector` HNSW indexes) can bypass standard relational joins, queries must explicitly scope searches using composite filters:

```sql
-- Scoped Vector Query with Workspace Isolation
SELECT id, content, summary, 
       (embedding <=> current_setting('app.target_query_vector')::vector) as distance
FROM memory_records
WHERE org_id = current_setting('app.current_org_id')
  AND (agent_id IS NULL OR agent_id IN (SELECT id FROM agents WHERE org_id = current_setting('app.current_org_id')))
ORDER BY distance ASC
LIMIT 5;
```

---

## 3. Shared Workspace Features

Workspaces orchestrate resources using five integrated subsystems:
1.  **Shared Memory Vault**: Keeps a shared context of workspace activities. Features automated retention categorization (HOT, WARM, COLD) to optimize performance.
2.  **Goal Tracking**: Monitors active intent paths and computes DAG execution graphs.
3.  **Project Assets**: Keeps track of file attachments, codebase mappings, and external API connectors.
4.  **Agent Allocation**: Manages active agents deployed to the workspace, tracking their CPU and memory usage.
5.  **Telemetry Analytics**: Generates real-time rollups of ARR, transaction counts, and compliance violations.
