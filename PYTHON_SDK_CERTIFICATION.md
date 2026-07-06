# PYTHON SDK CERTIFICATION

This document verifies the operational readiness of the HGI Python SDK.

---

## 1. SDK Core Functions Validation

```python
# Executable example for Python SDK Initialization
from hgi_sdk import HgiClient, AgentConfig

client = HgiClient(api_url="https://api.re-evolveon.com", token="jwt-token")

# 1. Workspace
workspace = client.workspaces.get_active()

# 2. Create Project
project = client.projects.create(name="Panani Foundation", workspace_id=workspace.id)

# 3. Create Agent
agent = client.agents.create(
    config=AgentConfig(
        name="Research Assistant",
        template="research-rag",
        model="anthropic/claude-3.5-sonnet"
    )
)

# 4. Attach Memory & Knowledge
agent.memory.sync_node(key="context_pref", value="Panani X DSL specifications")
agent.knowledge.add_file("/path/to/doc.pdf")

# 5. Run & Stream
for token in agent.execute_stream(intent="Parse language grammar"):
    print(token, end="", flush=True)

# 6. Shutdown
agent.shutdown()
```

---

## 2. Integration & End-to-End Tests
* **Test Setup:** Executed inside `/Users/nextunicorn/re-evolve-on-hgi/services/agents/tests/sdk_test.py`.
* **Verification:** Checks workspace loading, authentication headers, mock-free token streaming, and correct response parsing.
