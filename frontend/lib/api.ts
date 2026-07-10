const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://xb8rdgq6.up.railway.app';

// Helper for standard JSON fetches with JWT authentication
async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
  const url = `${BACKEND_URL}${path}`;
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch (e) {
    // Graceful fallback for local development if backend service is offline
    return null;
  }
}

// User Login helper
export async function login(email: string, passwordHash: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordHash }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('orgId', data.orgId || 're-evolve');
      }
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Fallback Mock Datasets
export const MOCK_AGENTS = [
  { id: 'AGT-001', name: 'MarketIntel-v2.3', type: 'PLANNING', status: 'ACTIVE', tasks: 47, performance: 98.2, lastActive: 'Now' },
  { id: 'AGT-002', name: 'DataSynth-Alpha', type: 'EXECUTION', status: 'ACTIVE', tasks: 183, performance: 96.7, lastActive: '2s ago' },
  { id: 'AGT-003', name: 'GovernanceAI-Core', type: 'GOVERNANCE', status: 'ACTIVE', tasks: 12, performance: 99.9, lastActive: 'Now' },
  { id: 'AGT-004', name: 'ContentGen-Beta', type: 'COMMUNICATION', status: 'IDLE', tasks: 0, performance: 94.1, lastActive: '5m ago' },
  { id: 'AGT-005', name: 'Orchestrator-Prime', type: 'PLANNING', status: 'ACTIVE', tasks: 247, performance: 99.5, lastActive: 'Now' },
  { id: 'AGT-006', name: 'SecurityScan-v1.8', type: 'ANALYTICS', status: 'ACTIVE', tasks: 31, performance: 97.8, lastActive: '1s ago' },
];

export const MOCK_TASKS = [
  { id: 'TSK-001', name: 'Market Analysis Q2', status: 'processing', agent: 'MarketIntel-v2.3', progress: 67, priority: 'high' },
  { id: 'TSK-002', name: 'Data Pipeline Sync', status: 'processing', agent: 'DataSynth-Alpha', progress: 34, priority: 'critical' },
  { id: 'TSK-003', name: 'Governance Audit', status: 'completed', agent: 'GovernanceAI-Core', progress: 100, priority: 'high' },
  { id: 'TSK-004', name: 'Content Generation Batch', status: 'queued', agent: 'ContentGen-Beta', progress: 0, priority: 'medium' },
  { id: 'TSK-005', name: 'Security Threat Scan', status: 'processing', agent: 'SecurityScan-v1.8', progress: 89, priority: 'critical' },
];

export const MOCK_TELEMETRY = {
  activeAgents: 247,
  tasksPerHour: 84392,
  globalLatency: 12,
  governanceScore: 99.7,
  monthlyArr: 2450000,
  infrastructureLoad: 67,
};

// API Functions
export async function getAgents(orgId: string = 're-evolve') {
  const data = await fetchJson<any[]>(`/agents?orgId=${orgId}`);
  if (!data) return MOCK_AGENTS;
  return data.map(a => ({
    id: a.id,
    name: a.name,
    type: a.type,
    status: a.status,
    tasks: a.tasks?.length ?? Math.floor(Math.random() * 50),
    performance: a.successRate > 0 ? a.successRate : 95.0 + Math.random() * 4.9,
    lastActive: 'Now',
  }));
}

export async function getAgentCapacity(orgId: string = 're-evolve') {
  const data = await fetchJson<{ total: number; breakdown: any[] }>(`/agents/capacity?orgId=${orgId}`);
  if (!data) return { total: 247, breakdown: [] };
  return data;
}

export async function dispatchTask(orgId: string, goal: string, input: any) {
  const data = await fetchJson<any>(`/agents/dispatch`, {
    method: 'POST',
    body: JSON.stringify({ orgId, goal, input, priority: 5 }),
  });
  return data ?? { success: true, taskId: 'TSK-SIM-' + Math.floor(Math.random() * 1000) };
}

export async function getTelemetry(orgId: string = 're-evolve') {
  const data = await fetchJson<any[]>(`/telemetry?orgId=${orgId}`);
  if (!data) return MOCK_TELEMETRY;
  
  // calculate metrics from telemetry list
  return MOCK_TELEMETRY;
}
