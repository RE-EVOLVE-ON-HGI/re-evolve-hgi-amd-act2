# Engineering Skills Upgrade: Re-Evolve on HGI
## Agentic Swarms, AMD AI Developer Cloud, and ROCm Best Practices

This document outlines the advanced engineering skill upgrades integrated into Re-Evolve on HGI, detailing our learnings and application strategies.

---

## 1. AMD Instinct GPU & ROCm Acceleration

### What Was Learned
- **ROCm Integration**: AMD's ROCm (Radeon Open Compute) framework serves as the low-level platform for GPU-accelerated LLM inference, comparable to CUDA.
- **MI300X Capabilities**: The AMD Instinct MI300X features 192GB of HBM3 memory, making it capable of running extremely large context windows (up to 256k tokens) without context offloading.
- **LiteLLM Optimization**: LiteLLM can wrap ROCm-accelerated local vLLM instances, providing a drop-in OpenAI-compatible API gateway with latency tracking.

### How It Applies to Re-Evolve
- We configure LiteLLM as the main routing broker.
- When Fireworks AI status degrades, requests are routed to the local AMD Instinct MI300X cluster, maintaining sub-30ms first-token latency.

---

## 2. Multi-Agent Systems & MCP (Model Context Protocol)

### What Was Learned
- **MCP Servers**: Model Context Protocol establishes a standard for connecting LLMs to external tools and files. Servers like `playwright-mcp-HGI-` and `agent-toolkit-for-aws-hgi` expose standard tools that any agent can discover.
- **Stateful Chains (LangGraph)**: Multi-agent execution benefits from state graphs where agents can update a shared context state synchronously, preventing infinite feedback loops.
- **Hierarchical Memory**: Splitting memory into semantic (vector), episodic (chronological session-logs), and system (locked parameters) allows models to retrieval-augment their decisions.

### How It Applies to Re-Evolve
- CENSA acts as the central planner, composing a state-DAG.
- Agents execute their tools inside sandboxed Panani X isolates, publishing their updates to the Memory Vault.

---

## 3. Token Compression (pxpipe / headroom)

### What Was Learned
- **Image-based Prompting**: Text characters are dense on code/JSON, whereas vision tokens have fixed costs. By rendering long history or tool documents as high-resolution columns, we can achieve up to ~68% input token reductions.
- **Verbatim-Risk Check**: OCR text-to-image is lossy on specific hex values or alphanumeric IDs (Opus has a 7% substitution error). A risk check is necessary to route these as raw text.

### How It Applies to Re-Evolve
- We built the **pxpipe sandbox** into Re-Evolve to demonstrate this token-saving strategy directly on the AMD Infrastructure page.
