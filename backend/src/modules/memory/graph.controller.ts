import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { GraphService } from './graph.service';

@ApiTags('Knowledge Graph')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('graph')
export class GraphController {
  constructor(private readonly graph: GraphService) {}

  @Post('node')
  @RequirePerms('memory:write')
  createNode(@Body() body: { orgId: string; type: string; label: string; props?: any }) {
    return this.graph.createNode(body.orgId, body.type, body.label, body.props);
  }

  @Post('edge')
  @RequirePerms('memory:write')
  createEdge(@Body() body: { orgId: string; srcId: string; dstId: string; relation: string; weight?: number; props?: any }) {
    return this.graph.createEdge(body.orgId, body.srcId, body.dstId, body.relation, body.weight, body.props);
  }

  @Get('network')
  @RequirePerms('memory:read')
  getNetwork(@Query('orgId') orgId: string) {
    return this.graph.getNetwork(orgId);
  }

  @Get('query')
  @RequirePerms('memory:read')
  queryRelation(@Query('orgId') orgId: string, @Query('label') label: string) {
    return this.graph.queryRelation(orgId, label);
  }
}
