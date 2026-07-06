# Re-Evolve V3 — Revenue Engine Architecture (Project Singularity)

This document specifies the double-entry ledger architecture, subscription tiers, usage charge formulas, and the Revenue Attribution Model for **Re-Evolve V3 (Project Singularity)**.

---

## 1. Double-Entry Bookkeeping Ledger

To ensure financial integrity across 10,000+ organizations and marketplace developers, the Revenue Engine enforces a double-entry bookkeeping ledger where debits always equal credits.

```
                  Transactional Action (e.g. Agent Task completed)
                                         │
                                         ▼
                      Atomically Writes to Ledger Database
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼ (Debit Account)                             ▼ (Credit Account)
           Asset / Expense Account                       Revenue / Payable Account
         (e.g., Tenant Balance: -$0.05)                (e.g., Provider Fees: +$0.03)
                                                       (e.g., Platform Profit: +$0.02)
```

### Ledger Database Accounts Map:
*   `1000 — Operational Funds`: Cash reserves held by the platform.
*   `2000 — Accounts Payable (Developers)`: Earnings owed to marketplace creators.
*   `3000 — Platform Revenue`: Fees generated from subscription purchases and transaction cuts.
*   `4000 — Model Provider Payable`: Balance owed to external API services (Google Vertex AI, Groq).
*   `5000 — Tenant Account Balances`: Pre-paid balances deposited by organizations.

---

## 2. Dynamic Revenue Attribution Model

Every agent execution attributes its resource consumption to the parent organization. The total cost is calculated at runtime using the following formula:

$$TotalCost_{cents} = BaseCost_{agent} + \sum_{calls} (Tokens_{in} \cdot Rate_{in} + Tokens_{out} \cdot Rate_{out}) + (SandboxCpuMs \cdot Rate_{cpu})$$

### Pricing Parameters:
*   **BaseCost**: Flat cost charged for starting a specific agent (e.g. $0.01 per run for Developer AI).
*   **Input/Output Token Rates**: Dynamically retrieved from the HGI routing registry based on the chosen provider (e.g., lower rates for Cerebras/Groq, higher rates for Gemini 1.5 Pro).
*   **Sandbox CPU Rate**: Charged for executing custom code inside sandbox runtimes.

---

## 3. Transaction Schema & Database Table Models

Transactions are persisted in [schema.prisma](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/backend/prisma/schema.prisma) under `EconomicTransaction` and `CapitalFlow` tables:

```prisma
model EconomicTransaction {
  id           String   @id @default(uuid())
  orgId        String
  listingId    String?
  listing      MarketListing? @relation(fields: [listingId], references: [id])
  kind         String                          // subscription, usage, royalty, sandbox
  amountCents  BigInt
  debitAccount  String                          // e.g. "5000:tenant-id"
  creditAccount String                          // e.g. "3000:platform"
  counterparty String?
  ts           DateTime @default(now())

  @@index([orgId, kind, ts])
}
```

---

## 4. Multi-Tenant Ledger Ingestion Pipeline

To handle high transaction volumes without locking core database tables, transactions are queued in **Kafka** and processed asynchronously.

```
Agent OS completes task
  │
  ▼
Emits event: `economy.transaction` to Kafka
  │
  ▼
Billing Consumer reads events in batch
  ├── 1. Validates account balances in Redis Cache.
  ├── 2. Writes transactions to database in chunks.
  └── 3. Invalidates local tenant balance cache in Redis.
```

If a tenant's pre-paid balance falls below $0, the Billing Consumer immediately emits a block event to the Feature Flag gatekeeper, suspending active agent workflows.
