import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';

@Injectable()
export class SimulationService implements OnModuleDestroy {
  private readonly logger = new Logger(SimulationService.name);
  private intervalId: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  start() {
    if (this.running) return { status: 'already_running' };
    this.running = true;
    this.intervalId = setInterval(() => this.tick(), 4000);
    this.logger.log('HGI Live Telemetry Simulator started.');
    return { status: 'started' };
  }

  stop() {
    if (!this.running) return { status: 'not_running' };
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.logger.log('HGI Live Telemetry Simulator stopped.');
    return { status: 'stopped' };
  }

  status() {
    return { running: this.running };
  }

  onModuleDestroy() {
    this.stop();
  }

  private async tick() {
    const orgId = 're-evolve'; // default seeded org
    try {
      // Find or verify org exists
      const org = await this.prisma.organization.findUnique({ where: { slug: orgId } });
      if (!org) {
        this.logger.warn(`Org ${orgId} not found, skipping tick.`);
        return;
      }

      const rand = Math.random();

      // 1. Simulating Telemetry metric event
      if (rand < 0.4) {
        const value = Math.floor(50 + Math.random() * 40); // cpu or load
        const metricName = Math.random() > 0.5 ? 'cpu_load' : 'latency';
        const metricValue = metricName === 'latency' ? Math.floor(10 + Math.random() * 5) : value;

        this.realtime.publish(org.id, 'telemetry', 'telemetry.event', {
          metric: metricName,
          value: metricValue,
          service: 'SimulationService',
          region: 'us-east-1',
        });
      }

      // 2. Simulating Agent task completions
      if (rand >= 0.4 && rand < 0.7) {
        // Fetch a random agent
        const agents = await this.prisma.agent.findMany({ where: { orgId: org.id } });
        if (agents.length > 0) {
          const agent = agents[Math.floor(Math.random() * agents.length)];
          const taskSuccess = Math.random() > 0.1;
          
          this.realtime.publish(org.id, 'agents', 'agent.task.completed', {
            agentId: agent.id,
            agentName: agent.name,
            success: taskSuccess,
            latencyMs: Math.floor(100 + Math.random() * 900),
            stage: 'EXECUTE',
          });
        }
      }

      // 3. Simulating Financial Transaction/Capital Flows
      if (rand >= 0.7 && rand < 0.9) {
        const amount = Math.floor(5000 + Math.random() * 25000); // in cents
        this.realtime.publish(org.id, 'finance', 'economy.transaction', {
          amountCents: amount,
          kind: Math.random() > 0.5 ? 'royalty' : 'sale',
          direction: 'INFLOW',
          assetClass: 'Model',
        });
      }

      // 4. Simulating Governance check
      if (rand >= 0.9) {
        const score = 98.0 + Math.random() * 1.9;
        this.realtime.publish(org.id, 'governance', 'governance.violation', {
          score,
          policy: 'Data Privacy Enforcement',
          passed: Math.random() > 0.15,
        });
      }
    } catch (e: any) {
      this.logger.error('Error in simulation tick: ' + e.message);
    }
  }
}
