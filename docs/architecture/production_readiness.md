# Re-Evolve V3 — Production Readiness Plan (Project Singularity)

This document specifies the observability standards, Prometheus/Grafana alerts, RTO/RPO limits, and SLO metrics required to operate **Re-Evolve V3 (Project Singularity)** in high-scale production.

---

## 1. Service Level Objectives (SLOs)

To ensure the platform operates at a premium, Linear-level performance tier for 100k+ users, the following Service Level Objectives (SLOs) are enforced:

| Service / Endpoint | SLO Metric | target SLI | Measurement Window |
|---|---|---|---|
| **API Gateway** | Availability | `99.95%` of requests return `2xx` or `3xx` | 30 Days |
| **HGI Intent Router** | p99 Latency | `< 250ms` routing resolution | 30 Days |
| **Agent OS Worker** | Success Rate | `99.9%` task completions (excluding target tool issues) | 7 Days |
| **Skill OS Sandbox** | Isolation Failures | `0` escapes or out-of-boundary runs | Lifetime |
| **Revenue Ledger** | Integrity | `100.0%` financial reconciliation consistency | Continuous |

---

## 2. Disaster Recovery: RTO and RPO Limits

The disaster recovery strategy is modeled around active-passive cross-region configurations as defined in the [ultra_tier_rollout.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/ultra_tier_rollout.md).

```
┌───────────────────────────┬──────────────┬──────────────┬──────────────────────────────────────────┐
│ Component                 │ Max RTO      │ Max RPO      │ Failover / Backup Mechanism              │
├───────────────────────────┼──────────────┼──────────────┼──────────────────────────────────────────┤
│ PostgreSQL DB (Core)      │ 15 Minutes   │ 10 Seconds   │ WAL shipping to warm cross-region replica│
│ pgvector Memory DB        │ 30 Minutes   │ 5 Minutes    │ S3 snapshot recovery + Redis backup sync  │
│ Redis Cache & Flags       │ 5 Minutes    │ 5 Minutes    │ Multi-node Redis Cluster with Sentinel   │
│ Kafka Event Broker        │ 10 Minutes   │ 0 (Zero Loss)│ Triple replication factor (3 brokers)    │
└───────────────────────────┴──────────────┴──────────────┴──────────────────────────────────────────┘
```

*   **RTO (Recovery Time Objective)**: The maximum acceptable delay to restore normal service operations after a component failure.
*   **RPO (Recovery Point Objective)**: The maximum acceptable period of transaction data lost due to a major infrastructure disaster.

---

## 3. Observability Architecture

We implement **OpenTelemetry** across NestJS and Next.js, with metrics collected by **Prometheus** and visualized via **Grafana**.

```
  Next.js Console / NestJS Modules
                │
                ▼ (OpenTelemetry SDK)
        Collector Agent (OTLP)
         ├──► Prometheus (Metrics)
         └──► Grafana Loki (Logs)
                │
                ▼
        Grafana Dashboards ◄── Alertmanager
```

### Metrics Namespace Schema
*   `hgi_intent_duration_seconds`: Histogram tracking the latency of intent resolutions.
*   `hgi_provider_calls_total`: Counter tracking calls by provider (e.g. `google`, `groq`, `cerebras`).
*   `kavacha_shield_verifications_total`: Counter tracking allowed vs. blocked requests.
*   `agent_task_execution_seconds`: Histogram tracking BullMQ processing delays.
*   `sandbox_cpu_throttle_events_total`: Counter tracking CPU threshold limits tripped in Skill OS.

---

## 4. Prometheus Alert Rules Configuration

The following rules must be provisioned in the Prometheus Alertmanager configurations (`/etc/prometheus/alert.rules.yml`):

```yaml
groups:
  - name: ReEvolveV3CoreAlerts
    rules:
      # 1. API Gateway Latency Alert
      - alert: HighApiGatewayLatency
        expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.5
        for: 2m
        labels:
          severity: critical
          tier: v3
        annotations:
          summary: "API Gateway p99 Latency is dangerously high"
          description: "p99 API gateway response times have exceeded 500ms for more than 2 minutes (current value: {{ $value }}s)."

      # 2. HGI Brain Provider Failures
      - alert: HgiBrainProviderFailoverRate
        expr: sum(rate(hgi_provider_calls_total{status="failed"}[5m])) / sum(rate(hgi_provider_calls_total[5m])) * 100 > 5
        for: 1m
        labels:
          severity: warning
          tier: v3
        annotations:
          summary: "HGI Brain Provider error rates spiking"
          description: "More than 5% of AI provider calls are returning errors. Intent Router is executing fallback loops (current value: {{ $value }}%)."

      # 3. Kavacha Block Anomaly (Potential Attack / Capital Leakage)
      - alert: KavachaShieldBlockSpike
        expr: sum(rate(kavacha_shield_verifications_total{status="blocked"}[5m])) > 50
        for: 1m
        labels:
          severity: critical
          tier: v3
        annotations:
          summary: "Kavacha Shield security blocks are spiking"
          description: "Kavacha Shield has blocked over 50 operations in the last minute. This indicates a potential exploit attempt or a bad loop in Agent OS (current value: {{ $value }})."

      # 4. PostgreSQL Connection Pool Exhaustion
      - alert: PostgresPoolExhaustion
        expr: pg_stat_activity_count{state="active"} / pg_settings_max_connections * 100 > 85
        for: 3m
        labels:
          severity: critical
          tier: db
        annotations:
          summary: "PostgreSQL connection pool near exhaustion"
          description: "Active connections are occupying {{ $value }}% of maximum allowed database connections."
```

---

## 5. Incident Response Playbooks

### Playbook A: HGI AI Provider Failure (Groq/Google Downtime)
1.  **Identify**: High error rate alert triggers (`HgiBrainProviderFailoverRate`).
2.  **Verify**: Access the Grafana AI Routing Panel. Identify if failures are isolated to a single provider.
3.  **Remediation**:
    *   If a single provider is down: The scoring engine automatically redirects traffic. Confirm by verifying traffic shifting in Grafana.
    *   If all external LLMs are down: Deploy temporary emergency route configurations to locally hosted NVIDIA NIM servers:
        ```bash
        # Force-update Redis AI Routing overrides to offline NIM local models
        redis-cli -h $REDIS_HOST set config:ai:provider_fallback "nvidia-nim"
        ```

### Playbook B: Kavacha Capital Leakage Lockout
1.  **Identify**: `KavachaShieldBlockSpike` triggers. This indicates multiple transactions have exceeded safety limits (e.g. $500 cap).
2.  **Verify**: Access the logs in Grafana Loki:
    ```query
    {service="governance-service"} |~ "restriction_code"
    ```
3.  **Remediation**:
    *   Inspect if an agent loop is executing redundant actions charging the tenant.
    *   If it is a bug: Issue a temporary freeze command on the specific workspace queue:
        ```bash
        # Freeze queue via BullMQ manager cli
        pnpm --dir /Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend exec ts-node src/common/scripts/freeze-queue.ts --workspaceId=<id>
        ```
    *   Notify the organization administrator using the notification dispatch channel.
