# Judge Evaluation Guide
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Quick Access Summary

*   **Live Application URL**: [https://frontend-alpha-rose-25.vercel.app](https://frontend-alpha-rose-25.vercel.app)
*   **GitHub Repository**: [RE-EVOLVE-ON-HGI/re-evolve-hgi-amd-act2](https://github.com/RE-EVOLVE-ON-HGI/re-evolve-hgi-amd-act2)
*   **Developer Workspace Passcode**: `AMD-GOLD`

---

## 2. Key Hackathon Evaluation Topics

When evaluating Re-Evolve on HGI, focus on these primary criteria:

### Topic 1: Guided Keynote Storytelling
*   **Where to look**: Scroll down the homepage from Chapter 1 to 12.
*   **Why it matters**: The landing page is designed to be the pitch deck, explaining the problem (fragmented agents), the architectural layers, and the hardware acceleration strategy.

### Topic 2: One-Click Simulation (Chapter 9)
*   **Where to look**: Chapter 9 console block on the homepage.
*   **Why it matters**: Demonstrates the live coordination sequence. Select any sample objective, click **Initialize**, and watch the terminal logs, execution DAG stages, and Live Status Overlay checkboxes light up.

### Topic 3: Provider Abstractions & Failovers
*   **Where to look**: `backend/src/modules/model/model.service.ts` and `docs/AMD_INTEGRATION_GUIDE.md`.
*   **Why it matters**: Provides concrete code abstractions for local ROCm-based inference servers running on AMD Instinct hardware, with sub-500ms failover paths to Fireworks AI.

### Topic 4: Custom 404 Interceptions
*   **Where to look**: Type any invalid `/hq/` path (like `/hq/alpha-omega`) in your browser URL bar.
*   **Why it matters**: Instead of displaying standard browser errors, HGI intercepts the request and presents a beautiful warning layout: **"Enterprise Platform Modules"**.

---

## 3. Contact & Support

For questions or details regarding local ROCm-based container setups, refer to the documentation in `/docs` or contact the repository administrators.
