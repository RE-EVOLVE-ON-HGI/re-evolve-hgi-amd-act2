# LEGACY INFRASTRUCTURE AUDIT

This audit provides a comprehensive list of all legacy dependencies, configurations, and scripts related to AWS, ECR, Docker Hub, and retired deployment tools, along with their retired/active status.

---

## 1. Executive Summary
All legacy deployment infrastructure on **AWS (EKS, ECS, CodeBuild, ECR, Route53, S3, SES)** and **Docker Hub** has been retired. The canonical target deployment platform is now **Railway** (native source-to-image build triggers).

---

## 2. Infrastructure Inventory & Classification

| Item Reference | Legacy Scope | Classification | Modernized Replacement / Justification |
| :--- | :--- | :--- | :--- |
| **AWS ECR Registry** | `987569578681.dkr.ecr.us-east-1` | **REMOVE** | Replaced by Railway internal builder. No external image publishing required. |
| **EKS Cluster** | `hgi-core` EKS Cluster | **REMOVE** | Retired. EKS node roles and security groups decommissioned. |
| **ECS Task Definition** | `hgi-core-web` task definitions | **REMOVE** | Retired in favor of Railway web service definition. |
| **AWS CodeBuild** | `hgi-orchestration-build` | **REMOVE** | Retired. S3 deployment code packaging triggers removed. |
| **Route53 DNS** | `re-evolveon.com` DNS records | **REPLACE** | Migrated. `api.re-evolveon.com` successfully points to `xb8rdgq6.up.railway.app` (Railway Edge). |
| **AWS S3 Bucket** | `hgi-deployment-artifacts-*` | **REMOVE** | Retired. Railway pulls source code directly from connected GitHub repositories. |
| **AWS SES** | SMTP transaction mailing | **REPLACE** | Migrated to standard modern SMTP wrapper defined in Railway secrets. |
| **AWS Lambda** | Edge routing functions | **REMOVE** | Ported inline to NestJS API middlewares or handled by edge router. |
| **AWS CloudWatch** | Core performance metrics | **REPLACE** | Migrated to native Railway metrics dashboard and console logging. |
| **AWS Bedrock** | Anthropic model integration | **REPLACE** | Standardized model gateway routed through LLM Gateway (local/remote API keys). |
| **Docker Hub Registry** | `reevolveonhgi/*` images | **RETAIN** | Kept only as a fallback namespace reference (`reevolveonhgi`) for local compose builds. |
| **GitHub Actions** | Legacy AWS push actions | **REMOVE** | Deployed workflows simplified to native Railway triggers. |
| **Legacy Deployment Scripts** | `buildspec.yml`, `deploy.sh` (AWS) | **REMOVE** | Retired. Local compose retained only for staging validation. |
| **Legacy Secrets** | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | **REMOVE** | Decomissioned. Removed from GitHub Actions environment. |
| **Legacy Env Vars** | `ECR_REGISTRY_URL`, `EKS_CLUSTER_NAME` | **REMOVE** | Decomissioned. |

---

## 3. Retired Workflows & Scripts

* **`RE-EVOLVE-ON-HGI-Os/.github/workflows/deploy.yml`**: Verified that no AWS login or ECR push actions are present. All deploy actions invoke `railway up` directly.
* **Deprecation Banner Applied to:**
  * `launch-reports/BEDROCK_ACTIVATION_RUNBOOK.md`
  * `DEPLOYMENT_CHECKLISTS.md`
  * `V6-DOCKER-AND-DEPLOYMENT-PLAN.md`
  * `AWS_EXPORT_REPORT.md`
  * `AWS_INVENTORY_REPORT.md`
  * `docs/HGI_DEPLOYMENT_MAP.md`
  * `PRE_DEPLOYMENT_AUDIT.md`
  * `launch-reports/PRE_DEPLOYMENT_CHECKLIST.md`
  * `launch-reports/DEPLOYMENT_REPORT.md`
  * `launch-reports/DEPLOYMENT_PIPELINE_REPORT.md`
