# Memory Model Specification

## 1. Hybrid Memory Architecture
HGI employs a two-tiered memory system to balance raw history with semantic intelligence.

### Tier 1: Episodic Memory (The Ledger)
- **Implementation**: PostgreSQL + pgvector.
- **Content**: Every raw interaction, tool call, and system log.
- **Access**: Sequential retrieval by Mission ID.
- **Purpose**: Full auditability and exact state reconstruction.

### Tier 2: Semantic Memory (The Knowledge Graph)
- **Implementation**: Qdrant Vector Database.
- **Content**: Compressed embeddings of successful mission outcomes and learned patterns.
- **Access**: K-Nearest Neighbor (KNN) search via embeddings.
- **Purpose**: Cross-mission learning and intent-based retrieval.

## 2. The Memory Lifecycle
1. **Ingestion**: Every `TaskResult` is written to the Episodic Ledger.
2. **Compression**: At the end of a Mission, a "Summarizer Agent" extracts key insights.
3. **Indexing**: Insights are embedded and stored in the Semantic Memory.
4. **Retrieval**: Before a task starts, CENSA queries semantic memory for similar past tasks and injects the "lessons learned" into the agent's context.

## 3. Memory Governance
- **Privacy**: Memory is segmented by User/Organization IDs.
- **Forgetting**: Supports TTL (Time-To-Live) for episodic data and manual purging of semantic vectors.
- **Verification**: All retrieved memories are passed through Kavacha to ensure they don't violate current security policies.
