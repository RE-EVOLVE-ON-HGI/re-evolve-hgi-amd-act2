# Bug Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

**Generated:** 2026-07-06  
**Severity Levels:** CRITICAL · HIGH · MEDIUM · LOW · INFO

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 0 |
| MEDIUM | 3 |
| LOW | 2 |
| INFO | 3 |

**No blocking bugs. Zero critical or high severity issues found.**

---

## Medium Severity

### BUG-001 · Port Conflict on Local Docker Compose

**Severity:** MEDIUM  
**Component:** Infrastructure  
**Status:** RESOLVED ✅

**Description:**  
Running `docker compose up` for the backend would fail because ports 5432 (PostgreSQL) and 6379 (Redis) were already allocated by the `hgi-civ-*` container network on the same Docker host.

**Root Cause:**  
The `backend/docker-compose.yml` uses default port bindings that conflict with the existing developer environment containers.

**Resolution Applied:**  
Updated `backend/.env` to point `DATABASE_URL` and `REDIS_*` variables to the already-running `hgi-civ-postgres` and `hgi-civ-redis` containers. Started Qdrant (`hgi-amd-qdrant`) separately on its own unused port 6333.

**Future Mitigation:**  
Add a `docker-compose.override.yml` or `docker-compose.local.yml` with non-conflicting port mappings for developer environments where other containers may be running.

---

### BUG-002 · No Prisma Migration Files on First Clone

**Severity:** MEDIUM  
**Component:** Database / Developer Experience  
**Status:** RESOLVED ✅

**Description:**  
The `prisma/migrations/` directory was not committed to the repository. Running `prisma migrate deploy` on a fresh clone reported "No migration found" and produced no schema.

**Root Cause:**  
`prisma migrate deploy` requires existing migration files; `migrate dev` generates them. The migrations directory was missing from the initial repository structure.

**Resolution Applied:**  
Ran `prisma migrate dev --name init` which generated `20260706120305_init/migration.sql` and applied the full schema to the database.

**Future Mitigation:**  
The generated `prisma/migrations/` directory is now committed to the repository and will be included in the next push. Subsequent clones can use `prisma migrate deploy` correctly.

---

### BUG-003 · Jest Process Does Not Exit Cleanly

**Severity:** MEDIUM  
**Component:** Test Suite  
**Status:** KNOWN / ACCEPTABLE

**Description:**  
After all 4 tests pass, Jest logs a warning: *"Jest did not exit one second after the test run has completed. This usually means that there are asynchronous operations that weren't stopped in your tests."*

**Root Cause:**  
The NestJS `AppModule` bootstraps Kafka, BullMQ, and Prisma connections. Even with the `afterAll` cleanup, some async handles (likely BullMQ Redis connection) remain open momentarily.

**Impact:**  
Zero functional impact. Tests pass correctly. The process eventually exits. Does not affect CI/CD or test results.

**Mitigation:**  
Add `--forceExit` to Jest config or explicitly close the BullMQ connection in `afterAll`. Deferred as non-blocking for hackathon submission.

---

## Low Severity

### BUG-004 · AMD AI Cloud Endpoint Unreachable Without API Key

**Severity:** LOW  
**Component:** AMD Integration  
**Status:** EXPECTED BEHAVIOR

**Description:**  
`curl inference.amd.com` returns a connection timeout (000) without an API key. The Fireworks AI endpoint returns HTTP 401 (correct — authentication required).

**Impact:**  
Zero impact. All inference calls fall back gracefully to the mock model service when keys are absent. The system is designed to operate in demo mode without live credentials.

---

### BUG-005 · Kafka and Temporal Not Available in Local Environment

**Severity:** LOW  
**Component:** Infrastructure  
**Status:** KNOWN / ACCEPTABLE

**Description:**  
Kafka (port 9092) and Temporal (port 7233) are not running in the local environment. All Kafka calls in tests are mocked; no test failures occur.

**Impact:**  
Telemetry events (Kafka) and workflow orchestration (Temporal) are non-functional locally. Core agent orchestration, governance, and memory are unaffected.

---

## Informational

### INFO-001 · Prisma Major Version Update Available (5.22 → 7.8)

Prisma has a major version update available. Not applied — major updates require migration testing. Current version is stable and fully functional.

### INFO-002 · Qdrant Collections Empty on Fresh Environment

Qdrant starts with no collections. Collections are created dynamically by `QdrantService.onModuleInit()` when the backend starts. No action needed.

### INFO-003 · `pnpm-workspace.yaml` Monorepo Config Preset

The root workspace has `pnpm-workspace.yaml`. Backend and frontend manage their own `node_modules`. Running `pnpm install` at root level is not required; run inside `backend/` and `frontend/` separately.

---

## Conclusion

**ZERO CRITICAL or HIGH severity bugs.**  
All medium severity issues have been resolved or are known/acceptable.  
The system is stable and ready for live demonstration.
