# Mission Flow Specification

## 1. The Life of a Mission
A "Mission" in HGI is a self-contained execution unit defined by a Goal and a set of Constraints.

### Stage 1: Goal Ingress
- User submits: "Audit the financial logs for Q3 and report drift."
- CENSA parses the goal into a structured **Intent**.

### Stage 2: Intent Expansion
- CENSA expands the Intent into a **Task DAG**.
- Tasks: `[FetchLogs] -> [ParseSchema] -> [AnalyzeDrift] -> [GenerateReport]`.

### Stage 3: Agent Matching
- CENSA queries the Registry for agents with `finance_audit` and `data_parsing` skills.
- Agents are assigned to DAG nodes based on confidence scores.

### Stage 4: Governed Execution
- For each node:
  1. **Kavacha Check**: "Can `AnalyzeDrift` agent read `/logs/q3`?" $\rightarrow$ YES.
  2. **Panani X Execute**: Agent runs analysis in sandbox $\rightarrow$ Result: "Drift detected in 3 accounts."
  3. **Persistence**: Outcome stored in Memory Vault.

### Stage 5: Final Synthesis
- CENSA collects all node outputs.
- A synthesis agent compiles the final report.
- Mission marked as `COMPLETE`.

## 2. Error Handling & Recovery
- **Node Failure**: If a node fails, CENSA attempts a "Local Retry" (up to 3 times).
- **Escalation**: If retries fail, CENSA attempts "Agent Swap" (assigning a different agent with the same skill).
- **Fatal Error**: If no agents can solve the node, the Mission is marked as `BLOCKED` with a detailed reason.
