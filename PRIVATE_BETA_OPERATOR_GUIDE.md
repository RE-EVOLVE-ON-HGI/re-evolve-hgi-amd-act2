# PRIVATE BETA OPERATOR GUIDE

This document serves as the operations manual and readiness checklist for launching the RE-EVOLVE ON HGI Internal Private Beta.

---

## 1. 5-User Internal Beta Onboarding Checklist

This checklist must be executed for each of the 5 initial beta users:

- [ ] **Step 1: Account Creation**
  * Invite user to the organization.
  * Register credentials at `https://api.re-evolveon.com/auth/register`.
- [ ] **Step 2: Workspace Setup**
  * Assign user to their default high-context workspace.
  * Verify workspace loads cleanly with zero initial console errors.
- [ ] **Step 3: Intent Engine Check**
  * Run a test query: *"Today's briefing"* in the universal command bar.
  * Confirm that agents resolve the request and stream responses.
- [ ] **Step 4: Integration Access**
  * Verify model options are correctly set (Anthropic Claude-3.5-Sonnet and Bedrock routing).
  * Confirm Stripe billing billing checkout works in sandbox.
- [ ] **Step 5: Telemetry verification**
  * Ensure user interactions appear correctly in the system logs.

---

## 2. Operator Runbook

### Service Startup & Health Monitoring
* Check service status:
  ```bash
  railway status
  ```
* View streaming logs:
  ```bash
  railway logs --service api
  ```
* Test API `/health` endpoint:
  ```bash
  curl -fsS https://api.re-evolveon.com/health
  ```

---

## 3. Rollback Guide

If the current production build breaks:
1. Revert to the last stable release branch:
   ```bash
   git checkout tags/v6.0-stable
   ```
2. Trigger rebuild and redeploy:
   ```bash
   railway up --service api
   ```
3. Verify Postgres migration version parity and check database accessibility.
