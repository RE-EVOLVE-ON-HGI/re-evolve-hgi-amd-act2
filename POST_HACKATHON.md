# Post-Hackathon Roadmap
## Future Milestones and Deferred Core Features

This document outlines architectural enhancements and features deferred to post-submission.

---

## 1. Feature Backlog

### 1.1 Local pxpipe OCR Renderer Integration
-   **Description**: Shift from simulated token compression calculations to a local C++ node module that renders text to PNG files in real time.
-   **Priority**: High.
-   **Dependency**: `@napi-rs/canvas` compiled specifically for macOS/Linux ARM environments.

### 1.2 Multi-Agent Graph RAG
-   **Description**: Migrate standard Memory Vault similarity lists into an interactive graph network, where memories are linked semantically to parent entities.
-   **Priority**: Medium.
-   **Dependency**: Integration of Rust-native `graph-vector-database-hgi` (HelixDB).

### 1.3 Decentralized Governance Consensus
-   **Description**: Expose approval triggers on violations to a multi-node governance swarm rather than relying on a single founder approval entry.
-   **Priority**: Low.

---

## 2. Research Directions

-   **Physical Space Humanoids**: Mapping HGI agent command outputs onto spatial RF presence engines (using `WIFI-view-` wifi intelligence).
-   **Self-Evolving Code**: Allowing agents to refactor their own NestJS backend controllers using `evolver-HGI` genetic loops.
