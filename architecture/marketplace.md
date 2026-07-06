# Re-Evolve V3 — Marketplace Architecture (Project Singularity)

This document specifies the Skill, Agent, Workflow, and Knowledge marketplaces, along with publishing validation rules and revenue allocation engines for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Marketplace Segments

The Re-Evolve V3 Marketplace provides an ecosystem for sharing and monetizing autonomous capabilities.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        V3 ECOSYSTEM MARKETPLACE                        │
├───────────────────┬────────────────────────────────────────────────────┤
│ Agent Directory   │ Pre-trained agent personalities, system prompts,   │
│                   │ and custom weights.                                │
├───────────────────┼────────────────────────────────────────────────────┤
│ Skill Library     │ Executable code packages (NodeJS/Python) to        │
│                   │ run inside the sandboxed Skill OS.                 │
├───────────────────┼────────────────────────────────────────────────────┤
│ Workflow Templates│ Pre-configured task DAG templates for automate     │
│                   │ workflows.                                         │
├───────────────────┼────────────────────────────────────────────────────┤
│ Knowledge Packs   │ Pre-indexed vector databases containing industry   │
│                   │ research (Health, Real Estate, Finance).           │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

## 2. The Publishing & Verification Pipeline

To maintain security and prevent capital leakage, all uploads undergo an automated verification workflow before they are published:

```
Developer Uploads Asset (Agent/Skill/Workflow)
  │
  ▼
Static Analysis Gate (Eslint / Security scan)
  ├── Fails: Rejects upload and notifies developer.
  └── Passes: Moves to Sandbox Execution.
  │
  ▼
Sandbox Isolation Test (Executes skill in restricted container)
  ├── Out of bounds (infinite loops, network leaks): Fails and registers violation.
  └── Executes cleanly: Moves to Policy Evaluation.
  │
  ▼
Kavacha Compliance Scan (Checks logic against system boundaries)
  ├── Flags risk: Requires manual internal review.
  └── Approved: Digitally signs asset and publishes it to the directory.
```

---

## 3. Revenue Sharing Allocation Model

Purchased assets distribute funds automatically via the Revenue Engine using ledger transactions:

```
                      Gross Transaction Amount ($100)
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼ (70%)                     ▼ (20%)                     ▼ (10%)
   Developer Share             Platform Operations        Compute Royalties Pool
 (Paid directly to the       (Assigned to Re-Evolve     (Reserved to offset model
   developer's balance).      operating ledger account).  token fees and API costs).
```

Ledger balances are updated atomically using the double-entry bookkeeping system detailed in [revenue-engine.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/revenue-engine.md).

---

## 4. Versioning & Deprecation Rules

Marketplace assets enforce strict semantic versioning rules (`Major.Minor.Patch`):
*   **Backward Compatibility**: Minor and Patch updates are auto-installed for workspaces running active instances of the asset.
*   **Breaking Changes**: Major version updates require manual opt-in. The previous major version remains active in deprecated status for 90 days.
*   **Deprecation Flow**:
    1.  *Active*: Fully supported and discoverable.
    2.  *Deprecated*: Removed from search directories. Active instances continue running with warning alerts.
    3.  *End-of-Life (EOL)*: Automatically replaced with a secure fallback or suspended.
