import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReferenceArchitectAgent implements OnModuleInit {
  private readonly logger = new Logger(ReferenceArchitectAgent.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Initializing Enterprise Solution Architect reference agent...');
    try {
      const org = await this.prisma.organization.findFirst({ where: { slug: 're-evolve' } });
      if (!org) {
        this.logger.warn('Organization "re-evolve" not found. Skipping reference agent seed.');
        return;
      }

      const existing = await this.prisma.agent.findFirst({
        where: { orgId: org.id, name: 'Enterprise Solution Architect' }
      });

      if (!existing) {
        await this.prisma.agent.create({
          data: {
            orgId: org.id,
            name: 'Enterprise Solution Architect',
            type: 'PLANNING',
            status: 'IDLE',
            model: 'llama-v3-8b-instruct',
            capacityPct: 100,
            successRate: 100,
            config: {
              capabilities: [
                'Mission Planning',
                'Requirement Analysis',
                'Architecture Generation',
                'Technical Documentation',
                'Repository Intelligence',
                'Task Breakdown',
                'Risk Analysis',
                'Engineering Recommendations'
              ]
            } as any
          }
        });
        this.logger.log('Successfully registered Enterprise Solution Architect reference agent.');
      } else {
        this.logger.log('Enterprise Solution Architect reference agent already registered.');
      }
    } catch (e: any) {
      this.logger.error(`Failed to register reference agent: ${e.message}`);
    }
  }
}
