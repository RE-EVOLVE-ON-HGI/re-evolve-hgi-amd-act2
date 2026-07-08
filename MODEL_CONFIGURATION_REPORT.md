# Model Configuration Report (v2.0.0-final)

This report registers the routing settings, active models, and the provider availability checks for Gemma 4.

---

## 1. Gemma 4 Integration Verification

We verified the model lists exposed under our current Fireworks AI API credentials:

*   **API Model List Query**: `curl -s -H "Authorization: Bearer fw_CAf1CRZhA1rwTVMJC5STY6" https://api.fireworks.ai/inference/v1/models`
*   **Result**: Returned 7 models (`flux-1-schnell-fp8`, `gpt-oss-120b`, `glm-5p1`, `deepseek-v4-pro`, `kimi-k2p6`, `kimi-k2p5`, `glm-5p2`). Gemma 4 is **NOT** available through the active provider account.
*   **Action**: In accordance with the Phase 3 directive ("Do NOT force unsupported configurations"), Gemma 4 has not been forced into the active routing configuration.

---

## 2. Model Routing Configurations

| Parameter | Previous Configuration | Current Configuration | Rationale |
|---|---|---|---|
| **Default Complex Model** | `llama-v3-70b-instruct` | `deepseek-v4-pro` | Selected based on active model list availability on Fireworks API. |
| **Default Simple Model** | `llama-v3-8b-instruct` | `llama-v3-8b-instruct` | Retained local mock fallback configuration for fast sandbox pipelines. |
| **AMD Local Model** | `facebook/opt-125m` | `facebook/opt-125m` | Verified model for local ROCm/HIP vLLM GPU inference container execution. |

---

## 3. Inference Status

*   **Fireworks Core**: Verified using `accounts/fireworks/models/deepseek-v4-pro` (latency `3.47s`, status `200 OK`).
*   **Local AMD Core**: Verified using `facebook/opt-125m` on ROCm 7.2 (throughput `1.39 prompt/sec`, status `OK`).
