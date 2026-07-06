# DOCKER INVENTORY

This document provides a comprehensive inventory of all Docker dependencies, image references, registry configurations, and CI/CD pipelines in the RE-EVOLVE ON HGI ecosystem.

---

## 1. Local Dockerfiles

| Repository | Path to Dockerfile | Description |
| :--- | :--- | :--- |
| **`RE-EVOLVE-ON-HGI-Os`** | `apps/api/Dockerfile` | NestJS API Core |
| | `apps/censa-core/Dockerfile` | Frontend UI / Web Client |
| | `apps/hq/Dockerfile` | Next.js HQ Dashboard |
| | `services/governance-service/Dockerfile` | Governance and safety service |
| | `services/memory/Dockerfile` | Long-term memory store |
| | `services/user-hq-backend/Dockerfile` | User HQ backend server |
| | `services/llm-gateway/Dockerfile` | AI model abstraction proxy |
| | `services/agent-registry-service/Dockerfile` | Registry for agent definitions |
| | `services/orchestration-service/Dockerfile` | Core workflow coordinator |
| | `services/voice/Dockerfile` | Voice communication agent |
| | `services/ai-agent-service/Dockerfile` | Autonomous execution agent |
| | `services/orchestration/Dockerfile` | FastAPI LangGraph coordinator (Nexus) |
| | `services/automation/Dockerfile` | Workflow runner |
| | `services/re-evolve-hq-backend/Dockerfile` | Backend for HQ |
| | `services/auth-service/Dockerfile` | Identity and access server |
| | `services/realtime-service/Dockerfile` | WebSocket / sync gateway |
| **`brain-for-HGI-`** | `Dockerfile` | OpenViking Context DB (uv + Rust + Node) |
| | `bot/deploy/docker/Dockerfile` | Vikingbot deployment image |
| | `bot/deploy/Dockerfile` | Vikingbot main image |
| **`re-evolve-on-hgi`** | `services/agents/proton/Dockerfile` | Agent Proton service |
| | `services/agents/neutron/Dockerfile` | Agent Neutron service |
| | `services/agents/electron/Dockerfile` | Agent Electron service |
| **`artoies-hub`** | `Dockerfile` | Next.js production web app |
| **`dify`** | `web/Dockerfile` | Dify frontend app |
| | `api/Dockerfile` | Dify API backend |
| | `docker/couchbase-server/Dockerfile` | Custom couchbase server build |

---

## 2. Docker Compose & Orchestration Configurations

| Repository | Path | Services Defined |
| :--- | :--- | :--- |
| **`RE-EVOLVE-ON-HGI-Os`** | `docker-compose.yml` | `postgres` (pgvector:pg16), `redis` (7-alpine), `etcd0/1/2` (etcd:v3.5.12), `zookeeper` (cp-zookeeper:7.6.0), `kafka` (cp-kafka:7.6.0), `kafka-init`, `api` (build), `orchestration` (build), `hq` (build), `n8n` (n8n:latest) |
| **`brain-for-HGI-`** | `docker-compose.yml` | `openviking` (ghcr.io/volcengine/openviking:latest), `caddy` (caddy:2) |
| | `examples/grafana/docker-compose.yml` | Grafana metrics telemetry |
| | `bot/deploy/docker/langfuse/docker-compose.yml`| Langfuse worker, minio, redis, clickhouse, postgres |
| **`re-evolve-on-hgi`** | `docker-compose.yml` | `postgres` (15-alpine), `redis` (7-alpine), `agent-proton` (build), `agent-neutron` (build), `agent-electron` (build) |
| **`artoies-hub`** | `docker-compose.yml` | `app` (build production target) |
| **`dify`** | `docker/docker-compose.yaml` | dify-api, dify-web, sandbox, pgvector, redis, nginx, etc. |

---

## 3. Legacy Image Registry References

All custom production images were previously published to **AWS ECR** under AWS Account `987569578681`.

* **Registry URL:** `987569578681.dkr.ecr.us-east-1.amazonaws.com`
* **Historical Image Mappings:**
  * `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-api-gateway` (tags: `latest`, `v6`, `v7`)
  * `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-hq` (tags: `latest`, `v6`)
  * `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-web` (tags: `latest`, `v6`, `v5`)

---

## 4. CI/CD & Deployment Configurations

* **`RE-EVOLVE-ON-HGI-Os`**:
  * `.github/workflows/deploy.yml`: Deploys services directly to Railway (`api`, `censa-core`, `nexus` FastAPI) via `railway up` (bypassing public container registries).
  * `DEPLOYMENT_CHECKLISTS.md` / `V6-DOCKER-AND-DEPLOYMENT-PLAN.md`: Reference manuals outlining build, tag, and push steps for AWS ECR.
* **`brain-for-HGI-`**:
  * `bot/deploy/docker/image_upload.sh`: Script to upload vikingbot local image to Volcengine Container Registry (`vikingbot-cn-beijing.cr.volces.com/vikingbot/vikingbot`).
