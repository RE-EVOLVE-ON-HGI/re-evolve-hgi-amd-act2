# Governance Specification

## 1. Zero-Trust Philosophy
HGI assumes that any agent, regardless of its specialization, can potentially generate a malicious or erroneous tool call. Therefore, no tool execution is trusted.

## 2. The Kavacha Guardrail
The Kavacha layer acts as a mandatory interceptor between the Panani X Runtime and the host environment.

### 2.1 Policy-Based Filtering
Policies are defined as a set of allowed/denied actions:
- **Filesystem**: `Allow: read /tmp, Deny: write /etc`.
- **Network**: `Allow: api.fireworks.ai, Deny: *`.
- **Process**: `Allow: node, Deny: sh, bash, curl`.

### 2.2 Real-time Inspection
Kavacha performs three checks on every tool call:
1. **Syntax Check**: Is the tool call well-formed?
2. **Policy Check**: Does the action violate any defined constraints?
3. **Context Check**: Is the action logical given the current mission state?

## 3. Auditability & Compliance
- **Immutable Ledger**: Every governance decision is stored in a PostgreSQL audit table.
- **Evidence Chain**: Every result in the Memory Vault is linked back to the specific Kavacha approval ID.
- **Compliance Reporting**: The system can generate a "Mission Audit Report" detailing every approved and blocked action.
