# PRIVATE BETA READINESS

This guide outlines release notes, known issues, operator manuals, and rollback guidelines for the Private Beta launch.

---

## 1. 5-User Beta Checklist
* **User Onboarding:** Setup accounts at `/auth/register`.
* **Workspace Verification:** Ensure the home workspace loads with zero initial console errors.
* **Command Bar Run:** Verify test prompt *"Today's briefing"* streams responses successfully.

---

## 2. Operator Manual
* Check live statuses: `railway status`
* View service logs: `railway logs --service api`
* Initiate instant rollback: `railway rollback`
