# Continuous Integration & Delivery (CI/CD)
## GitHub Actions Pipelines, Linting, Testing, and Security Scanners

This document specifies the automated CI/CD pipeline configured for Re-Evolve on HGI.

---

## 1. Pipeline Topology

Every code contribution triggers an automated workflow verifying the software gates:
1.  **Checkout**: Pulls the code branch.
2.  **Environment Setup**: Configures Node.js and caches pnpm dependencies.
3.  **Lint & Code Quality**: Executes ESLint to check syntax.
4.  **Database Sync**: Runs Prisma client generators.
5.  **Integration Testing**: Executes Jest test suites.
6.  **Dependency Security Audit**: Runs vulnerability checks using Snyk or local Bumblebee rule evaluations.

---

## 2. GitHub Actions YAML Specification

File: `.github/workflows/ci.yml`
```yaml
name: Re-Evolve CI Pipeline

on:
  push:
    branches: [ main, release/* ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-node: '20'
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint Code
        run: pnpm run lint

      - name: Prisma Schema Generate
        run: cd backend && pnpm prisma generate

      - name: Execute Tests
        run: cd backend && pnpm test
```
