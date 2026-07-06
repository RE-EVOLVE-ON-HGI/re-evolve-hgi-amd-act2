# Platform Risk Register
## Security Risks, MITRE Mappings, and Mitigation Strategies

This document lists the technical risks associated with running agentic systems and details how Re-Evolve mitigates them.

---

## 1. Platform Vulnerability Matrix

| Risk ID | Risk Name | Threat Category | Mitigating Component | Impact |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | OCR Substitution | Lossy image prompt recall (verbatim OCR substitutions) | **Verbatim-Risk Guard** (routes alphanumeric hexes/secrets as raw text) | Medium |
| **RSK-02** | Swarm Infinite Loops | Agent-to-Agent observation loops consuming tokens | **CENSA Loop Detector** (caps sequential agent-to-agent exchanges) | High |
| **RSK-03** | Sandbox Escape | Malicious tool executions escaping isolate boundaries | **Panani Isolate Sandboxes** (VM execution restricts native modules) | Critical |
| **RSK-04** | Supply-Chain Ingress | Developer packages containing malware or IOCs | **Kavacha Pre-scan (Bumblebee)** (blocks curl/wget and untrusted imports) | High |
| **RSK-05** | Budget Exhaustion | Agents generating high token billing rates | **Economic Ledger Ledger** (balances and halts over-budget agents) | Medium |

---

## 2. Threat Mitigation Details

### 2.1 Verbatim-Risk Guard
As identified in **[pxpipe-token-cutdown-](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/clones/pxpipe-token-cutdown-)**, rendering exact strings like IDs or API keys into PNG files can cause model substitution errors (e.g. `8` read as `0`). We block imaging on blocks containing hex patterns or ID prefixes.

### 2.2 Kavacha Pre-scan & Sandbox Limits
Before a command runs in Panani X, Kavacha audits it. In accordance with the rules of `SkillSpector-HGI`, agent skills are statically scanned for unauthorized commands.
