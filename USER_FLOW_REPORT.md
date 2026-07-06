# USER FLOW REPORT

This report validates the end-to-end user journeys using live production endpoints.

---

## 1. Step-by-Step User Journeys

```
[Landing Page] -> [Registration] -> [Login] -> [Workspace] -> [Project] -> [Intent Command] -> [Agent Swarm] -> [Logout]
```

| Stage | Step Description | Status | Evidence / API Endpoint |
| :--- | :--- | :--- | :--- |
| **1** | Landing Page Access | 🟢 Verified | Returns 200 OK HTML payload. |
| **2** | Registration | 🟢 Verified | POST `/auth/register` generates DB user. |
| **3** | Log In | 🟢 Verified | POST `/auth/login` returns secure token cookie. |
| **4** | Workspace Entry | 🟢 Verified | GET `/workspaces/active` loads layout state. |
| **5** | Project Setup | 🟢 Verified | POST `/projects` builds project milestones. |
| **6** | Launch Venture Studio | 🟢 Verified | POST `/ventures` initializes dashboard. |
| **7** | Submit Intent Command | 🟢 Verified | POST `/hgi/command` parses command payload. |
| **8** | Create Custom Agent | 🟢 Verified | POST `/agents` inserts agent config. |
| **9** | Execute Agent Workflow | 🟢 Verified | POST `/execution/run` triggers background run. |
| **10** | Memory Inspection | 🟢 Verified | GET `/memory/nodes` loads vector graph. |
| **11** | Model Preferences | 🟢 Verified | POST `/settings/models` updates active model list. |
| **12** | Log Out | 🟢 Verified | POST `/auth/logout` clears session tokens. |
