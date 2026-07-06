import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private config: ConfigService) {}

  async chat(messages: any[], options?: { model?: string; temperature?: number }): Promise<string> {
    const model = options?.model || 'llama-v3-8b-instruct';
    const temp = options?.temperature ?? 0.7;

    const fireworksKey = process.env.FIREWORKS_API_KEY;
    const amdCloudUrl = process.env.AMD_CLOUD_URL || 'http://localhost:11434';
    const amdCloudKey = process.env.AMD_CLOUD_API_KEY;

    if (model.includes('fireworks') || (fireworksKey && !model.includes('amd'))) {
      this.logger.log(`Routing chat request to Fireworks AI using model: ${model}`);
      try {
        const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${fireworksKey}`,
          },
          body: JSON.stringify({
            model: model.includes('/') ? model : `accounts/fireworks/models/${model}`,
            messages,
            temperature: temp,
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Fireworks API error: ${res.status} - ${errText}`);
        }
        const json = await res.json();
        return json.choices[0].message.content || '';
      } catch (e: any) {
        this.logger.error(`Fireworks chat call failed: ${e.message}. Falling back to mock generator.`);
        return this.mockChatResponse(messages);
      }
    }

    if (model.includes('amd') || model.includes('ollama') || model.includes('litellm')) {
      this.logger.log(`Routing chat request to AMD AI Developer Cloud / Ollama using model: ${model}`);
      try {
        const res = await fetch(`${amdCloudUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(amdCloudKey ? { 'Authorization': `Bearer ${amdCloudKey}` } : {}),
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
      } catch (e: any) {
        this.logger.error(`AMD Cloud/Ollama call failed: ${e.message}. Falling back to mock generator.`);
        return this.mockChatResponse(messages);
      }
    }

    this.logger.log(`No keys configured or local model specified. Using mock generator.`);
    return this.mockChatResponse(messages);
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
