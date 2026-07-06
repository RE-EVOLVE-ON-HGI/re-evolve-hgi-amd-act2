# CENSA Cognitive Orchestration
## Cognitive Intent and Dynamic Task DAG Architecture

CENSA (Cognitive Engine for Neural Swarm Activity) is the nervous system of Re-Evolve on HGI. It translates abstract human goals into structured, executable multi-agent workflows.

---

## 1. Orchestration Lifecycle

1.  **Ingestion**: Receives a raw goal from the developer console or CLI client.
2.  **Intent Classification**: Inspects the goal and classifies it into intents (e.g. `SYSTEM_WORKFLOW_CREATION`, `DATABASE_MIGRATION_DEPLOYMENT`, `FINANCIAL_AUDIT`).
3.  **Dynamic DAG Planning**: Generates an ordered execution sequence. Each step corresponds to a `TaskStage` (ANALYZE, PLAN, EXECUTE, VALIDATE, DELIVER) and requires a specific `AgentType`.
4.  **Security Pre-Scan**: Evaluates the planned graph using Kavacha policies to ensure no infinite loops or illegal operations exist.
5.  **Agent Selection**: Queries the registry to bind the least-loaded agent matching the required capabilities and skills.

---

## 2. Dynamic Planning Example

```typescript
const plan = await CENSA.plan("Audit the databases", "DATABASE_MIGRATION_DEPLOYMENT");
/*
Returns:
[
  { stage: 'ANALYZE', type: 'ANALYTICS', agent: 'SupportArchitect-v1.0' },
  { stage: 'EXECUTE', type: 'EXECUTION', agent: 'DataMigrationAgent-v2.1' },
  { stage: 'VALIDATE', type: 'GOVERNANCE', agent: 'KavachaAudit-Core' },
  { stage: 'DELIVER', type: 'COMMUNICATION', agent: 'System Gateway' }
]
*/
```

---

## 3. Reusable Skills Integration

CENSA draws agent skills from the **[ECC-HGI](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/ECC-HGI)** skill marketplace:
-   `mcp-server-patterns`: Guides agent communication with MCP services.
-   `cost-aware-llm-pipeline`: Helps optimize context token size prior to query dispatch.
-   `verification-loop`: Enforces continuous testing checks.
