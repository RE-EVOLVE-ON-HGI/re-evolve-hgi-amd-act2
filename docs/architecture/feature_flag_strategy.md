# Re-Evolve V3 — Feature Flag Strategy (Project Singularity)

This document specifies the feature flag framework and access rules designed to enforce **Ultra Tier Exclusivity** on **Re-Evolve V3**.

---

## 1. Feature Flags Catalog

V3 access is controlled at the tenant level. Lower-tier users (e.g., Free, Growth) do not see V3 features.

| Flag Name | Tier Requirement | Scope | Description |
|---|---|---|---|
| `V3_ENABLED` | Ultra, Ultra Max, Internal | Global | Switches dashboard shell layout to the V3 Cosmic theme. See [hq layout](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/layout.tsx). |
| `AGENT_OS_ENABLED` | Ultra Max, Internal, Partners | Workspace | Unlocks the Sārathi Orchestrator canvas. See [sarathi canvas](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/sarathi). |
| `MARKETPLACE_ENABLED` | Ultra, Ultra Max, Partners | Global | Unlocks the Skill/Asset Marketplace directory. See [marketplace tab](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/ecosystem). |
| `HGI_NATIVE_ENABLED` | Ultra Max, Internal | Agent | Enables routing intents to Google's HGI Brain engine. See [neural core](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/neural-core). |

---

## 2. Architecture: Redis-Backed Fast Guard

Since feature flags are evaluated on every REST request and page load, evaluations are cached in **Redis** with a write-through pattern to PostgreSQL.

```
Next.js Page request
  │
  ▼
Middleware Check (Cookie / JWT contains tier claims)
  │
  ▼
Redis Cache lookup (Key: "tenant:{orgId}:flags")
  ├── Cache Hit: Returns boolean instantly (1-2ms)
  └── Cache Miss: Reads from PostgreSQL organization metadata, warms Redis, and returns (15-20ms)
```

For general topology layers, see Layer 1 of [system_architecture.md](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/docs/architecture/system_architecture.md#layer-1-identity--workspace-os).

---

## 3. Implementation

### 3.1 Next.js Page Guard Middleware
Located at the edge level. If a lower-tier user tries to bypass standard tabs, this guard redirects them to V2.

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  
  // Decodes JWT payload containing user tier
  const tier = decodeJwtTier(token)
  
  const targetPath = request.nextUrl.pathname
  
  if (targetPath.startsWith('/hq') && !isV3Authorized(tier)) {
    // Redirects lower-tier user to V2 stable dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

function isV3Authorized(tier: string): boolean {
  return ['ULTRA', 'ULTRA_MAX', 'INTERNAL', 'PARTNER'].includes(tier)
}
```

### 3.2 React Component Feature Gate Hook
Used to hide UI items (like the marketplace tab or the generation button) inside the admin views (e.g. [settings/page.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/settings) or [security/page.tsx](file:///Users/nextunicorn/.gemini/antigravity-ide/scratch/re-evolve-v3/frontend/app/hq/security)):

```tsx
import { useUserStore } from '@/lib/store'

export function useFeatureFlag() {
  const { user } = useUserStore()
  
  const isEnabled = (flag: string): boolean => {
    const userTier = user?.tier ?? 'FREE';
    
    switch(flag) {
      case 'V3_ENABLED':
        return ['ULTRA', 'ULTRA_MAX', 'INTERNAL'].includes(userTier);
      case 'AGENT_OS_ENABLED':
        return ['ULTRA_MAX', 'INTERNAL'].includes(userTier);
      default:
        return false;
    }
  }

  return { isEnabled }
}
```
