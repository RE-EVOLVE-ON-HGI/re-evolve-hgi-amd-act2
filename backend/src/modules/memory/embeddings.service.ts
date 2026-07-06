import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Embeddings boundary. Calls the configured provider; falls back to a
 * deterministic hash-embedding when no API key is present (keeps dev offline).
 */
@Injectable()
export class EmbeddingsService {
  constructor(private config: ConfigService) {}

  async embed(text: string): Promise<number[]> {
    const apiKey = this.config.get<string>('vector.embeddingsApiKey');
    const model = this.config.get<string>('vector.embeddingsModel');
    if (apiKey) {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, input: text }),
      });
      const json = await res.json();
      return json.data[0].embedding;
    }
    return this.hashEmbed(text, 1536);
  }

  private hashEmbed(text: string, dims: number): number[] {
    const v = new Array(dims).fill(0);
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      v[(c * 31 + i) % dims] += ((c % 13) - 6) / 6;
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map((x) => x / norm);
  }
}
