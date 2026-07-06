# CLI Tool Reference
## Command-Line Operations and Developer Utilities

The `hgi` CLI client allows engineers to check system status, trigger orchestration loops, and search the Memory Vault directly from the terminal.

---

## 1. Installation

Build the CLI wrapper using pnpm:
```bash
cd cli
pnpm install
pnpm link --global
```

---

## 2. Command Reference

### 2.1 `hgi status`
Displays the active infrastructure carrier status, queue depths, and current system memory usage.
```bash
hgi status
# Outputs:
# SYSTEM STATUS: Nominal
# ACTIVE CARRIER: AMD AI Developer Cloud (MI300X)
# QUEUED TASKS: 0
# MEMORY VAULT ENVELOPE: Enforced
```

### 2.2 `hgi run [goal]`
Dispatches a new goal to the CENSA orchestration engine.
```bash
hgi run "Audit codebase, verify compile, and deploy"
# Outputs:
# Orchestration ID: b0fce698-f971-4892-b8fc-e698f971
# Status: Running
# Classified Intent: SYSTEM_WORKFLOW_CREATION
```

### 2.3 `hgi memory search [query]`
Queries the PostgreSQL/pgvector database for semantic context matches.
```bash
hgi memory search "compliance template" --limit 1
# Outputs:
# Match found (Similarity: 0.93):
# "HGI Compliance template v1.4 specifies zero unverified skill execution..."
```

---

## 3. Reusable CLI Tools

We align CLI commands with **[CLI-Anything-for-HGI-](https://github.com/nextunicorn2026/CLI-Anything-for-HGI-)** and the command shims in **[ECC-HGI](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/ECC-HGI)** to enable wrapping legacy developer tools inside agent-native command structures.
