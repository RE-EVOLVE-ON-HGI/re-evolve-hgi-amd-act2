# Agent Contracts Specification

## 1. The Agent Interface
Every agent in the HGI Registry must adhere to a strict behavioral contract to ensure predictable orchestration.

### 1.1 Input Contract
Agents must accept a `TaskContext` object:
```typescript
interface TaskContext {
  goal: string;               // The high-level mission goal
  taskDescription: string;    // The specific instruction for this node
  dependencies: any[];        // Results from previous DAG nodes
  memoryContext: string[];    // Injected semantic memories
  constraints: Constraint[];  // Governance boundaries (read-only)
}
```

### 1.2 Output Contract
Agents must return a `TaskResult` object:
```typescript
interface TaskResult {
  status: 'SUCCESS' | 'FAILURE' | 'RETRY';
  outcome: string;            // The result of the task
  artifacts: Artifact[];      // Files, data, or links generated
  confidence: number;         // Self-assessed confidence (0.0 - 1.0)
  logs: string[];             // Execution trace for auditing
}
```

## 2. Capability Declarations
Agents must register themselves with a set of `SkillTags`.
- **Example**: `CodeSynth` $\rightarrow$ `[typescript, refactor, test_gen]`.
- **Matching Logic**: CENSA matches `Task.RequiredSkills` $\subseteq$ `Agent.SkillTags`.

## 3. Behavioral Expectations
- **Statelessness**: Agents should treat each task as a stateless operation, relying on `TaskContext` for all necessary information.
- **Tool Usage**: Agents must only use tools provided by the Panani X runtime.
- **Honesty**: Agents must report a low `confidence` score if they are unable to guarantee the accuracy of the result.
