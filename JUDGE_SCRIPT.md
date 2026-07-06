# Hackathon Evaluation Script
## Judging Walkthrough for Re-Evolve on HGI

This script provides chronological cues for evaluating Re-Evolve on HGI in 30 seconds, 2 minutes, and 5 minutes.

---

## 1. The 30-Second Pitch (The "WOW" Moment)

*   **Goal**: Showcase a working AI Operating System.
*   **Action**:
    1.  Open the workflows page: `http://localhost:3000/hq/workflows`.
    2.  Click the **Launch Judge Mode Demo** button.
    3.  Explain: *"This is Re-Evolve on HGI, a complete AI Agent Operating System. In one click, CENSA parses intent, generates a task DAG, selects specialist agents, retrieves vector memory, runs code tools in sandbox isolates, enforces Kavacha safety policies, and executes GPU inference, showing the live flow in real time."*

---

## 2. The 2-Minute Walkthrough (Architectural Depth)

*   **Goal**: Explain the layers and failover resilience.
*   **Action**:
    1.  Point to the **Live CENSA Graph** and explain: *"CENSA classifies intent and builds the task DAG before picking active agents."*
    2.  Navigate to the **AMD Infrastructure Dashboard** (`/hq/infrastructure`).
    3.  Click the **Simulate Provider Latency Spike & Failover** button: *"Watch our router detect high latency on Fireworks and redirect requests to local AMD Instinct MI300X GPUs in under 500ms."*
    4.  Scroll to the **pxpipe Token Compression Sandbox**: *"We render long context prompts as dense PNG pages, saving up to ~68% input tokens. We also scan for hex values to prevent verbatim OCR read errors."*

---

## 3. The 5-Minute Deep Dive (Production Integrity)

*   **Goal**: Validate the developer experience and system files.
*   **Action**:
    1.  Open the root directory and show the **nineteen detailed markdown guides**: *"We have fully frozen our API contracts, documented SDK code usage, and mapped our complete nextunicorn2026 reusable repository ecosystem."*
    2.  Point out that the Jest test suite runs successfully with zero warnings: *"The platform contains real database Prisma schemas and is fully production-ready."*
