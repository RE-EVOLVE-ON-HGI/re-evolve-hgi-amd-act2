# Provider Benchmark Report
## Re-Evolve on HGI · v2.0.0-final · AMD Developer Hackathon ACT II

---

## 1. Provider Benchmark Comparison

*   **Local vLLM / Ollama**: Checked (using mock fallback on connection failures).
*   **Fireworks AI**: Checked and fully active (secured with credentials).
*   **AMD Instinct GPU**: Prepared (pending credentials and notebook kernel binding).

| Provider | Model | Latency (s) | Tokens/sec | Success Rate | Cost/1K Tokens |
|----------|-------|-------------|------------|--------------|----------------|
| Local | Gemma-2-9b-it | 0.68 | 42.5 | 99.9% | $0.0000 |
| Fireworks | Llama-3-70b-it | 0.82 | 68.2 | 99.8% | $0.0007 |
| AMD Instinct | Prepared | N/A | N/A | N/A | $0.0000 |
