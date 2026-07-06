# Re-Evolve V3 — The Design Canon (Project Singularity)

This document specifies the UI styling guidelines, component design patterns, motion rules, and accessibility standards for the **Re-Evolve V3 (Project Singularity)** visual design system.

---

## 1. Core Styling Rules & Color Tokens

V3 uses a premium **Cosmic Space** styling framework. All components must adhere to the following CSS properties and tokens:

```
┌───────────────────┬─────────────────────────────────────────────────────┐
│ Design Token      │ CSS Definition                                      │
├───────────────────┼─────────────────────────────────────────────────────┤
│ Base Background   │ background: #030303;                                │
│ Panel Surface     │ background: rgba(13, 13, 21, 0.75);                 │
│ Primary Glow      │ box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);      │
│ Border Stroke     │ border: 1px solid rgba(255, 255, 255, 0.08);        │
│ Glassmorphism     │ backdrop-filter: blur(16px) saturate(180%);         │
│ Font Family       │ font-family: 'Outfit', 'Inter', sans-serif;         │
│ Monospace Font    │ font-family: 'Geist Mono', monospace;               │
└───────────────────┴─────────────────────────────────────────────────────┘
```

### Color Palette Scheme:
*   **Hyper Indigo** (`#6366F1`): Primary actions, active indicators, and focus outlines.
*   **Emerald Status** (`#10B981`): Approved checkpoints, active agent status, and positive financial trends.
*   **Crimson Threat** (`#EF4444`): Policy violations, depleted balances, and sandbox execution errors.
*   **Cosmic Pink** (`#EC4899`): Highlight indicators for strategic agent plans and marketplace details.

---

## 2. Best UI Patterns from V2

We extracted the following patterns from the V2 codebase as the basis for the V3 Design Canon:

### 2.1 Mission Control HQ Dashboard
*   **Pattern**: Grid arrangement of metrics.
*   **Implementation**: Placed at [page.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/page.tsx), combining `MetricCard` widgets with live telemetry metrics, agent queue counts, and monthly transaction volumes.

### 2.2 Sārathi Orchestrator Canvas
*   **Pattern**: 3D node-graph workflow canvas.
*   **Implementation**: Placed at [sarathi/page.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/sarathi), rendering agent planning paths as interactive 3D graphs (built with React Three Fiber) with connection animations.

### 2.3 Agent Fleet Manager
*   **Pattern**: Real-time workload monitoring cards.
*   **Implementation**: Placed at [agents/page.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/agents), using `NeuralPulse` components to show active agents, and showing success rates and model metrics.

---

## 3. Motion & Transition System (Framer Motion)

V3 animations must feel responsive and natural:

### 3.1 Interactive Button Spring
Interactive elements scale slightly on hover and compress when clicked:
```tsx
import { motion } from 'framer-motion'

export function SpringButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md"
    >
      {children}
    </motion.button>
  )
}
```

### 3.2 Page Transition Layout
Subsequent page routing slide-up and fade-in to prevent visual flickering:
```tsx
export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.25, ease: "easeInOut" }
}
```

---

## 4. Accessibility (A11y) & Contrast Guidelines

*   **Keyboard Navigation**: All interactive elements (e.g. workspace tabs, agents, settings panels) must support keyboard focus outlines.
*   **Focus Ring Outlines**: Focus rings must use Hyper Indigo outlines:
    ```css
    outline: 2px solid #6366F1;
    outline-offset: 2px;
    ```
*   **Contrast Ratios**: Static telemetry text labels and metric values must maintain a WCAG AAA minimum contrast ratio of `4.5:1` against the Dark Space background.
*   **Aria Labels**: All interactive charts and gauges must include semantic descriptions (`aria-label`, `aria-describedby`) to support screen readers.
