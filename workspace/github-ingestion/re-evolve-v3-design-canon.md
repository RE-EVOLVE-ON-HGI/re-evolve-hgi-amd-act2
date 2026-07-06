# Re-Evolve V3 — Visual Design Canon (Project Singularity)

This document specifies the UI extractions, visual patterns, and design guidelines derived from our ingested frontend repositories (**re-evolve-on-hgi-ui**, **map-for-HGI**, and **artoies-hub**).

---

## 1. Extracted Visual UI Patterns

We analyzed the visual interfaces in our ecosystem and identified the following patterns for Re-Evolve V3:

```
┌──────────────────────────┬──────────────────────────┬──────────────────────────────────────────┐
│ Interface Domain         │ Source Repository        │ Visual Pattern / Layout Description      │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────┤
│ Mission Control Dashboard│ re-evolve-on-hgi-ui      │ Multi-column layout with glowing cards   │
│                          │                          │ and real-time telemetry pulse indicators.│
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────┤
│ Geo-Spatial Logging      │ map-for-HGI (mapcn)      │ MapLibre GL overlays that render agent   │
│                          │                          │ actions on interactive dark maps.        │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────┤
│ Mobile Viewport Console  │ artoies-hub              │ Capacitor-optimized bottom navigation    │
│                          │                          │ bar with fast touch targets.             │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────────────┤
│ Orchestrator Canvas      │ re-evolve-on-hgi-ui      │ React Three Fiber 3D node graphs         │
│                          │                          │ rendering concentric agent execution paths.│
└──────────────────────────┴──────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. Component Design Canon Specs

### 2.1 The Mission Control Dashboard
*   **Source**: [re-evolve-on-hgi-ui](file:///Users/nextunicorn/Downloads/re-evolve-on-hgi-ui%20(1))
*   **Elements**:
    *   `MetricCard` ([design-system.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/components/hgi/design-system.tsx#L58-L107)): Glassmorphic metric display cards with dynamic shadows and trend percentages.
    *   `NeuralPulse` ([design-system.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/components/hgi/design-system.tsx#L122-L149)): Pulsing SVG circles that reflect CPU usage and task queues.
*   **Design Rule**: Metrics are updated in real-time using Socket.io subscriptions rather than periodic page polling.

### 2.2 Interactive Mapcn Layers
*   **Source**: [map-for-HGI (mapcn)](file:///Users/nextunicorn/Downloads/map-for-HGI)
*   **Elements**:
    *   MapLibre GL container styled with Tailwind CSS, utilizing OKLCH color spaces.
    *   Animated markers that trace agent execution locations.
*   **Design Rule**: All maps must use dark mode map tiles (`maplibre-gl-js`) to maintain the Cosmic Deep Space theme.

### 2.3 Mobile Layout (Capacitor Config)
*   **Source**: [artoies-hub](file:///Users/nextunicorn/Downloads/artoies-hub-main)
*   **Elements**:
    *   Bottom navigation bar, keeping actions within easy thumb reach.
    *   Fast status badge animations that use spring physics to confirm user taps.
*   **Design Rule**: Tap actions must provide immediate visual feedback (e.g. state color shifts or spring scale changes) to feel responsive on mobile.

---

## 3. Motion System & Styling Directives

To maintain a consistent visual experience across platforms, components must adhere to these Framer Motion rules:
*   **Standard Spring Transitions**:
    ```tsx
    const springTransition = { type: "spring", stiffness: 450, damping: 18 }
    ```
*   **Page Exit/Entry Transitions**:
    ```tsx
    const fadeSlideProps = {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 }
    }
    ```
*   **Borders & Outlines**: Interactive controls must use Hyper Indigo borders when focused:
    ```css
    border: 1px solid rgba(99, 102, 241, 0.4);
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
    ```
