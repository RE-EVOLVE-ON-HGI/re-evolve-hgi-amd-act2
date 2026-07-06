# Panani X Runtime Monitor
## Sandboxed Tool Execution and Asynchronous Queue Processing

Panani X is the execution engine of Re-Evolve on HGI. It runs specialist agent tools inside isolated developer containers, protecting the host system from unverified code.

---

## 1. Asynchronous Queue Processing

Panani X schedules tasks using a dual-broker architecture:
-   **BullMQ (Redis)**: Manages local task queue depths and retries.
-   **Kafka**: Publishes event streams (`AgentTaskCreated`, `AgentTaskCompleted`) to synchronize the live developer dashboard.

---

## 2. Sandbox Isolation (Isolate Runtimes)

Tools (e.g. `execute_tests`, `create_repository`, `spanner_execute_sql`) execute inside Node `vm` isolates:
-   **Blocked Imports**: Agents cannot import native Node filesystem (`fs`) or network (`net`) modules directly.
-   **Exposed APIs**: Only explicitly registered, governed tools are exposed inside the container.
-   **Execution Limits**: Code is throttled by CPU usage and execution duration timeouts.

```typescript
import * as vm from 'vm';

const context = vm.createContext({
  execute_tool: async (name: string, args: any) => {
    // Intercepted and checked against Kavacha governance rules
    return await Kavacha.verifyAndRun(name, args);
  }
});
```

---

## 3. Telemetry Integration

The Panani X runtime streams execution latencies and queue status to the dashboard via WebSockets, allowing judges to monitor queue rates in real time.
