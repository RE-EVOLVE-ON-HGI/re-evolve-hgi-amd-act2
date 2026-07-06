# Release Candidate Checklist
## Release Verification Gates for Re-Evolve on HGI

This checklist specifies the mandatory verification gates required to certify Re-Evolve on HGI as a stable release candidate.

---

## 1. Quality Gates Status

-   [x] **Audit Phase**: completed ecosystem mapping.
-   [x] **Architecture Freeze**: frozen all schemas and Socket.io endpoints.
-   [x] **Skill Evolution**: documented ROCm and multi-agent system principles.
-   [x] **Orchestrator Convergence**: integrated capability routing in `orchestrator.service.ts`.
-   [x] **Governance Convergence**: integrated command scanning in `policy.service.ts`.
-   [x] **Interactive Dashboard**: implemented Judge Mode launcher and telemetry matrix.
-   [x] **Documentation Suite**: generated nineteen comprehensive system documents.
-   [x] **Backend Validation**: verified that NestJS integration tests execute without warnings.

---

## 2. Release Steps

1.  **Codebase Cleanup**: Remove unused backup files and dev logs.
2.  **Test Run**: Execute `pnpm run test` inside the backend.
3.  **Frontend Compilation**: Verify page transitions in the development server.
4.  **Version Tagging**: Apply release tag `v2.0.0-rc.1` to the repository.
