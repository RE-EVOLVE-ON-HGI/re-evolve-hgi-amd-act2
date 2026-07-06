# Developer Quickstart
## Getting Re-Evolve on HGI Up and Running

Follow this quick guide to set up your local development environment.

---

## 1. Prerequisites

Ensure you have the following installed on your machine:
-   Node.js v18 or later
-   pnpm v8 or later
-   PostgreSQL database with `pgvector` extension
-   Redis server (for BullMQ queues)

---

## 2. Setup Guide

### Step 2.1: Clone and Configuration
```bash
git clone https://github.com/nextunicorn2026/RE-EVOLVE-ON-HGI-Os.git
cd RE-EVOLVE-ON-HGI-Os
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials and API keys:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reevolve"
REDIS_URL="redis://localhost:6379"
FIREWORKS_API_KEY="your-fireworks-api-key"
```

### Step 2.2: Setup Backend Database
```bash
cd backend
pnpm install
pnpm run prisma:migrate
pnpm run start:dev
```

### Step 2.3: Start Frontend Mission Control
```bash
cd ../frontend
pnpm install
pnpm run dev
```
Open your browser to [http://localhost:3000](http://localhost:3000).

### Step 2.4: Install CLI client
```bash
cd ../cli
pnpm install
pnpm link --global
hgi status
```
