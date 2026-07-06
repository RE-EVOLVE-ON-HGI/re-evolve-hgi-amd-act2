import { Injectable, Logger } from '@nestjs/common';
import { ModelService } from '../../model/model.service';

@Injectable()
export class IntentService {
  private readonly logger = new Logger(IntentService.name);

  constructor(private model: ModelService) {}

  async classify(goal: string): Promise<string> {
    this.logger.log(`Classifying intent for goal: "${goal}"`);
    try {
      const prompt = `Classify the following user goal into one of these intents: CODE, AUDIT, FINANCE, AUTOMATION. Return ONLY a JSON object with keys "intent" and "confidence". Goal: "${goal}"`;
      const response = await this.model.chat([{ role: 'user', content: prompt }], { temperature: 0.1 });
      const parsed = JSON.parse(response);
      return parsed.intent || 'AUTOMATION';
    } catch (e: any) {
      this.logger.warn(`Intent classification failed: ${e.message}. Defaulting based on keywords.`);
      const lower = goal.toLowerCase();
      if (lower.includes('code') || lower.includes('build') || lower.includes('write')) return 'CODE';
      if (lower.includes('audit') || lower.includes('policy') || lower.includes('compliance')) return 'AUDIT';
      if (lower.includes('finance') || lower.includes('cost') || lower.includes('revenue') || lower.includes('ledger')) return 'FINANCE';
      return 'AUTOMATION';
    }
  }
}
