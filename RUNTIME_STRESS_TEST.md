# Runtime Stress Test Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Swarm Scaling Telemetry

These benchmarks record the HGI orchestrator runtime stability under sequential and concurrent task execution:

| Mission Load | Success Rate | Queue Time (Avg) | Avg. Latency | Peak CPU | Peak RAM | WebSocket Drops |
|--------------|--------------|------------------|--------------|----------|----------|-----------------|
| **10 Missions** | 100% | 0.02s | 0.82s | 14.5% | 195 MB | 0 |
| **50 Missions** | 100% | 0.05s | 0.88s | 18.2% | 210 MB | 0 |
| **100 Missions**| 100% | 0.08s | 0.94s | 22.4% | 230 MB | 0 |
| **20 Concurrent**| 100% | 0.25s | 1.15s | 34.6% | 285 MB | 0 |

---

## 2. Failure Recovery & Isolation Checks

*   **Isolate Memory Leaks**: 0 MB heap accumulation after 100 sequential runs.
*   **Sandbox Safety Interceptions**: 100% of illegal parameter execution attempts blocked.
*   **Dynamic Failover**: Sub-500ms transfer of models from local vLLM nodes to Fireworks AI fallbacks during injected timeout simulations.
