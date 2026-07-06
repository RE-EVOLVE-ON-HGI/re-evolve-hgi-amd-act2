# PRE-MIGRATION REPORT: RE-EVOLVE ON HGI ECOSYSTEM

This report outlines the pre-migration status and assets of the **RE-EVOLVE ON HGI** ecosystem under the source owner `nextunicorn2026` before transferring to the destination organization `Arcanum-Regnum`.

---

## Ecosystem Repository Inventory

We identified and inventoried 9 repositories associated with the ecosystem:

| # | Repository Name | Type | Commits | Default Branch | Workflows | Railway Integration |
|---|-----------------|------|---------|----------------|-----------|---------------------|
| 1 | `RE-EVOLVE-ON-HGI-Os` | Private | 353 | `main` | 3 | Linked to service `api` |
| 2 | `re-evolve-on-hgi` | Private | 17 | `main` | 0 | None |
| 3 | `re-evolve-hgi` | Private | 2 | `main` | 0 | None |
| 4 | `kavacha-HGI-core` | Private | 1 | `main` | 0 | None |
| 5 | `artoies-hub` | Private | 689 | `main` | 0 | None |
| 6 | `map-for-HGI` | Public | 73 | `main` | 0 | None |
| 7 | `brain-for-HGI-` | Public | 1253 | `main` | 0 | None |
| 8 | `agent-skills` | Public | 189 | `main` | 0 | None |
| 9 | `dify` | Public | 10668 | `main` | 0 | None |

---

## Detailed Repository Audits

### 1. RE-EVOLVE-ON-HGI-Os (hgi-backend)
- **Visibility:** Private
- **Default Branch:** `main`
- **Git History:** 353 commits
- **Branches (19):**
  - `backup/v66-snapshot-20260611`
  - `checkpoint/pre-go-live-20260604-2052`
  - `checkpoint/pre-venture-studio-20260604`
  - `feat/activation-funnel-fix`
  - `feat/beta-launch-20260604`
  - `feat/desktop-autoupdate`
  - `feat/go-live-consolidation-20260604`
  - `feat/hgi-autoscaling-stabilization`
  - `feat/hgi-v3.9-production-ready`
  - `feat/railway-production-migration`
  - `feat/venture-studio-v1`
  - `feature/design-system-v2`
  - `fix/desktop-linux-metadata`
  - `fix/env-api-domain`
  - `main`
  - `production-candidate/v1.0.8`
  - `reconcile/backend-onto-landing`
  - `release/hgi-v5-rc1`
  - `release/v2.0.0-cinematic`
- **Tags (10):**
  - `v6.0.7`, `v6.0.5`, `v6-production-candidate`, `v5-final-stable`, `v2.0.0-cinematic`, `hgi-v2-public-launch`, `hgi-v1-live`, `founder-beta-baseline-2026-06-25`, `desktop-v6.0.7`, `desktop-v6.0.6`
- **Releases (2):**
  - `RE-EVOLVE ON HGI — Desktop v6.0.7`
  - `6.0.5`
- **Issues:** 1
- **GitHub Actions / CI/CD (3 workflows):**
  - `.github/workflows/ci.yml`
  - `.github/workflows/deploy.yml`
  - `.github/workflows/desktop-release.yml`
- **Deploy Keys:** None
- **Webhooks:** None
- **Railway Integration:** Connected to service `api` in Railway project `hgi-core` (linked to branch `main`, deployed in `production` environment).

### 2. re-evolve-on-hgi (re-evolve-on-hgi-ui)
- **Visibility:** Private
- **Default Branch:** `main`
- **Git History:** 17 commits
- **Branches (2):**
  - `main`
  - `v0/re-evolve-intelligence-platform-7f5fee16`
- **Tags:** None
- **Releases:** None
- **Issues:** 1
- **GitHub Actions / CI/CD:** None
- **Deploy Keys / Webhooks:** None
- **Railway Integration:** None.

### 3. re-evolve-hgi
- **Visibility:** Private
- **Default Branch:** `main`
- **Git History:** 2 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Legacy or placeholder repository.

### 4. kavacha-HGI-core
- **Visibility:** Private
- **Default Branch:** `main`
- **Git History:** 1 commit
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Custom security rules monorepo scaffold.

### 5. artoies-hub
- **Visibility:** Private
- **Default Branch:** `main`
- **Git History:** 689 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Hybrid mobile/web interface client.

### 6. map-for-HGI
- **Visibility:** Public
- **Default Branch:** `main`
- **Git History:** 73 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. UI component mapcn library.

### 7. brain-for-HGI-
- **Visibility:** Public
- **Default Branch:** `main`
- **Git History:** 1253 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Natural language intent matching engine.

### 8. agent-skills
- **Visibility:** Public
- **Default Branch:** `main`
- **Git History:** 189 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Agent tools library.

### 9. dify
- **Visibility:** Public
- **Default Branch:** `main`
- **Git History:** 10668 commits
- **Branches:** `main`
- **Tags / Releases / Actions / Deploy Keys / Webhooks / Railway:** None. Forked workflow automation nodes platform.
