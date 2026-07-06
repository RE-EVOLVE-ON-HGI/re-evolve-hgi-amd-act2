import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class GraphService {
  constructor(private prisma: PrismaService) {}

  async createNode(orgId: string, type: string, label: string, props: any = {}) {
    return this.prisma.graphNode.create({
      data: { orgId, type, label, props },
    });
  }

  async createEdge(orgId: string, srcId: string, dstId: string, relation: string, weight = 1.0, props: any = {}) {
    return this.prisma.graphEdge.create({
      data: { orgId, srcId, dstId, relation, weight, props },
    });
  }

  async getNetwork(orgId: string) {
    const nodes = await this.prisma.graphNode.findMany({ where: { orgId } });
    const edges = await this.prisma.graphEdge.findMany({ where: { orgId } });
    return { nodes, edges };
  }

  async queryRelation(orgId: string, label: string) {
    return this.prisma.graphNode.findMany({
      where: { orgId, label: { contains: label, mode: 'insensitive' } },
      include: { outEdges: true, inEdges: true },
    });
  }
}
