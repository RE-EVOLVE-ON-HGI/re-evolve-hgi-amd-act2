# Deployment Report
## Production Hosting URLs, Environment Configurations, and SSL Checks

This report registers the production deployments and configurations for the Gold Release.

---

## 1. Active Deployments

-   **Frontend Console**: `https://frontend-alpha-rose-25.vercel.app`
    -   *Hosting Provider*: Vercel.
    -   *SSL status*: Verified active (HTTPS enforced).
-   **Backend REST/GraphQL API**: `https://xb8rdgq6.up.railway.app`
    -   *Hosting Provider*: Render (Docker environment).
    -   *SSL status*: Verified active (HTTPS enforced).

---

## 2. Environment Configuration

### NestJS Backend Environment Variables:
-   `DATABASE_URL`: PostgreSQL connection string with SSL enforced.
-   `JWT_SECRET`: Secure session key.
-   `REDIS_URL`: Managed Redis server connection.
-   `FIREWORKS_API_KEY`: API key mapping.
-   `AMD_CLOUD_API_KEY`: ROCm Instinct cluster endpoints.

### Next.js Frontend Environment Variables:
-   `NEXT_PUBLIC_API_URL`: Points to active Render backend.
-   `NEXT_PUBLIC_WS_URL`: Points to active Render WebSockets stream.

**Status**: **DEPLOYED & ACTIVE**.
