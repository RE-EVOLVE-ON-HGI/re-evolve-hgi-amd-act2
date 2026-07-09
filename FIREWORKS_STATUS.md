# Fireworks Gateway Connection Status
## RE-EVOLVE ON HGI — Model Provider Health Check
**Generated:** 2026-07-09  
**Status:** ✅ authenticated / online

---

## 1. Authentication & Scope Verification

*   **API Endpoint**: `https://api.fireworks.ai/inference/v1`
*   **Authentication Key**: `fw_CAf1CRZhA1rwTVMJC5STY6` (Configured via `FIREWORKS_API_KEY`)
*   **Connection Status**: ✅ ONLINE (HTTP 200 on Model List queries)

---

## 2. Account Model Registry

The following models are verified as active and deployed under the current account credentials:

| Model ID | Object | Deployed By | Context Length | Status |
|---|---|---|---|---|
| `accounts/fireworks/models/flux-1-schnell-fp8` | image-model | fireworks | N/A | ONLINE |
| `accounts/fireworks/models/gpt-oss-120b` | chat-model | fireworks | 131,072 | ONLINE |
| `accounts/fireworks/models/glm-5p1` | chat-model | fireworks | 202,752 | ONLINE |
| `accounts/fireworks/models/deepseek-v4-pro` | chat-model | fireworks | 1,048,576 | ONLINE (Default) |
| `accounts/fireworks/models/kimi-k2p6` | chat-model | fireworks | 262,144 | ONLINE |
| `accounts/fireworks/models/kimi-k2p5` | chat-model | fireworks | 262,144 | ONLINE |
| `accounts/fireworks/models/glm-5p2` | chat-model | fireworks | 1,048,576 | ONLINE |

---

## 3. Quota & Credit Auditing
*   **Credit Balance**: Positive (Verified by successful DeepSeek-v4-pro completion responses).
*   **Rate Limits**: Nominal (0 throttles detected during parallel Media Swarm test runs).
*   **Gemma 4 Access**: ❌ Blocked (Model is not present in the account registry list).
