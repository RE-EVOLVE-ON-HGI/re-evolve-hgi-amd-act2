# Known Limitations
## Operational Boundaries and Environment Constraints

This document lists the current boundaries and trade-offs in Re-Evolve on HGI.

---

## 1. Sandbox Environment Boundaries

-   **Filesystem Restrictions**: Panani X runtimes execute inside VM isolates. Direct local file reads or writes outside the designated sandbox folders are blocked by default.
-   **Blocked Packages**: Kavacha policies restrict dynamic installation of packages (e.g. `npm install`, `pip install`) within the sandbox to prevent supply-chain security injection vectors.

---

## 2. pxpipe Visual Prompt Compression Limits

-   **Verbatim Recall Substitution**: As documented in `FINDINGS.md`, converting exact text strings (like hexadecimal transaction hashes or API keys) into high-density images can lead to OCR character substitution errors (Opus model misreads ~7%).
-   **Mitigation**: Re-Evolve uses a Verbatim-Risk Guard to parse input blocks for hex patterns and bypasses image rendering for high-risk text (routing them as raw tokens instead).

---

## 3. Real-time Telemetry Scaling

-   **Event Backlog**: High task execution frequencies can saturate local Redis streams. System event log lists are capped to the most recent 100 entries.
