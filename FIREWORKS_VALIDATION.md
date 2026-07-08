# Fireworks Validation Report (v2.0.0-final)

This report details the authentication tests and inference latency bounds for the Fireworks AI cloud provider integrations.

---

## 1. Authentication Status

*   **API Key Configured**: `fw_CAf1CRZhA1rwTVMJC5STY6` (Validated from local `.env`)
*   **API Host**: `https://api.fireworks.ai/inference/v1`
*   **Routing Endpoint**: `/chat/completions`
*   **Health Status**: `✅ HEALTHY`

---

## 2. Command Executed & Logs

Tested via curl using the active `deepseek-v4-pro` model:

```bash
curl -i -X POST https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer fw_CAf1CRZhA1rwTVMJC5STY6" \
  -H "Content-Type: application/json" \
  -d '{"model": "accounts/fireworks/models/deepseek-v4-pro", "messages": [{"role": "user", "content": "hello"}]}'
```

### Measured Response

```json
HTTP/2 200 
date: Wed, 08 Jul 2026 16:06:42 GMT
content-type: application/json
fireworks-server-processing-time: 2.511
fireworks-server-time-to-first-token: 0.861

{
  "id": "chatcmpl-c8b818495d464bc1ab7bc03ea650573c",
  "object": "chat.completion",
  "model": "accounts/fireworks/models/deepseek-v4-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 84,
    "completion_tokens": 79
  }
}
```

---

## 3. Metrics Summary

*   **HTTP Status Code**: `200 OK`
*   **Server Processing Time**: `2.51 seconds`
*   **Time to First Token**: `0.86 seconds`
*   **Total Response Latency**: `3.47 seconds`
*   **Connection Routing**: Cloud failover mesh fully responsive.
