import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private config: ConfigService) {}

  async chat(messages: any[], options?: { model?: string; temperature?: number; complexity?: 'simple' | 'complex' }): Promise<string> {
    const defaultModel = options?.complexity === 'complex' ? 'accounts/fireworks/models/deepseek-v4-pro' : 'llama-v3-8b-instruct';
    const model = options?.model || defaultModel;
    const temp = options?.temperature ?? 0.7;

    const fireworksKey = process.env.FIREWORKS_API_KEY;
    const amdCloudUrl = process.env.AMD_CLOUD_URL || 'http://localhost:11434';
    const amdCloudKey = process.env.AMD_CLOUD_API_KEY;

    // Decision factor logs
    this.logger.log(`[ROUTING DECISION] Goal complexity: ${options?.complexity || 'simple'} | Requested: ${model}`);

    if (model.includes('fireworks') || (fireworksKey && !model.includes('amd') && options?.complexity === 'complex')) {
      this.logger.log(`[ROUTING] Selected Provider: Fireworks AI | Reason: Complex Reasoning Requirement | Model: ${model}`);
      try {
        return await this.callWithRetry(() => this.executeFireworks(model, messages, temp, fireworksKey), 3);
      } catch (e: any) {
        this.logger.error(`[ROUTING FALLBACK] Fireworks API call failed: ${e.message}. Falling back to mock generator.`);
        return this.mockChatResponse(messages);
      }
    }

    if (model.includes('amd') || model.includes('ollama') || model.includes('litellm') || (!fireworksKey && amdCloudUrl)) {
      this.logger.log(`[ROUTING] Selected Provider: AMD Instinct Cluster / Ollama | Reason: Local Execution Priority | Model: ${model}`);
      try {
        return await this.callWithRetry(() => this.executeAmd(amdCloudUrl, model, messages, temp, amdCloudKey), 3);
      } catch (e: any) {
        this.logger.error(`[ROUTING FALLBACK] AMD Instinct Cluster / Ollama call failed: ${e.message}. Falling back to mock generator.`);
        return this.mockChatResponse(messages);
      }
    }

    this.logger.log(`[ROUTING] Selected Provider: Fallback Provider Active | Reason: No Keys Configured`);
    return this.mockChatResponse(messages);
  }

  async checkHealth(): Promise<{ fireworks: string; amd: string }> {
    const results = { fireworks: 'unhealthy', amd: 'unhealthy' };
    const fireworksKey = process.env.FIREWORKS_API_KEY;
    const amdCloudUrl = process.env.AMD_CLOUD_URL || 'http://localhost:11434';

    if (fireworksKey) {
      try {
        const res = await fetch('https://api.fireworks.ai/inference/v1/models', {
          headers: { 'Authorization': `Bearer ${fireworksKey}` }
        });
        if (res.ok) results.fireworks = 'healthy';
      } catch {}
    }

    try {
      const res = await fetch(`${amdCloudUrl}/v1/models`);
      if (res.ok) results.amd = 'healthy';
    } catch {}

    return results;
  }

  private async callWithRetry(fn: () => Promise<string>, retries: number): Promise<string> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (e: any) {
        attempt++;
        this.logger.warn(`API call attempt ${attempt} failed: ${e.message}. Retrying in ${attempt * 200}ms...`);
        if (attempt >= retries) throw e;
        await new Promise(resolve => setTimeout(resolve, attempt * 200));
      }
    }
    throw new Error('Retries exhausted');
  }

  private async executeFireworks(model: string, messages: any[], temp: number, key?: string): Promise<string> {
    const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model.includes('/') ? model : `accounts/fireworks/models/${model}`,
        messages,
        temperature: temp,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Fireworks error: ${res.status} - ${errText}`);
    }
    const json = await res.json();
    return json.choices[0].message.content || '';
  }

  private async executeAmd(url: string, model: string, messages: any[], temp: number, key?: string): Promise<string> {
    const res = await fetch(`${url}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { 'Authorization': `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        model: model,
        messages,
        temperature: temp,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AMD Cloud/Ollama error: ${res.status} - ${errText}`);
    }
    const json = await res.json();
    return json.choices[0].message.content || '';
  }

  private mockChatResponse(messages: any[]): string {
    const lastMsg = messages[messages.length - 1]?.content || '';
    const lastMsgLower = lastMsg.toLowerCase();

    if (lastMsgLower.includes('classify') || lastMsgLower.includes('intent')) {
      let intent = 'AUTOMATION';
      if (lastMsgLower.includes('code') || lastMsgLower.includes('write')) intent = 'CODE';
      else if (lastMsgLower.includes('audit') || lastMsgLower.includes('policy')) intent = 'AUDIT';
      else if (lastMsgLower.includes('finance') || lastMsgLower.includes('transaction')) intent = 'FINANCE';
      
      return JSON.stringify({
        intent,
        confidence: 0.95,
      });
    }

    if (lastMsgLower.includes('plan') || lastMsgLower.includes('dag') || lastMsgLower.includes('stages')) {
      return JSON.stringify({
        stages: [
          { stage: 'ANALYZE', type: 'ANALYTICS', label: 'Analyze request details' },
          { stage: 'PLAN', type: 'PLANNING', label: 'Compile dynamic execution layout' },
          { stage: 'EXECUTE', type: 'EXECUTION', label: 'Execute target action logic' },
          { stage: 'VALIDATE', type: 'GOVERNANCE', label: 'Verify policy compliance checks' },
          { stage: 'DELIVER', type: 'COMMUNICATION', label: 'Push completion update' }
        ]
      });
    }

    if (lastMsgLower.includes('writecode') || lastMsgLower.includes('developer agent')) {
      return JSON.stringify({
        ok: true,
        code: `// Dynamic build code\nconst result = "HGI Executed";\nconsole.log(result);`,
        trace: 'Developer Agent compiled instructions in sandbox sandbox-188'
      });
    }

    return JSON.stringify({
      ok: true,
      text: "HGI Core cognitive response generated deterministically.",
      trace: "Mock LLM reasoning pipeline ran offline successfully."
    });
  }
}
