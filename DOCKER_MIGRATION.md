# DOCKER MIGRATION

This document tracks the container registry migration progress, registry options, naming conventions, and rollback procedures for the RE-EVOLVE container ecosystem.

---

## 1. Registry Options & Recommendation

### Option A: GitHub Container Registry (Recommended)
* **Domain:** `ghcr.io`
* **Namespace:** `ghcr.io/re-evolve-on-hgi`
* **Pros:** Highly integrated with your existing GitHub account (`RE-EVOLVE-ON-HGI`), zero-cost private hosting, uses the same auth tokens, and requires no external accounts.
* **Status:** Ready (Authentication verified via active GitHub token scopes).

### Option B: Docker Hub
* **Domain:** `docker.io`
* **Namespace:** `reevolveonhgi` (or `re-evolve-on-hgi` if created as a Docker Hub Org)
* **Pros:** Standard public/private Docker registry.
* **Cons:** Requires a separate `docker login` step using Docker Hub credentials.

---

## 2. Canonical Naming Conventions

| Service | Legacy ECR Reference | Recommended GHCR Reference | Recommended Docker Hub Reference |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-api-gateway` | `ghcr.io/re-evolve-on-hgi/hgi-core-api-gateway` | `reevolveonhgi/hgi-core-api-gateway` |
| **HQ Dashboard** | `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-hq` | `ghcr.io/re-evolve-on-hgi/hgi-core-hq` | `reevolveonhgi/hgi-core-hq` |
| **Web UI** | `987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-web` | `ghcr.io/re-evolve-on-hgi/hgi-core-web` | `reevolveonhgi/hgi-core-web` |

---

## 3. Tagging Strategy
* **Production Releases:** Use semantic versioning matching git tags (e.g. `v6`, `v7`) or specific release commit SHAs.
* **Development/Staging builds:** Use `latest` or branch names (e.g., `main`, `staging`).
* **Multi-Architecture Strategy:** Standardize on `linux/amd64` (used in production EKS/ECS environments) and `linux/arm64` (if running on Apple Silicon locally).

---

## 4. Rollback Procedure
If any deployment using the new registry fails:
1. Revert the Kubernetes deployment or ECS task definition image references back to the legacy ECR URLs:
   ```bash
   kubectl set image deployment/hgi-api-gateway gateway=987569578681.dkr.ecr.us-east-1.amazonaws.com/hgi-core-api-gateway:v6 -n hgi-production
   ```
2. Verify rollout status:
   ```bash
   kubectl rollout status deployment/hgi-api-gateway -n hgi-production
   ```
3. Keep the legacy ECR repositories and images completely intact during the validation phase. Do not delete them until production validation has succeeded.
