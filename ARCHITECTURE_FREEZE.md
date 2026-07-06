# Architecture Freeze: Re-Evolve on HGI
## Hackathon ACT II Release Protocol — Interfaces and System Contracts Locked

This document locks all module boundaries, interfaces, database schemas, and events schemas for the Re-Evolve on HGI release candidate. No architectural changes may occur after approval of this document, except for critical bug fixes.

---

## 1. Locked System Modules

### 1.1 CENSA Cognitive Orchestration
- **Purpose**: Input goal analysis, intent routing, and planning Directed Acyclic Graphs (DAG).
- **Core Contract**: Takes a raw `goal: string`, returns an ordered array of execution steps: `[{ id: string, name: string, agent: string, tools: string[], status: string }]`.

### 1.2 Panani X Runtime Scheduler
- **Purpose**: High-throughput queue processor executing tasks asynchronously.
- **Core Contract**: Resolves queues using BullMQ/Kafka. Runs in sandboxed execution environments using Node context isolates.

### 1.3 Kavacha Governance Engine
- **Purpose**: Pre-execution security audits, billing, and double-entry economic ledger tracking.
- **Core Contract**: Intercepts tool execution requests, audits commands against policy registers, and returns `allowed: boolean`.

### 1.4 Memory Vault (Vector DB)
- **Purpose**: Semantic, episodic, and system memory storage.
- **Core Contract**: Queries PostgreSQL with `pgvector` and Qdrant using vector similarity searches.

---

## 2. Locked Database Schema (Prisma / pgvector)

```prisma
model Memory {
  id        String   @id @default(uuid())
  sessionId String
  type      String   // SEMANTIC | EPISODIC | SYSTEM
  content   String
  embedding Unsupported("vector(1536)")
  metadata  Json
  createdAt DateTime @default(now())
}

model Transaction {
  id        String   @id @default(uuid())
  sessionId String
  agentId   String
  cost      Decimal
  tokens    Int
  action    String
  createdAt DateTime @default(now())
}
```

---

## 3. Locked Real-Time WebSocket Events (`/realtime` namespace)

| Event Name | Payload Shape | Description |
| :--- | :--- | :--- |
| `workflow:state` | `{ step: string, status: string, latency: number, confidence: number }` | Cinematic pipeline state update |
| `agent:action` | `{ agentId: string, action: string, cpu: number, health: number }` | Agent lifecycle node pulse |
| `infra:failover` | `{ provider: string, status: string, backup: string, latency: number }` | Dynamic carrier routing alerts |
| `realtime:metrics` | `{ totalTokens: number, estCost: number, queues: number }` | Main telemetry values |

---

## 4. Locked Agent Capabilities Registry

Every agent in Re-Evolve must satisfy:
```typescript
interface AgentContract {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  skills: string[];
  selfReflection: () => Promise<string>;
}
```
No parallel agent loop formats are allowed.
