import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { Topics } from '@common/events/topics';
import { WORKFLOW_QUEUE } from './workflows.service';
import { OrchestratorService } from '../agents/orchestration/orchestrator.service';

/** Executes the workflow node graph: trigger → validate → action chain → complete. */
@Processor(WORKFLOW_QUEUE, { concurrency: 6 })
export class WorkflowRuntimeProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowRuntimeProcessor.name);

  constructor(
    private prisma: PrismaService,
    private kafka: KafkaService,
    private orchestrator: OrchestratorService,
  ) { super(); }

  async process(job: Job<{ executionId: string }>): Promise<void> {
    const started = Date.now();
    const exec = await this.prisma.workflowExecution.findUniqueOrThrow({
      where: { id: job.data.executionId }, include: { workflow: true },
    });
    const graph = (exec.workflow.graph as any) ?? { nodes: [] };
    const steps: any[] = [];
    let currentContext = { ...(exec.context as Record<string, any>) };

    for (const node of graph.nodes ?? []) {
      const t0 = Date.now();
      try {
        const result = await this.runNode(node, currentContext, exec.workflow.orgId);
        steps.push({ node: node.id, type: node.type, ms: Date.now() - t0, result, status: 'SUCCESS' });
        
        // update context if the node output returned new context fields
        if (result?.output) {
          currentContext = { ...currentContext, ...result.output };
        }

        await this.kafka.emit(Topics.WorkflowStepCompleted, exec.id, { node: node.id });
      } catch (e: any) {
        this.logger.error(`Workflow node ${node.id} failed: ${e.message}`);
        steps.push({ node: node.id, type: node.type, ms: Date.now() - t0, error: e.message, status: 'FAILED' });
        
        await this.prisma.workflowExecution.update({
          where: { id: exec.id },
          data: { status: 'FAILED', steps: steps as any, error: e.message, durationMs: Date.now() - started, finishedAt: new Date() },
        });
        return;
      }
    }

    await this.prisma.workflowExecution.update({
      where: { id: exec.id },
      data: { status: 'SUCCEEDED', steps: steps as any, context: currentContext as any, durationMs: Date.now() - started, finishedAt: new Date() },
    });
  }

  private async runNode(node: any, ctx: Record<string, unknown>, orgId: string): Promise<any> {
    switch (node.type) {
      case 'condition':
        let passed = true;
        if (node.expr) {
          try {
            // Simple evaluation context injector
            const keys = Object.keys(ctx);
            const vals = Object.values(ctx);
            const evaluator = new Function(...keys, `return (${node.expr})`);
            passed = Boolean(evaluator(...vals));
          } catch (e) {
            passed = false;
          }
        }
        return { passed, output: { [`condition_${node.id}`]: passed } };

      case 'action':
        return { executed: node.action ?? 'noop', output: { [`action_${node.id}`]: 'completed' } };

      case 'agent-call':
        this.logger.log(`Workflow triggering agent dispatch for goal: ${node.goal}`);
        const orchestration = await this.orchestrator.dispatch(orgId, node.goal || 'Run automation task', ctx);
        return {
          orchestrationId: orchestration.id,
          output: { [`agent_call_${node.id}`]: { orchestrationId: orchestration.id, status: 'DISPATCHED' } },
        };

      case 'approval-gate':
        this.logger.log(`Workflow hit approval gate, creating pending compliance check.`);
        const approval = await this.prisma.approval.create({
          data: {
            orgId,
            subjectType: 'workflow_node',
            subjectId: node.id,
            status: 'PENDING',
            chain: [ { role: 'founder', level: 1 } ] as any,
          },
        });
        await this.kafka.emit(Topics.ApprovalRequested, approval.id, { orgId, subjectId: node.id });
        return {
          approvalId: approval.id,
          status: 'WAITING_ON_APPROVAL',
          output: { [`approval_gate_${node.id}`]: { approvalId: approval.id, status: 'PENDING' } },
        };

      default:
        return { skipped: node.type };
    }
  }
}
