# AMD Integration Guide: Instinct MI300X and ROCm
## Accelerating Multi-Agent Swarms on AMD AI Fabric

This document details how Re-Evolve on HGI binds to AMD hardware and utilizes ROCm for low-latency inference.

---

## 1. Hardware Mappings (AMD Instinct MI300X)

Re-Evolve is optimized to run on **AMD Instinct MI300X** clusters:
-   **GPU Memory**: 192GB HBM3 memory per card.
-   **Memory Bandwidth**: Up to 5.3 TB/s.
-   **Context Windows**: Accommodates long context windows (up to 256k tokens) without quantization.

---

## 2. ROCm Software Environment

ROCm (Radeon Open Compute) serves as the open-source software stack for GPU computing.

### 2.1 PyTorch ROCm Bindings
We verify the ROCm environment using PyTorch:
```python
import torch
print(f"ROCm available: {torch.cuda.is_available()}")
print(f"Device name: {torch.cuda.get_device_name(0)}")
# Outputs: "AMD Instinct MI300X"
```

### 2.2 Serving Models via vLLM
We serve open models (such as `Llama-3-70b-Instruct`) using vLLM built for ROCm:
```bash
python3 -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Meta-Llama-3-70B-Instruct \
  --tensor-parallel-size 4 \
  --port 8000
```

---

## 3. LiteLLM Automatic Routing & Failover

LiteLLM routes requests between remote services (Fireworks AI) and the local AMD Instinct cluster.

### Config (`config.yaml`):
```yaml
model_list:
  - model_name: llama-3-70b
    litellm_params:
      model: openai/meta-llama/Meta-Llama-3-70B-Instruct
      api_base: http://localhost:8000/v1
      api_key: local-rocm-key
  - model_name: fallback-llama-3-70b
    litellm_params:
      model: fireworks_ai/llama-v3-70b-instruct
      api_key: os.environ/FIREWORKS_API_KEY
```

When Fireworks experiences high latencies (simulated in the dashboard), the router shifts primary carrier mapping to the local ROCm server in under **500ms**, preserving pipeline execution.
