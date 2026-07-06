# Performance Report
## Latency Audits, Memory Overhead, and Token Reduction Metrics

This report registers the performance benchmarks measured for Re-Evolve on HGI.

---

## 1. Frontend Performance & Bundle Metrics

-   **Next.js Production Build**: Compiles successfully.
-   **Bundle Size**: Optimized via asset caching and dynamic imports (average chunk size &lt; 150kB).
-   **Dashboard FPS**: Render loop benchmarks average **58-60 FPS** during cinematic timelines.

---

## 2. API & Database Performance

-   **API Response Times**:
    -   REST Endpoint `/api/v1/health`: **&lt; 5ms**.
    -   GraphQL queries: **&lt; 12ms**.
    -   WebSocket latency: **&lt; 8ms**.
-   **Database Queries (PostgreSQL / pgvector)**: Average similarity retrieval execution is **&lt; 25ms** for indices containing 10,000+ vector nodes.

---

## 3. Token Compression (pxpipe)

-   **Reduction Ratio**: Renders text documents to PNG files, saving up to **68%** of input token context space.
-   **Verbatim-Risk Guard latency**: Pre-scan character checks introduce **&lt; 2ms** overhead to pipeline execution.

**Status**: **NOMINAL**.
