# API Reference: Re-Evolve on HGI
## REST Endpoints, GraphQL Schemas, and WebSocket Event API

Re-Evolve on HGI exposes three access protocols to developers and orchestrators: REST APIs, GraphQL endpoints, and WebSockets.

---

## 1. REST Endpoints

### 1.1 `POST /api/v1/orchestrations/dispatch`
Dispatches a workflow goal to the CENSA orchestration engine.
-   **Headers**: `Authorization: Bearer <JWT_TOKEN>`
-   **Request Body**:
    ```json
    {
      "goal": "Audit database sync script",
      "input": { "environment": "staging" }
    }
    ```
-   **Response**:
    ```json
    {
      "id": "ecc2a867-cc33-ae67-abf5-125f9e6a1c77",
      "status": "RUNNING",
      "intent": "DATABASE_MIGRATION_DEPLOYMENT"
    }
    ```

### 1.2 `GET /api/v1/memory/search`
Queries the Memory Vault for semantic matches.
-   **Query Params**: `query=compliance&limit=1`
-   **Response**:
    ```json
    [
      {
        "id": "txn-8472",
        "type": "SEMANTIC",
        "content": "Kavacha Compliance template rules",
        "similarity": 0.93
      }
    ]
    ```

---

## 2. GraphQL Schema

Exposed at `/graphql`.

### Schema Query & Mutation:
```graphql
type Query {
  getOrchestration(id: ID!): Orchestration!
  searchMemory(query: String!, limit: Int): [MemoryResult!]!
}

type Mutation {
  dispatchOrchestration(goal: String!, input: JSON!): Orchestration!
}
```

---

## 3. WebSockets Events

Connected via Socket.io at namespace `/realtime`.

### Emitted from Server:
-   `workflow:state`: Emitted on cinematic workflow transitions.
-   `agent:action`: Emitted on specialist agent status pulses.
-   `infra:failover`: Emitted during infrastructure carrier routing changes.
-   `realtime:metrics`: Cumulative token and cost updates.
