# Re-Evolve V3 — Agent OS Architecture (Project Singularity)

This document specifies the unified **Agent OS V3** architecture, outlining sandboxed tool executions, multi-agent communication networks, and memory access control layers.

---

## 1. Unified Agent OS execution Grid

Instead of running agents in a shared server process, V3 separates agents into containerized runtimes and sandbox execution environments.

```
                              Agent OS Core (GKE)
                                       │
                     ┌─────────────────┴─────────────────┐
                     ▼                                   ▼
               Agent Runtime                     Skill Sandbox VM
           (State & Planning)                   (Cloud Run / gRPC)
                   │                                     │
         ┌─────────┴─────────┐                           ├─► Executes script code
         ▼                   ▼                           ├─► Enforces CPU/Memory clamps
    BullMQ Queues       Workspace Memory                 └─► Policy validation
   (Redis Cluster)     (Postgres pgvector)
```

---

## 2. Tool Registry & Skill Sandboxing

All agent skills are registered as declarative tools. When an agent calls a skill (e.g. Scrape lead sheet), the request is verified and executed inside a secure Cloud Run container.

### 2.1 Skill Definition & Matching
Skills are registered using JSON schemas that define capabilities and input parameters.

```json
{
  "name": "execute_javascript",
  "description": "Executes javascript code in a secure sandbox VM and returns stdout.",
  "parameters": {
    "type": "object",
    "properties": {
      "script": {
        "type": "string",
        "description": "The target JS code block to execute."
      }
    },
    "required": ["script"]
  }
}
```

### 2.2 Sandboxing Security Policies
Sandbox executions are restricted to prevent host security compromises:
*   **Timeouts**: Maximum execution runtime is capped at 500ms.
*   **Memory Limit**: VM RAM is restricted to 128MB.
*   **Network Access**: Outbound HTTP requests are blocked unless explicitly authorized by a custom Kavacha policy.

---

## 3. Collaborative Agent-to-Agent (A2A) Messaging

Agents coordinate task execution asynchronously via Kafka event topics. Topic structures are registered in [service_architecture.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/service_architecture.md#3-event-backbone-catalog-kafka).

```
   Orchestrator                    Agent A (Developer)           Agent B (Operations)
        │                                   │                             │
        ├─► 1. Enqueues task via BullMQ ───►│                             │
        │                                   │                             │
        │                                   ├─► 2. Runs script code       │
        │                                   │   in Skill Sandbox          │
        │                                   │                             │
        │                                   ├─► 3. Publishes completed ──►│ (Kafka topic)
        │                                   │   event via Kafka           │
        │                                   │                             │
        │◄──────────────────────────────────┴─────────────────────────────┤ 4. Verifies deploy
        │   Returns consolidated goal output                                   and returns status
```

*   **State Persistence**: All message exchanges are written to the database `AgentMessage` table to maintain a complete history of agent activities.
*   **Dead Letter Queues (DLQ)**: Tasks that fail or time out repeatedly are routed to `agent.task.dlq` to prevent queue blockages.

---

## 4. Multi-Tenant Memory Access Layer

Agents access long-term memory via the Memory Vault service. Access is limited based on workspace permissions:
1.  **Read Path**: Agents query `MemoryRecord` vectors filtered by the active `workspaceId`.
2.  **Write Path**: Chat histories are chunked and embedded in the background, then inserted into the `MemoryRecord` table with active Workspace ownership properties.
