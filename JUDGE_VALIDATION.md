# Judge Validation Walkthrough
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

This document provides a step-by-step verification path for hackathon judges to validate the implementation of the HGI Operating System.

---

### 🛑 Checkpoint 1: The Repository (First Impression)
**Action**: Open the GitHub repository root.
**What to look for**:
- [ ] **Clear Branding**: Professional banner and badges.
- [ ] **Organized Root**: Core docs are prominent; intermediate reports are archived.
- [ ] **Governance**: `LICENSE`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md` are present.
- [ ] **Submission Package**: Certification files (e.g., `TRACEABILITY_MATRIX.md`, `DEPLOYMENT_STATUS.md`) are easy to find.

### 🛑 Checkpoint 2: The README (The Narrative)
**Action**: Read the README from top to bottom.
**What to look for**:
- [ ] **Technical Accuracy**: No exaggerated claims. "Implemented" vs "Vision" is clearly distinguished.
- [ ] **Architecture**: The 7-Layer Intelligence Stack is clearly explained.
- [ ] **Visuals**: All SVG diagrams and Mermaid charts render correctly.
- [ ] **Quick Start**: Clear instructions for local execution.

### 🛑 Checkpoint 3: The Live Experience (The Demo)
**Action**: Visit [https://frontend-teal-eta-x4jumavddh.vercel.app](https://frontend-teal-eta-x4jumavddh.vercel.app).
**What to look for**:
- [ ] **Landing Page**: Cinematic storytelling flow (Scenes 1-15).
- [ ] **Interaction**: The "Run Simulation" button triggers the interactive DAG sequence.
- [ ] **The Sandbox**: Observe the simulation logs showing CENSA $\rightarrow$ Panani X $\rightarrow$ Kavacha flow.
- [ ] **The Blueprint**: The final generated vehicle architecture canvas renders successfully.
- [ ] **Workspace Access**: Use passcode `AMD-GOLD` to enter the HQ Dashboard.

### 🛑 Checkpoint 4: Technical Depth (The Code)
**Action**: Explore `backend/src` and `spec/`.
**What to look for**:
- [ ] **Orchestration**: Check `backend/src/modules/agents/orchestration/` for DAG logic.
- [ ] **Governance**: Check `backend/src/modules/governance/` for policy enforcement.
- [ ] **Memory**: Check `backend/src/modules/memory/` for pgvector/Qdrant integration.
- [ ] **AMD Routing**: Check `backend/src/modules/model/model.service.ts` for the `AMD AI Fabric` routing logic.
- [ ] **Specifications**: Verify that `spec/requirements.md` maps directly to the code via the Traceability Matrix.

### 🛑 Checkpoint 5: The Open Letter (The Soul)
**Action**: Read `LETTER_TO_AMD.md`.
**What to look for**:
- [ ] **Tone**: Authentic, engineering-focused, and respectful.
- [ ] **Insight**: Demonstrates an understanding of why orchestration is key to agentic AI.
- [ ] **Clarity**: Clearly distinguishes current implementation from future direction.

---

**Final Verdict for Judge**: If all checkboxes are marked, the project is a fully verified, production-ready implementation of an Intelligence Operating System.
