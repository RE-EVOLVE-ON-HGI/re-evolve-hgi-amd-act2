import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowsService, WORKFLOW_QUEUE } from './workflows.service';
import { WorkflowRuntimeProcessor } from './workflow-runtime.processor';
import { WorkflowsController } from './workflows.controller';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: WORKFLOW_QUEUE }),
    AgentsModule,
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowRuntimeProcessor],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
