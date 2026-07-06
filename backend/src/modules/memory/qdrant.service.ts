import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

const COLLECTION = 'hgi_memory';

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client!: QdrantClient;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    this.client = new QdrantClient({
      url: this.config.get('vector.url'),
      apiKey: this.config.get('vector.apiKey'),
    });
    try {
      const exists = await this.client.collectionExists(COLLECTION);
      if (!exists.exists) {
        await this.client.createCollection(COLLECTION, {
          vectors: { size: 1536, distance: 'Cosine' },
        });
      }
    } catch (e) { this.logger.warn(`Qdrant init skipped: ${e}`); }
  }

  async upsert(id: string, vector: number[], payload: Record<string, unknown>) {
    await this.client.upsert(COLLECTION, { points: [{ id, vector, payload }] });
  }

  async search(orgId: string, vector: number[], limit = 8) {
    return this.client.search(COLLECTION, {
      vector, limit,
      filter: { must: [{ key: 'orgId', match: { value: orgId } }] },
      with_payload: true,
    });
  }
}
