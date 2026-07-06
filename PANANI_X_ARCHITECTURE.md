# PANANI X COMPILER ARCHITECTURE

This document outlines the compiler stages mapping Panani X DSL source files to executable Python SDK commands.

---

## 1. Compilation Pipeline

```
Panani X Source (.panani)
          ↓
  Lexer & Parser (AST)
          ↓
  Semantic Analyzer (Policies check)
          ↓
Code Generator (Python SDK Commands)
          ↓
   HGI Swarm Execution
```

---

## 2. Code Generation Mapping Example

A source declaration compiles directly into:
```python
# Compiled from agent Researcher {...}
researcher_agent = client.agents.create(
    name="Researcher",
    model="anthropic/claude-3.5-sonnet",
    tools=["web.search", "document.parser"]
)
```
