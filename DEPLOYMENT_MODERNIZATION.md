# DEPLOYMENT MODERNIZATION

This document outlines the modernization strategy to move all deployments exclusively to the native GitHub -> Railway flow.

## 1. Eliminated Legacy Complexity

* **AWS Infrastructure:** Disabled/removed EKS cluster, ECS task definitions, and CodeBuild pipelines.
* **Registry Dependencies:** ECR and custom Docker Hub build/push pipelines are completely retired. In their place, Railway builds images internally directly from the source repository.
* **Deployment Scripts:** Local docker-compose configurations are kept only for local development validation, not production releases.

## 2. Modernized Deployment Pipeline

```
GitHub (Source) -> GitHub Actions (Verification) -> Railway (Internal Build & Deploy)
```

## 3. Reference Updates & Modernization Action Plan

1. **Remove ECR/AWS Actions:** Delete or comment out any step in `.github/workflows/deploy.yml` that attempts to log in to AWS or run ECR/EKS scripts.
2. **Rewrite Runbooks:** Replace references to `aws codebuild` or `kubectl set image` in `BEDROCK_ACTIVATION_RUNBOOK.md` with instructions on Railway CLI (`railway up` or automated Git triggers).
3. **Validate Local Dev:** Ensure standard Docker Compose configs use standard local image builds rather than ECR pulls.
