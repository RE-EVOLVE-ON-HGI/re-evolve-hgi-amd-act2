# AMD AI Developer Cloud Integration Guide
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Hardware Integration Architecture

Re-Evolve on HGI is built to leverage high-performance AMD Instinct MI300X accelerators. The model routing layer is abstracted to balance workloads between local accelerated servers and remote inference endpoints.

```
┌──────────────────────────────────────────────────────────────────┐
│                    AMD AI Integration Layer                       │
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│   │  AMD Instinct │    │  ROCm Stack  │    │  Fireworks AI    │  │
│   │  MI300X       │    │  vLLM Serve  │    │  Inference API   │  │
│   │  Clusters     │    │  PyTorch HIP │    │  Hosted Models   │  │
│   └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘  │
│          └─────────────────────────────────────────┘            │
│                         LiteLLM Proxy                            │
│              Unified OpenAI-Compatible Endpoint                  │
│              Auto-failover in < 500ms                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                    Re-Evolve HGI Core OS
              CENSA → Panani X → Kavacha → Memory
```

---

## 2. Abstraction Layer Configuration

All model requests route through `ModelService` in `backend/src/modules/model/model.service.ts`. The implementation acts as a provider abstraction.

### 2.1 Model Switch Settings

When AMD Instinct hardware credentials are set in the environment, the routing behavior updates as follows:

| Environment Variable | Target Value | Description |
|----------------------|--------------|-------------|
| `AMD_CLOUD_URL` | `https://inference.amd.com/api` | Direct ROCm-accelerated vLLM serving portal |
| `AMD_CLOUD_API_KEY` | `your-amd-developer-cloud-token` | Hardware workspace access token |
| `FIREWORKS_API_KEY` | `your-fireworks-api-key` | Remote fallback model endpoint |

---

## 3. Local Model Serving via ROCm

To serve local models (e.g. Gemma 4, Llama 3) on local AMD Instinct hardware with ROCm:

### 3.1 Docker Compose Deployment

```yaml
# docker-compose.amd.yml
version: "3.8"
services:
  vllm-rocm:
    image: vllm/vllm-openai:latest
    devices:
      - /dev/kfd:/dev/kfd
      - /dev/dri:/dev/dri
    security_opt:
      - seccomp=unconfined
    environment:
      - HIP_VISIBLE_DEVICES=0,1,2,3
    ports:
      - "8000:8000"
    command: --model google/gemma-2-9b-it --port 8000 --host 0.0.0.0
```

### 3.2 Verification

To verify that the local vLLM server is responding:

```bash
curl http://localhost:8000/v1/models
```

Ensure `ModelService` config is updated:
```
AMD_CLOUD_URL=http://localhost:8000
```

---

## 4. Failover Mechanism

If the primary local Instinct cluster returns a timeout or connection issue:
1. `ModelService` catches the exception.
2. LiteLLM routes the pathway to `api.fireworks.ai` fallback endpoints.
3. Failover executes in `<500ms`, preserving the running CENSA DAG sequence.
