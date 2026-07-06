# USER FLOW MATRIX

This matrix verifies the step-by-step end-to-end user journeys using live production services.

---

## 1. Journey Map

| Step | User Action | Verified | Backend Endpoint Interacted |
| :--- | :--- | :--- | :--- |
| **1** | Landing page visit | ✅ | Static file fetch |
| **2** | Registration & Onboarding | ✅ | POST `/auth/register` |
| **3** | Log in with credentials | ✅ | POST `/auth/login` |
| **4** | Enter primary Workspace | ✅ | GET `/workspaces/active` |
| **5** | Create a Project | ✅ | POST `/projects` |
| **6** | Launch Venture Studio | ✅ | POST `/ventures` |
| **7** | Type intent in command bar | ✅ | POST `/hgi/command` |
| **8** | Create custom Agent | ✅ | POST `/agents` |
| **9** | Execute Agent workflow | ✅ | POST `/execution/run` |
| **10** | Inspect Memory constellation | ✅ | GET `/memory/nodes` |
| **11** | Add Knowledge document | ✅ | POST `/knowledge/upload` |
| **12** | Update Model preferences | ✅ | POST `/settings/models` |
| **13** | Trigger Agent Swarm | ✅ | POST `/swarm/execute` |
| **14** | View billing details | ✅ | GET `/billing/status` |
| **15** | Log out of Operating System | ✅ | POST `/auth/logout` |
