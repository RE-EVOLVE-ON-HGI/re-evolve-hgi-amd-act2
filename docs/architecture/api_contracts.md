# Re-Evolve V3 — API Contracts (Project Singularity)

This document specifies the communication interfaces, REST routes, GraphQL endpoints, and WebSocket payload structures for **Re-Evolve V3**.

---

## 1. REST Endpoints

REST request dispatch routines are centralized in the client helper [api.ts](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/lib/api.ts).

### 1.1 Ingest Telemetry
*   **Route**: `POST /telemetry`
*   **Request Body**:
    ```json
    {
      "orgId": "re-evolve",
      "region": "us-east-1",
      "service": "api-gateway",
      "kind": "METRIC",
      "payload": {
        "value": 142.5,
        "metric": "request_throughput",
        "threshold": 200.0
      }
    }
    ```
*   **Response**: `201 Created` with the telemetry event ID.
*   **Backend Source**: Managed by the telemetry service in [backend/src/modules/telemetry/](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/src/modules/telemetry) and simulated in [backend/src/modules/simulation/](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/src/modules/simulation).

### 1.2 Dispatch Intent Task
*   **Route**: `POST /agents/dispatch`
*   **Request Body**:
    ```json
    {
      "orgId": "re-evolve",
      "goal": "Generate quarterly accounting breakdown and push to Drive",
      "input": {
        "quarter": "Q2-2026",
        "format": "PDF"
      },
      "priority": 5
    }
    ```
*   **Response**:
    ```json
    {
      "orchestrationId": "c8b417e8-4682-41ba-ae59-57ef51a70295",
      "status": "QUEUED"
    }
    ```

---

## 2. GraphQL Schema

Exposed at `/graphql`. Exposes endpoints for the Workspace Galaxy and Agent Foundry.

```graphql
type Agent {
  id: ID!
  name: String!
  type: AgentType!
  status: AgentStatus!
  capacityPct: Float!
  successRate: Float!
  config: JSON!
}

enum AgentType {
  PLANNING
  EXECUTION
  ANALYTICS
  GOVERNANCE
  COMMUNICATION
  LEARNING
}

enum AgentStatus {
  ACTIVE
  IDLE
  TRAINING
  ERROR
  RETIRED
}

type Query {
  agents(orgId: String!): [Agent!]!
  workspaceCapacity(workspaceId: ID!): Float!
}

type Mutation {
  createAgent(name: String!, type: AgentType!, orgId: String!): Agent!
}
```

---

## 3. WebSocket Subscription Payloads (`/realtime` namespace)

Clients subscribe by emitting a `subscribe` event and passing the channel name. These events are processed using the [use-realtime.ts](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/hooks/use-realtime.ts) React hook.

### 3.1 Telemetry Update (`telemetry.event`)
```json
{
  "channel": "telemetry",
  "data": {
    "metric": "cpu_load",
    "value": 62,
    "service": "simulation-engine",
    "region": "us-east-1"
  },
  "ts": 1778184920000
}
```

### 3.2 Agent Task Completed (`agent.task.completed`)
```json
{
  "channel": "agents",
  "data": {
    "agentId": "a9b817e8-4682-41ba-ae59-57ef51a70295",
    "agentName": "MarketIntel-v2.3",
    "success": true,
    "latencyMs": 450,
    "stage": "EXECUTE"
  },
  "ts": 1778184922000
}
```

### 3.3 Revenue Inflow (`economy.transaction`)
```json
{
  "channel": "finance",
  "data": {
    "amountCents": 12500,
    "kind": "royalty",
    "direction": "INFLOW",
    "assetClass": "Model"
  },
  "ts": 1778184924000
}
```
*   **Topic Catalog**: Detailed in the Kafka routing catalog of [service_architecture.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/service_architecture.md#3-event-backbone-catalog-kafka).
