import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '@common/prisma/prisma.service';
import { KafkaService } from '@common/kafka/kafka.service';
import { Topics } from '@common/events/topics';
import { AgentType, TaskStage } from '@prisma/client';
import { ModelService } from '../../model/model.service';
import { IntentService } from './intent.service';

export const AGENT_QUEUE = 'agent-runtime';

/**
 * Adaptive Intelligence Nervous System.
 * Decomposes a goal into a task DAG, routes each task to the least-loaded
 * agent of the required type, enqueues execution, and emits orchestration
 * events that drive the live dashboard.
 */
@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(
    private prisma: PrismaService,
    private kafka: KafkaService,
    private model: ModelService,
    private intent: IntentService,
    @InjectQueue(AGENT_QUEUE) private queue: Queue,
  ) {}

  /** Planning engine — turns a goal into ordered stages using LLMs/Intents. */
  private async plan(goal: string, intent: string): Promise<{ stage: TaskStage; type: AgentType }[]> {
    this.logger.log(`Planning stages for goal: "${goal}" with intent "${intent}"`);
    try {
      const prompt = `Given the user goal "${goal}" and intent "${intent}", generate a dynamic plan consisting of 3 to 5 task stages. Return ONLY a JSON object with key "stages", which contains an array of objects with keys "stage" (must be one of: ANALYZE, PLAN, EXECUTE, VALIDATE, DELIVER) and "type" (must be one of: PLANNING, EXECUTION, ANALYTICS, GOVERNANCE, COMMUNICATION, LEARNING).`;
      const response = await this.model.chat([{ role: 'user', content: prompt }], { temperature: 0.2 });
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.stages) && parsed.stages.length > 0) {
        return parsed.stages.map((s: any) => ({
          stage: (s.stage || 'EXECUTE') as TaskStage,
          type: (s.type || 'EXECUTION') as AgentType,
        }));
      }
    } catch (e: any) {
      this.logger.warn(`Dynamic planning failed: ${e.message}. Falling back to default plan.`);
    }

    if (intent === 'CODE') {
      return [
        { stage: 'ANALYZE', type: AgentType.ANALYTICS },
        { stage: 'PLAN', type: AgentType.PLANNING },
        { stage: 'EXECUTE', type: AgentType.EXECUTION },
        { stage: 'VALIDATE', type: AgentType.GOVERNANCE },
        { stage: 'DELIVER', type: AgentType.COMMUNICATION },
      ];
    } else if (intent === 'AUDIT') {
      return [
        { stage: 'ANALYZE', type: AgentType.ANALYTICS },
        { stage: 'VALIDATE', type: AgentType.GOVERNANCE },
        { stage: 'DELIVER', type: AgentType.COMMUNICATION },
      ];
    } else if (intent === 'FINANCE') {
      return [
        { stage: 'ANALYZE', type: AgentType.ANALYTICS },
        { stage: 'EXECUTE', type: AgentType.EXECUTION },
        { stage: 'VALIDATE', type: AgentType.GOVERNANCE },
        { stage: 'DELIVER', type: AgentType.COMMUNICATION },
      ];
    }

    return [
      { stage: 'ANALYZE', type: AgentType.ANALYTICS },
      { stage: 'EXECUTE', type: AgentType.EXECUTION },
      { stage: 'DELIVER', type: AgentType.COMMUNICATION },
    ];
  }

  /** Routing — pick least-loaded ACTIVE/IDLE agent of a type that has the matching capabilities/skills. */
  private async route(orgId: string, type: AgentType, stage: TaskStage): Promise<string | null> {
    // Audit active agents matching type
    const agents = await this.prisma.agent.findMany({
      where: { orgId, type, status: { in: ['ACTIVE', 'IDLE'] } },
      orderBy: { capacityPct: 'asc' },
    });

    // Match agent capabilities based on the stage
    for (const agent of agents) {
      const config = (agent.config as any) || {};
      const capabilities = (config.capabilities || []) as string[];
      const skills = (config.skills || []) as string[];
      
      const requiresScan = stage === 'VALIDATE';
      const isSecurityAgent = capabilities.includes('kavacha:policy') || skills.includes('security-audit');
      
      if (requiresScan && !isSecurityAgent) {
        continue; // Skip non-security agent for validation tasks
      }
      
      return agent.id;
    }
    
    return agents[0]?.id ?? null;
  }

  async dispatch(orgId: string, goal: string, input: Record<string, unknown>, priority = 5) {
    const intent = await this.intent.classify(goal);
    const stages = await this.plan(goal, intent);

    const orchestration = await this.prisma.orchestration.create({
      data: { orgId, goal, status: 'RUNNING', topology: { stages: stages as any, intent } },
    });

    let prev: Record<string, unknown> = input;
    for (const [i, s] of stages.entries()) {
      const agentId = await this.route(orgId, s.type, s.stage);
      const task = await this.prisma.agentTask.create({
        data: {
          agentId, orchestrationId: orchestration.id,
          stage: s.stage, status: 'QUEUED',
          priority, input: prev as any,
        },
      });
      await this.kafka.emit(Topics.AgentTaskCreated, task.id, { orchestrationId: orchestration.id, stage: s.stage });
      // chain stages: each runtime job depends on the previous via delay/lpush ordering
      await this.queue.add('execute', { taskId: task.id, agentId }, {
        priority, attempts: 3, backoff: { type: 'exponential', delay: 2000 },
        delay: i * 250,
      });
      prev = { ...prev, _stage: s.stage };
    }

    await this.kafka.emit(Topics.OrchestrationUpdated, orchestration.id, { status: 'RUNNING', intent });
    return orchestration;
  }
}
