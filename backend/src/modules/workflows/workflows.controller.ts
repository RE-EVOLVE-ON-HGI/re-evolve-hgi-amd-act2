import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { WorkflowsService } from './workflows.service';

@ApiTags('Workflow Studio')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly wf: WorkflowsService) {}

  @Post() @RequirePerms('workflows:create')
  create(@Body() b: { orgId: string; name: string; graph: unknown; trigger: unknown }) {
    return this.wf.create(b.orgId, b.name, b.graph, b.trigger);
  }
  @Get() @RequirePerms('workflows:read')
  list(@Query('orgId') orgId: string) { return this.wf.list(orgId); }

  @Post(':id/trigger') @RequirePerms('workflows:execute')
  trigger(@Param('id') id: string, @Body() ctx: Record<string, unknown>) {
    return this.wf.trigger(id, ctx);
  }
}
