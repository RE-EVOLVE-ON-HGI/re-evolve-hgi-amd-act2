# Installation Prerequisites
## Software Requirements, Database Drivers, and Docker Mappings

This guide lists the detailed environment prerequisites required to host Re-Evolve on HGI.

---

## 1. System Dependencies

| Component | Minimum Version | Recommended Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.0.0 | v20.12.0 | Backend runtime and CLI execution |
| **pnpm** | v8.0.0 | v10.21.0 | Package manager |
| **PostgreSQL** | v14.0 | v16.0 | Primary transactional database |
| **pgvector** | v0.4.0 | v0.5.1 | Vector similarity memory embeddings |
| **Redis** | v6.0 | v7.2 | BullMQ queue scheduling |
| **Kafka** | v3.0 | v3.5 | Dashboard event publishing |

---

## 2. Docker Compose Environment

We provide a `docker-compose.yml` to spin up dependencies:
```yaml
version: '3.8'
services:
  postgres:
    image: ankane/pgvector:latest
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: reevolve
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:7.3.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
```

Start the containers:
```bash
docker-compose up -d
```
