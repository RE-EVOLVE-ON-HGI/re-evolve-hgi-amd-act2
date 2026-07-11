# Deployment Specification

## 1. Production Environment
The HGI stack is deployed as a distributed set of services to ensure high availability and scalability.

### 1.1 Frontend (Vercel)
- **Framework**: Next.js.
- **Domain**: `frontend-teal-eta-x4jumavddh.vercel.app`.
- **CI/CD**: Automatic deployments from the `main` branch.

### 1.2 Backend (Vercel)
- **Framework**: NestJS (serverless).
- **Domain**: `backend-seven-puce-67.vercel.app`.
- **Health Endpoint**: `/api/health`.

### 1.3 Compute Layer (AMD AI Fabric)
- **Local**: ROCm vLLM running on AMD Instinct MI300X.
- **Cloud**: Fireworks AI API.
- **Abstraction**: LiteLLM gateway for unified request formatting.

## 2. Deployment Pipeline
1. **Build**: TypeScript compilation $\rightarrow$ NestJS Dist $\rightarrow$ Next.js Build.
2. **Verify**: Run integration tests against a staging DB.
3. **Deploy**: Parallel deployment to Vercel (Frontend) and Railway (Backend).
4. **Health Check**: Automated ping of `/health` and `/readiness` endpoints.

## 3. Scaling Strategy
- **Horizontal Scaling**: Backend services are scaled via Railway replica sets.
- **Compute Scaling**: Additional vLLM instances are added to the AMD Fabric cluster as demand increases.
- **Memory Scaling**: Qdrant clusters are sharded across multiple nodes for large semantic datasets.
