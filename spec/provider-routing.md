# Provider Routing Specification

## 1. Routing Logic
HGI implements a dynamic, hardware-aware routing layer to optimize for compute performance and data privacy.

### 1.1 The Priority Hierarchy
1. **Primary: AMD Instinct Clusters (ROCm/vLLM)**
   - Used for: High-throughput reasoning, large context windows, and sensitive data.
   - Advantage: Maximum performance, local data residency.
2. **Secondary: Fireworks AI (Cloud Inference)**
   - Used for: Rapid prototyping, low-latency small model calls, and failover.
   - Advantage: High availability, managed infrastructure.

### 1.2 Failover Mechanism
The system uses a "Racing-and-Failover" strategy:
- **Step 1**: Request is sent to the AMD Instinct endpoint.
- **Step 2**: A timer is started (Threshold: 500ms).
- **Step 3**: If no response is received within the threshold, the request is mirrored to Fireworks AI.
- **Step 4**: The first successful response is used; the slower request is cancelled.

## 2. Provider Configuration
The `ModelService` manages provider keys and endpoints:
- **AMD Cloud**: Uses an API key for the AMD AI Developer Cloud.
- **Fireworks**: Uses an API key for the Fireworks AI Gateway.
- **LiteLLM**: Acts as the abstraction layer, normalizing requests across different provider APIs.

## 3. Routing Policies
CENSA can override routing based on the **Intent**:
- **`SENSITIVE` Intent**: Forced routing to local AMD compute (bypass cloud).
- **`FAST_PROTOTYPE` Intent**: Forced routing to Fireworks AI for minimal latency.
- **`HEAVY_REASONING` Intent**: Prioritize MI300X clusters due to larger VRAM.
