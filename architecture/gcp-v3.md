# Re-Evolve V3 — Google Cloud Native Infrastructure (Project Singularity)

This document specifies the target architecture, scaling strategies, disaster recovery workflows, and cost optimizations for deploying **Re-Evolve V3 (Project Singularity)** on Google Cloud.

---

## 1. Google Cloud Service Map

V3 is designed to run natively on Google Cloud services to ensure high availability, security, and low latency.

```
                                  Cloud Load Balancing
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼ (Edge Routing)                              ▼ (Serverless sandboxing)
                GKE Cluster                                   Cloud Run Nodes
        ├── API Gateway Service                       └── Skill OS executions
        ├── Agent OS orchestrators                        (Isolated runtimes)
        └── Governance engines
                    │                                             │
         ┌──────────┴──────────┬──────────────────────────────────┤
         ▼                     ▼                                  ▼
    Cloud SQL             Memorystore                        Vertex AI
  (PostgreSQL + pgvector) (Redis / BullMQ)                (Embeddings / Reasoning)
         │                     │                                  │
         ▼                     ▼                                  ▼
     Cloud Storage (Backups / static assets)          BigQuery (Historical analytics)
```

### 1.1 Google Kubernetes Engine (GKE) Autopilot
*   **Purpose**: Manages long-lived microservices (Gateway, Agent OS, Governance, and Telemetry).
*   **Benefits**: Autopilot manages cluster provisioning and scales pods automatically based on CPU and memory limits.

### 1.2 Cloud Run
*   **Purpose**: Runs isolated, short-lived skill executions (Skill OS).
*   **Benefits**: Scales from 0 to 1000+ instances instantly, ensuring resource isolation and minimizing cold standby costs.

### 1.3 Cloud SQL (PostgreSQL 16)
*   **Purpose**: Stores relational data models and pgvector memory embeddings.
*   **Benefits**: Fully managed database with automatic security patching and built-in cross-region read replicas.

### 1.4 Memorystore for Redis
*   **Purpose**: Caches tenant feature flags and manages BullMQ task queues.

### 1.5 Vertex AI (Model Garden & Vector Search)
*   **Purpose**: Generates semantic embeddings and routes high-context reasoning prompts to Gemini models.

### 1.6 BigQuery
*   **Purpose**: Ingests high-volume Kafka telemetry event logs for historical analytics.

---

## 2. Autoscaling & Scale-Out Strategy

*   **Horizontal Pod Autoscaler (HPA)**: Pods in GKE scale up when CPU utilization exceeds 75% or memory usage passes 80%:
    ```yaml
    apiVersion: autoscaling/v2
    kind: HorizontalPodAutoscaler
    metadata:
      name: agent-os-hpa
    spec:
      scaleTargetRef:
        apiVersion: apps/v1
        kind: Deployment
        name: agent-os-service
      minReplicas: 3
      maxReplicas: 30
      metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 75
    ```
*   **Cloud Run Autoscaling**: Scale parameters are configured to support up to 1,000 concurrent sandbox workers:
    ```bash
    gcloud run deploy skill-os-sandbox \
      --image=gcr.io/re-evolve/skill-sandbox:latest \
      --min-instances=0 \
      --max-instances=1000 \
      --concurrency=10
    ```

---

## 3. Disaster Recovery & Replication

V3 enforces an **Active-Passive Multi-Region** strategy to satisfy enterprise RTO and RPO requirements.

```
   Primary Region (us-central1)                  Standby Region (us-east1)
   ┌───────────────────────────┐                  ┌───────────────────────────┐
   │ Cloud SQL Primary DB      ├─► Replication ──►│ Cloud SQL Read Replica    │
   │                           │   (Lag < 5s)     │                           │
   │ Memorystore Primary       │                  │ Memorystore Standby       │
   │ GKE Active Services       │                  │ GKE Cold standby          │
   └─────────────┬─────────────┘                  └───────────────────────────┘
                 │
                 ▼
          Cloud Storage (Backups bucket, replicated multi-region)
```

*   **Database Replication**: Cloud SQL ships Write-Ahead Logs (WAL) continuously to the standby region.
*   **Failover Protocol**: If the primary region goes offline, DNS routes are dynamically re-routed to the standby region using Google Cloud DNS policies. GKE containers in the standby region are scaled up to handle the active load.
*   **Target Metrics**:
    *   **Core DB**: RTO = 15 minutes, RPO = 10 seconds.
    *   **Memory Records**: RTO = 30 minutes, RPO = 5 minutes.

---

## 4. Cost Optimization Strategy

To support 100,000+ users efficiently, V3 implements several cloud cost controls:
*   **Down-Scaling Sandboxes**: Cloud Run min-instances is set to `0`. If there are no active agent tasks, sandbox compute costs drop to zero.
*   **GKE Autopilot Commitments**: Standard microservices use committed-use discounts (CUDs) to save up to 45% on base CPU/memory costs.
*   **Time-Series BigQuery Storage**: Telemetry logs older than 90 days are transitioned to long-term storage tables, cutting BigQuery storage costs in half.
