/**
 * HGI TypeScript SDK Client
 * Lightweight client to communicate with the Re-Evolve on HGI platform.
 */
export class HgiSdk {
  private baseUrl: string;
  private token: string | null = null;

  constructor(options: { baseUrl?: string } = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:4000';
  }

  setToken(token: string) {
    this.token = token;
  }

  async login(email: string, passwordHash: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordHash }),
    });
    if (!res.ok) {
      throw new Error(`Login failed with status: ${res.status}`);
    }
    const data = await res.json();
    this.token = data.accessToken;
    return this.token || '';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
    };
  }

  async listAgents(orgId = 're-evolve') {
    const res = await fetch(`${this.baseUrl}/agents?orgId=${orgId}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  }

  async dispatchGoal(orgId: string, goal: string, input: Record<string, any> = {}, priority = 5) {
    const res = await fetch(`${this.baseUrl}/agents/dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ orgId, goal, input, priority }),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  }

  async getAgentCapacity(orgId = 're-evolve') {
    const res = await fetch(`${this.baseUrl}/agents/capacity?orgId=${orgId}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  }

  async retrieveMemory(orgId: string, query: string, limit = 5) {
    const res = await fetch(`${this.baseUrl}/memory/retrieve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ orgId, query, limit }),
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.json();
  }
}
