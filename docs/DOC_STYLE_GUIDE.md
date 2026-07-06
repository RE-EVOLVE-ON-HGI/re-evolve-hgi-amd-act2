# Documentation Style Guide
## Re-Evolve on HGI · Technical Writing Standards

---

## 1. Purpose

This guide defines the standards for all technical documentation in the Re-Evolve on HGI repository. It covers document structure, writing conventions, terminology, diagram standards, and review criteria.

Every document should pass the **"Senior Engineer Test"**: would a principal engineer at an enterprise AI company consider this documentation trustworthy, precise, and production-grade?

---

## 2. Document Hierarchy

```
README.md                   Landing experience — engineer-first
ARCHITECTURE.md             Deep technical design
QUICKSTART.md               30-second to running
docs/
  COLLABORATION.md          Builder-to-builder invitation
  ROADMAP.md                The Journey Ahead
  OPEN_LETTER_TO_AMD.md     Founder letter
  README_STYLE_GUIDE.md     This guide's companion
  DOC_STYLE_GUIDE.md        This file
Component docs:
  CENSA.md                  Orchestrator internals
  PANANI_X.md               Runtime internals
  KAVACHA.md                Governance internals
  AMD.md                    Hardware integration
```

---

## 3. Writing Principles

### 3.1 Precision Over Prose

State what a system does in measurable terms:

- ✅ "Kavacha evaluates tool calls inline before execution, adding <2ms latency per call."
- ❌ "Kavacha provides powerful security features."

### 3.2 Show Don't Tell

Every claim should be backed by one of:
- A code snippet showing the implementation
- A configuration file demonstrating the setting
- A test result showing measured behavior
- A diagram showing the relationship

### 3.3 Audience Awareness

Write every document knowing three audiences will read it:
1. **Engineers** who want to integrate or contribute
2. **Evaluators** (judges, investors, enterprise buyers) who need confidence signals
3. **Future maintainers** who need to understand design decisions

### 3.4 No Hype Words

Banned words and phrases:
- revolutionary, breakthrough, cutting-edge, game-changing
- "simply", "just", "easily" (implying it should be easy when it isn't)
- "best in class", "industry-leading"
- vague superlatives without supporting data

---

## 4. Terminology

Use these terms consistently across all documents:

| Preferred Term | Avoid |
|----------------|-------|
| Agent | Bot, AI, model (when referring to an agent specifically) |
| Task DAG | Task graph, pipeline (unless using DAG precisely) |
| Governance | Safety (too broad), guardrails (too informal) |
| Execution isolate | Sandbox (acceptable but prefer isolate for precision) |
| Persistent memory | Memory, storage (use the specific tier name when possible) |
| AMD AI Developer Cloud | AMD Cloud (use full name on first occurrence) |
| Inference endpoint | Model endpoint, LLM endpoint |

---

## 5. Document Template

Every component documentation file should follow:

```markdown
# [Component Name]
## [Subtitle — one sentence description]

[2-3 sentence overview of what this component does, why it exists, and how it fits into the OS]

---

## Purpose

[Single paragraph explaining the problem this component solves]

## Architecture

[Diagram or ASCII art showing internal structure]

## Responsibilities

- [Responsibility 1]
- [Responsibility 2]

## Configuration

[Key config options with types and defaults]

## API / Interface

[Public methods or endpoints with types]

## Limitations

[Honest description of current limitations and known constraints]

## See Also

[Links to related components]
```

---

## 6. Diagram Standards

### Mermaid (preferred for flows and sequences)

Always include dark-theme node styles:
```
style NodeId fill:#0f172a,stroke:#3b82f6,color:#e2e8f0
```

### SVG (preferred for hero images and static visuals)

- Minimum width: 700px, use `width="100%"` in img tags
- Dark background: `#060912` to `#0a0f1e`
- Accent palette: blue `#3b82f6`, purple `#8b5cf6`, cyan `#06b6d4`
- AMD accent: `#e85600`

---

## 7. Code Documentation

### Inline Comments

- Comment **why**, not **what**. The code shows what.
- Use full sentences with proper punctuation.
- Mark technical debt: `// ponytail: simplify once X is stable`

### README Code Blocks

Every code block in documentation must:
1. Have a language identifier
2. Be runnable without modification (or note required substitutions clearly)
3. Include output comments where helpful

```bash
# Run the backend development server
cd backend && npm run start:dev
# Expected: NestJS server starts at http://localhost:3001
```

---

## 8. Review Checklist

Before merging any documentation change:

- [ ] Title matches document content precisely
- [ ] No hype words or unverifiable superlatives
- [ ] All code blocks are tested and runnable
- [ ] All internal links resolve correctly
- [ ] All Mermaid diagrams have dark theme node styles
- [ ] All SVGs have descriptive alt text
- [ ] Tables have header rows
- [ ] Terminology matches the style guide
- [ ] Document passes the Senior Engineer Test
