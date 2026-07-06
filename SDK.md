# Developer SDK Reference
## Programmatic Client Interfaces for TypeScript and Python

Re-Evolve on HGI provides unified SDKs to interact with CENSA orchestration and Memory Vault services.

---

## 1. TypeScript SDK

### 1.1 Initialization & Task Dispatch
```typescript
import { HgiClient } from '@re-evolve/sdk';

const hgi = new HgiClient({
  endpoint: 'http://localhost:3000',
  apiKey: 'hgi_dev_secret_key'
});

// Dispatch goal to CENSA orchestrator
const orchestration = await hgi.orchestration.dispatch({
  goal: 'Deploy an audited database synchronization service',
  priority: 5,
  input: { tenantId: 'enterprise-a' }
});

console.log(`Orchestration ID: ${orchestration.id}`);
```

### 1.2 Accessing Memory Vault
```typescript
// Query semantic memories
const matches = await hgi.memory.query({
  query: 'Spanner connection string configuration',
  type: 'SEMANTIC',
  limit: 3
});
```

---

## 2. Python SDK

We leverage the SDK patterns from **[litellm-proxy](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/litellm-proxy)** and **[21st-sdk-hgi](https://github.com/nextunicorn2026/21st-sdk-hgi)** to expose a Python client.

```python
from hgi_sdk import HgiClient

client = HgiClient(endpoint="http://localhost:3000", api_key="hgi_dev_secret_key")

# Dispatch a workflow
response = client.dispatch(
    goal="Audit the financial logs of vertical ARTOIES",
    input_data={"period": "Q2-2026"}
)
```
