# Re-Evolve V3 — Agent Operating System (Project Singularity)

This document specifies the capabilities, tools, memory access controls, and communication protocols for the 8 foundational agents of **Re-Evolve V3 (Project Singularity)**.

---

## 1. The Foundational Agent Fleet

V3 ships with 8 specialized HGI agents. They are registered under the `AgentType` enum in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) and operate in a collaborative council structure:

```
                               ┌─────────────────┐
                               │  Founder Agent  │ (Council Prime)
                               └────────┬────────┘
                                        │
           ┌──────────────┬─────────────┼─────────────┬──────────────┐
           ▼              ▼             ▼             ▼              ▼
     Research AI       Sales AI     Finance AI   Developer AI   Operations AI
     (Synthesis)      (Outreach)    (Ledgers)    (Sandboxes)     (Containers)
           │              │                                          │
           └──────┬───────┘                                          ▼
                  ▼                                             Marketing AI &
             Content AI                                          Content Agent
```

---

## 2. Agent Configurations and Capabilities

### 2.1 Founder Agent (Council Prime)
*   **Role**: Coordinates the agent council, resolves conflicting plans, and requests final approvals for high-risk operations.
*   **Default LLM Model**: `gemini-1.5-pro-002` (large context for system planning).
*   **Capabilities & Skills**: Intent mapping, budget distribution, and goal evaluation.
*   **Core Tools**: `RouteIntent()`, `ValidateCompliance()`, `ApproveTransaction()`.

### 2.2 Research Agent (Strategic Synthesizer)
*   **Role**: Gathers market insights, summarizes unstructured documents, and crawls competitive datasets.
*   **Capabilities & Skills**: Document parsing, web scraping, and semantic synthesis.
*   **Core Tools**: `WebScrape(url)`, `VectorSearch(query, limit)`, `SummarizeText(content)`.

### 2.3 Sales Agent (Lead Generator)
*   **Role**: Discovers sales prospects, scores leads, and compiles customer relationship records.
*   **Capabilities & Skills**: Contact profiling and outreach scheduling.
*   **Core Tools**: `FindLeads(domain)`, `ScoreLead(profile)`, `UpdateCrmRecord(user_uuid)`.

### 2.4 Marketing Agent (Growth Optimizer)
*   **Role**: Monitors search performance, tracks ARR, and manages SEO profiles.
*   **Capabilities & Skills**: Campaign optimization and key metrics analysis.
*   **Core Tools**: `GetArrMetrics()`, `QueryKeywords()`, `GenerateAdCopy()`.

### 2.5 Finance Agent (Financial Controller)
*   **Role**: Audits company balances, tracks transactional ledgers, and predicts monthly capital flow trends.
*   **Capabilities & Skills**: Double-entry bookkeeping, transaction auditing, and budget planning.
*   **Core Tools**: `VerifyDoubleEntry()`, `ForecastCashFlow()`, `FlagTransactionAnomaly()`.

### 2.6 Developer Agent (Code Builder)
*   **Role**: Generates software updates, runs compilation checks in sandbox VM environments, and reviews PRs.
*   **Capabilities & Skills**: JavaScript/TypeScript creation, lint checks, and sandbox tests.
*   **Core Tools**: `WriteCodeFile(path)`, `ExecuteSandbox()`, `CheckLintErrors()`.

### 2.7 Operations Agent (Atlas Systems Monitor)
*   **Role**: Monitors server containers, monitors database pool connections, and checks system uptime.
*   **Capabilities & Skills**: Docker cluster deployment and resource orchestration.
*   **Core Tools**: `ScaleDeployment(replicas)`, `GetServerMetrics()`, `ProvisionDatabase()`.

### 2.8 Content Agent (Asset Producer)
*   **Role**: Generates marketing copy, creates graphic prompts, and formats documents.
*   **Capabilities & Skills**: Context copywriting and asset layout formatting.
*   **Core Tools**: `FormatMarkdown(raw)`, `GeneratePrompt()`, `CompilePdf()`.

---

## 3. Agent-to-Agent (A2A) Communication Protocol

When agents cooperate on a compiled task DAG, they communicate using an asynchronous protocol backed by Kafka topics and recorded in the database `AgentMessage` table.

```
Agent A (Developer)                          Agent B (Operations)
  │                                            │
  ├─► 1. Publishes agent.task.completed        │
  │      Payload: { codeWritten: "src/..." }   │
  │                                            │
  ├─► 2. Emits A2A message to Kafka topic ────►│ (Kafka consumes message)
  │      "agent.message" channel               │
  │                                            │
  │                                            ├─► 3. Processes request
  │                                            │      Deploys code in sandbox
  │                                            │
  │◄───────────────────────────────────────────┤ 4. Emits status update
  │      Payload: { deploymentStatus: "HEALTHY" }
```

### Kafka Message Payload Format (`agent.message`):
```json
{
  "messageId": "d8b417e8-4682-41ba-ae59-57ef51a70295",
  "fromAgentId": "developer-uuid",
  "toAgentId": "operations-uuid",
  "channel": "a2a",
  "payload": {
    "command": "DEPLOY_SANDBOX",
    "params": {
      "sourceCode": "const a = 1; console.log(a);",
      "environment": "node-22"
    }
  },
  "ts": 1778184920000
}
```
*   **State Store**: Message envelopes are written to the database `agent_messages` table defined in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma#L290-L302) to maintain a complete audit log of agent coordination.
