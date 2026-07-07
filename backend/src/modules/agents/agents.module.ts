import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentsResolver } from './agents.resolver';
import { OrchestratorService, AGENT_QUEUE } from './orchestration/orchestrator.service';
import { AgentRuntimeProcessor } from './orchestration/agent-runtime.processor';
import { IntentService } from './orchestration/intent.service';
import { MemoryModule } from '../memory/memory.module';
import { GovernanceModule } from '../governance/governance.module';

import { AgentsGrpcController } from './agents.grpc.controller';
import { ReferenceArchitectAgent } from './reference-architect.agent';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ connection: c.getOrThrow('redis') }),
    }),
    BullModule.registerQueue({ name: AGENT_QUEUE }),
    MemoryModule,
    GovernanceModule,
  ],
  controllers: [AgentsController, AgentsGrpcController],
  providers: [AgentsService, AgentsResolver, OrchestratorService, AgentRuntimeProcessor, IntentService, ReferenceArchitectAgent],
  exports: [AgentsService, OrchestratorService],
})
export class AgentsModule {}
