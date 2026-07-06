# Deployment Guide: Re-Evolve on HGI
## Production Topology and Environment Configuration

This guide details the steps required to deploy Re-Evolve on HGI to production servers.

---

## 1. Optimal Deployment Topology

```
   ┌──────────────────────┐
   │  Next.js Frontend    │ ──► Hosted on Vercel / Cloudflare Pages
   └──────────┬───────────┘
              │ (HTTPS API requests)
              ▼
   ┌──────────────────────┐
   │   NestJS Backend     │ ──► Hosted on Render / Fly.io (Docker environment)
   └──────────┬───────────┘
              ├─────────────────────────┬────────────────────────┐
              ▼                         ▼                        ▼
   ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
   │ PostgreSQL + pgvector│  │     Redis (Cache)    │  │    Qdrant (Vector)   │
   └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

---

## 2. Environment Variables

### 2.1 Backend Config (`backend/.env`):
```env
# Tenancy & DB
DATABASE_URL="postgresql://postgres:<password>@<db-host>:5432/reevolve?sslmode=require"
JWT_SECRET="production-jwt-access-secret-key"

# Queue & Event Broker
REDIS_URL="redis://:<password>@<redis-host>:6379"
KAFKA_BROKERS="localhost:9092"

# LLM Providers
FIREWORKS_API_KEY="your-fireworks-api-key"
AMD_CLOUD_API_KEY="local-rocm-key"
```

### 2.2 Frontend Config (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL="https://your-backend-render-app.onrender.com"
NEXT_PUBLIC_WS_URL="https://your-backend-render-app.onrender.com"
```

---

## 3. Step-by-Step Deployment

### Step 3.1: Deploy Databases
1.  Deploy a managed PostgreSQL database with the **pgvector** extension active.
2.  Deploy a managed Redis instance (v7.2 or later).
3.  Deploy a Qdrant Cloud cluster or host a Docker container.

### Step 3.2: Deploy NestJS Backend (Render)
1.  Create a new Web Service on Render, linking your GitHub repository.
2.  Set the environment to **Docker** (using the root `backend/Dockerfile`).
3.  Configure env variables and expose port `3000`.

### Step 3.3: Deploy Next.js Frontend (Vercel)
1.  Create a new project on Vercel and import the repository.
2.  Set the root directory to `frontend`.
3.  Add the environment variables (`NEXT_PUBLIC_API_URL`) and click **Deploy**.
