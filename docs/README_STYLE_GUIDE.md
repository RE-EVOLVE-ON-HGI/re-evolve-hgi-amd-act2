# README Style Guide
## Re-Evolve on HGI · Documentation Standards

---

## 1. Design Philosophy

Every document in this repository should feel like a page of a world-class developer platform. The test: would a senior engineer at Stripe, Vercel, or a leading AI infrastructure company find this document trustworthy, readable, and impressive?

If the answer is no, rewrite it.

---

## 2. Structure

### 2.1 File Naming

- Use `UPPER_SNAKE_CASE` for root-level docs: `ARCHITECTURE.md`, `CONTRIBUTING.md`
- Use `UPPER_SNAKE_CASE` for docs in `docs/`: `docs/COLLABORATION.md`
- Use descriptive names that match section topic exactly

### 2.2 Document Structure

Every root-level document must contain:
1. A title (`# Title`) with a clear subtitle
2. A horizontal rule (`---`) after the title block
3. A brief paragraph stating the document's purpose
4. Section headers using `##` (major) and `###` (sub)
5. A horizontal rule before any major section transition

### 2.3 Section Numbering

README sections are numbered using the pattern `## 🔸 Section NN — Title` to allow direct linking and judge navigation.

---

## 3. Voice & Tone

| Do | Don't |
|----|-------|
| Write as an engineer to engineers | Write marketing copy |
| State what something does precisely | Claim things without technical backing |
| Acknowledge limitations honestly | Overstate capabilities |
| Use active voice | Use passive constructions |
| Be specific (numbers, latencies, thresholds) | Be vague ("fast", "smart", "powerful") |

**Good example:**
> Kavacha scans tool input parameters against an inline policy set before every execution. Actions like `curl`, `wget`, or unverified `npm install` are blocked at the call site, not after the fact.

**Bad example:**
> Kavacha is a powerful, intelligent security system that makes your AI safer.

---

## 4. Badges

Use `shields.io` flat-square style badges with `labelColor=0d1117` consistently:

```markdown
[![Label](https://img.shields.io/badge/Label-Value-COLOR?style=flat-square&labelColor=0d1117)](URL)
```

**Color palette:**
- Version / Core: `3b82f6` (blue)
- Governance / Security: `ef4444` (red)
- AMD: `e85600` (AMD orange)
- Memory / Data: `06b6d4` (cyan)
- Runtime / Exec: `22c55e` (green)
- AI / Models: `8b5cf6` (purple)
- License / Legal: `8b5cf6` (purple)

---

## 5. Mermaid Diagrams

- Always use dark theme node colors: `fill:#0f172a,stroke:#COLOR,color:#e2e8f0`
- Label arrows with action verbs, not nouns
- Use `sequenceDiagram` for multi-actor flows
- Use `graph TD` for dependency hierarchies
- Use `flowchart LR` for process flows
- Use `timeline` for roadmaps
- Prefer meaningful node IDs over letters

---

## 6. SVG Assets

- All SVGs use `viewBox` with explicit `width` and `height`
- Background: `#060912` to `#0a0f1e` gradient
- Primary font: `-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`
- Monospace: `ui-monospace,SFMono-Regular,monospace`
- All SVGs must be GitHub-renderable (no external resource loading)
- Store SVGs in `.github/assets/`

---

## 7. Tables

Use tables for:
- Technology comparisons
- Feature matrices
- Quick reference grids
- Component responsibility summaries

Every table must have a clear header row. No empty cells — use `—` for not applicable.

---

## 8. Code Blocks

- Always specify the language identifier
- Use `bash` for terminal commands
- Use `typescript` for TS/JS code
- Use `yaml` for config files
- Use `json` for API payloads
- Include comments explaining non-obvious lines

---

## 9. Collapsible Sections

Use `<details>/<summary>` for:
- Deep component documentation in the README
- Implementation internals that experts want but newcomers don't need immediately
- Long code examples

Always include a ` ▸ ` symbol or bold text in the summary.

---

## 10. Accessibility

- Every SVG must have an `alt` attribute in its `<img>` tag
- Tables must have header rows
- Collapsible sections must have descriptive summary text
- Color alone must never convey meaning — pair with text labels
