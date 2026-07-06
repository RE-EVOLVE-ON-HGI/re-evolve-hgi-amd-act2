# Environment Validation Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Frontend Environment Variables (Vercel)

| Variable Name | Required | Configured Value | Status |
|---------------|----------|------------------|--------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | `https://re-evolve-api.onrender.com` | ✅ Validated |

---

## 2. Backend Environment Variables (NestJS)

| Variable Name | Required | Description / Reference | Status |
|---------------|----------|------------------------|--------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | ✅ Validated |
| `REDIS_HOST` | Yes | Redis cache/queue host | ✅ Validated |
| `REDIS_PORT` | Yes | Redis cache/queue port | ✅ Validated |
| `QDRANT_URL` | Yes | Qdrant vector database URL | ✅ Validated |
| `JWT_SECRET` | Yes | Access token signature secret | ✅ Validated |
| `JWT_ACCESS_TTL` | Yes | Access token validity (seconds) | ✅ Validated |
| `JWT_REFRESH_TTL` | Yes | Refresh token validity (seconds) | ✅ Validated |

---

## 3. Optional & Integration Variables

| Variable Name | Description | Status |
|---------------|-------------|--------|
| `FIREWORKS_API_KEY` | Key for Fireworks AI inference fallbacks | ⚠️ Optional (Mocked if absent) |
| `AMD_API_ENDPOINT` | Instinct MI300X cluster endpoint | ⚠️ Optional (Mocked if absent) |
| `KAFKA_BROKERS` | Kafka event stream servers | ⚠️ Optional (Mocked if absent) |

---

## 4. Verification Decision

All core environment variables required for frontend static asset resolution and dynamic routing are verified. Production environment configuration is **ready** for deployment.
