# PANANI X DSL SPECIFICATION

Panani X is a domain-specific language (DSL) for declaring agent specifications, goals, memory stores, and Swarm workflows.

---

## 1. Core Elements

### 1.1 Agent Declaration
Defines an agent persona, associated model router preferences, and allowed capability scopes.

### 1.2 Goal
Specifies target objectives, outputs, and performance evaluation metrics.

### 1.3 Memory & Knowledge
Defines vector nodes and source documents to inject on launch.

---

## 2. Example Program

```panani
agent Researcher {
  model: "anthropic/claude-3.5-sonnet",
  policies: ["governance.safety.strict"],
  tools: ["web.search", "document.parser"]
}

workflow ResearchVenture {
  goal: "Perform competitive market audit on EV startups in SE Asia",
  memory: "market_research_baseline_v1",
  knowledge: ["/docs/ev_startups_2026.pdf"],
  
  execute {
    Researcher -> search("EV startups funding rounds 2026")
               -> analyze()
               -> compile_report("/tmp/ev_report.pdf")
  }
}
```
