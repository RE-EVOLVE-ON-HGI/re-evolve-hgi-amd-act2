# EIR Architecture Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Architectural Blueprint

The Engineering Intelligence Runtime (EIR) functions as the central code-coordinating engine inside HGI:

```
    [CENSA (Director)]  ➔  PRD & Tasks
            │
            ▼
    [EIR Module (NestJS)] ➔ Assembles Code Contexts & Ast Indexes
            │
            ├───────────────┼───────────────┐
            ▼               ▼               ▼
     [Panani X]        [Memory Vault]   [Kavacha]
    (Specialists)      (Context Cache) (Compliance Gates)
```

---

## 2. Dynamic Workflows

1.  **CENSA Planning**: CENSA parses product intent and builds software task DAG nodes.
2.  **EIR Pruning**: EIR compiles repository context vectors and reduces prompt context size (ratio ~0.48).
3.  **Specialist Execution**: Panani X agents write changes to sandbox files.
4.  **Kavacha Validation**: Kavacha runs AST audits, dependency scanning, and passes results to the ledger.
