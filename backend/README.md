# RE-EVOLVE ON HGI — Backend

Adaptive Intelligence Operating System backend. NestJS · TypeScript · PostgreSQL
(+pgvector) · Redis/BullMQ · Kafka · Qdrant · gRPC · GraphQL · WebSockets ·
OpenTelemetry · Docker/Kubernetes.

See **ARCHITECTURE.md** for the full module map and an honest statement of what is
implemented end-to-end vs. scaffolded to the same pattern.

## Quick start
```bash
cp .env.example .env
docker compose up -d postgres redis kafka qdrant
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```
- REST + Swagger: http://localhost:4000/docs
- GraphQL: http://localhost:4000/graphql
- WebSocket: ws://localhost:4000/realtime

## Layout
```
prisma/schema.prisma      complete multi-tenant data model (all domains)
src/common/               config, prisma, kafka, redis, auth (RBAC/ABAC), otel, events
src/realtime/             WebSocket gateway (per-tenant live feeds)
src/modules/agents/       Agent Orchestration — fully wired (queue+kafka+ws)
src/modules/memory/       Memory Vault — embeddings + pgvector + Qdrant
src/modules/workflows/    Workflow Studio — node-graph async engine
src/modules/telemetry/    Global Telemetry Grid — ingest + anomaly + rollup
src/modules/governance/   Governance/Policy rule-evaluation engine
k8s/                      Deployment, Service, HPA, Ingress
proto/hgi.proto           internal gRPC contract
.github/workflows/ci.yml  build + migrate + docker
```
