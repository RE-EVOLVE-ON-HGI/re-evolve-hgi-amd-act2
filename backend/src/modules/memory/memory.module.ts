import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { EmbeddingsService } from './embeddings.service';
import { QdrantService } from './qdrant.service';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';

@Module({
  controllers: [MemoryController, GraphController],
  providers: [MemoryService, EmbeddingsService, QdrantService, GraphService],
  exports: [MemoryService, GraphService],
})
export class MemoryModule {}
