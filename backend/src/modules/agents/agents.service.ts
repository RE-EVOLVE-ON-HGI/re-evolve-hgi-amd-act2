import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAgentDto) {
    return this.prisma.agent.create({ data: { ...dto, config: dto.config as any, status: 'IDLE' } });
  }

  list(orgId: string) {
    return this.prisma.agent.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  get(id: string) {
    return this.prisma.agent.findUnique({
      where: { id },
      include: { evaluations: { take: 5, orderBy: { capturedAt: 'desc' } } },
    });
  }

  /** Live capacity distribution across the agent network (Sārathi core). */
  async capacity(orgId: string) {
    const agents = await this.prisma.agent.groupBy({
      by: ['type', 'status'],
      where: { orgId },
      _count: true,
      _avg: { capacityPct: true, successRate: true },
    });
    const total = agents.reduce((s, a) => s + a._count, 0);
    return { total, breakdown: agents };
  }
}
