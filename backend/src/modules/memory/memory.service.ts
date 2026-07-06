import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { Topics } from '@common/events/topics';
import { EmbeddingsService } from './embeddings.service';
import { QdrantService } from './qdrant.service';
import { MemoryKind } from '@prisma/client';

/** Memory Vault — ingestion, chunking, embedding, semantic retrieval, replay. */
@Injectable()
export class MemoryService {
  constructor(
    private prisma: PrismaService,
    private embeddings: EmbeddingsService,
    private qdrant: QdrantService,
    private kafka: KafkaService,
  ) {}

  private chunk(text: string, size = 800, overlap = 150): string[] {
    const out: string[] = [];
    if (text.length <= size) return [text];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + size, text.length);
      out.push(text.slice(start, end));
      if (end === text.length) break;
      start += size - overlap;
    }
    return out;
  }

  async ingest(p: { orgId: string; agentId?: string; kind: MemoryKind; source: string; content: string }) {
    const vector = await this.embeddings.embed(p.content);
    const record = await this.prisma.memoryRecord.create({
      data: {
        orgId: p.orgId, agentId: p.agentId, kind: p.kind, source: p.source,
        content: p.content, tokens: Math.ceil(p.content.length / 4),
      },
    });
    // persist chunks (vectors live in pgvector + Qdrant)
    const chunks = this.chunk(p.content);
    await this.prisma.memoryChunk.createMany({
      data: chunks.map((c, ordinal) => ({ memoryId: record.id, ordinal, content: c })),
    });
    await this.qdrant.upsert(record.id, vector, { orgId: p.orgId, kind: p.kind, source: p.source });
    await this.prisma.memoryRecord.update({ where: { id: record.id }, data: { vectorRef: record.id } });
    await this.kafka.emit(Topics.MemoryIngested, record.id, { orgId: p.orgId, kind: p.kind });
    return record;
  }

  /** Semantic retrieval across the organizational memory. */
  async retrieve(orgId: string, query: string, limit = 8) {
    const vector = await this.embeddings.embed(query);
    const hits = await this.qdrant.search(orgId, vector, limit);
    const ids = hits.map((h) => String(h.id));
    const records = await this.prisma.memoryRecord.findMany({ where: { id: { in: ids } } });
    // touch access for retention scoring
    await this.prisma.memoryRecord.updateMany({
      where: { id: { in: ids } }, data: { lastAccess: new Date() },
    });
    return hits.map((h) => ({
      score: h.score,
      record: records.find((r) => r.id === String(h.id)),
    }));
  }
}
