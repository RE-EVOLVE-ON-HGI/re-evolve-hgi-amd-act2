# Kavacha Governance Platform
## Zero-Trust Policy Auditing, Economic Ledger, and Supply-Chain Security

Kavacha is the security, compliance, and billing engine of Re-Evolve on HGI. It acts as an inline policy gatekeeper, ensuring all agent actions comply with system rules.

---

## 1. Zero-Trust Policy Verification

Every tool request from the Panani runtime is intercepted by the Kavacha validator:
-   **Declarative Rules**: Policies are loaded from the database and evaluated dynamically against the execution context.
-   **Blocked Operations**: Unsafe commands (e.g. `curl`, `wget`, `npm install`) are blocked to prevent package supply-chain compromises.
-   **Static Skill Scans**: Skills are validated against malicious pattern rules before execution.

```typescript
// Example rule set inside Kavacha Policy Service
const rules = [
  { field: 'sandboxCommand', op: 'neq', value: 'curl' },
  { field: 'agentSkills', op: 'in', value: ['verified-skill'] }
];
```

---

## 2. Double-Entry Economic Ledger

Kavacha bills agents for resource usage:
-   **Concentric Ledger Billing**: Every agent operation is logged as a transaction.
-   **Resource Costs**: Computes base costs plus input and output token consumption.
-   **Limits**: Tasks are paused or require human founder approval if an agent exceeds its budget.

---

## 3. Integrated Security Auditing

Kavacha incorporates rules from:
-   **[SkillSpector-HGI](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/SkillSpector-HGI)**: Audits custom agent skills.
-   **[Bumblebee-for-Kavacha-](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/Bumblebee-for-Kavacha-)**: Scans active workspace packages for supply-chain vulnerabilities.
-   **[VulnClaw-for-kavacha-](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/VulnClaw-for-kavacha-)**: Orchestrates penetration scans on target web assets.
