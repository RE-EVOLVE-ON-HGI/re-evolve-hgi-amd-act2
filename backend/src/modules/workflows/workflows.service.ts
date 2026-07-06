import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { Topics } from '@common/events/topics';

export const WORKFLOW_QUEUE = 'workflow-runtime';

/** Designs, versions, and triggers node-graph workflows (triggers/actions/conditions). */
@Injectable()
export class WorkflowsService {
  constructor(
    private prisma: PrismaService,
    private kafka: KafkaService,
    @InjectQueue(WORKFLOW_QUEUE) private queue: Queue,
  ) {}

  create(orgId: string, name: string, graph: unknown, trigger: unknown) {
    return this.prisma.workflow.create({
      data: { orgId, name, graph: graph as any, trigger: trigger as any, status: 'ACTIVE' },
    });
  }

  list(orgId: string) {
    return this.prisma.workflow.findMany({ where: { orgId }, orderBy: { updatedAt: 'desc' } });
  }

  async trigger(workflowId: string, context: Record<string, unknown> = {}) {
    const wf = await this.prisma.workflow.findUniqueOrThrow({ where: { id: workflowId } });
    const exec = await this.prisma.workflowExecution.create({
      data: { workflowId, status: 'RUNNING', context: context as any },
    });
    await this.kafka.emit(Topics.WorkflowTriggered, exec.id, { workflowId, orgId: wf.orgId });
    await this.queue.add('run', { executionId: exec.id }, {
      attempts: 3, backoff: { type: 'exponential', delay: 1500 },
    });
    return exec;
  }
}
