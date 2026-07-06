import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { AgentsService } from './agents.service';
import { OrchestratorService } from './orchestration/orchestrator.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { DispatchTaskDto } from './dto/dispatch-task.dto';

@ApiTags('Agent Foundry')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agents: AgentsService,
    private readonly orchestrator: OrchestratorService,
  ) {}

  @Post()
  @RequirePerms('agents:create')
  create(@Body() dto: CreateAgentDto) { return this.agents.create(dto); }

  @Get()
  @RequirePerms('agents:read')
  list(@Query('orgId') orgId: string) { return this.agents.list(orgId); }

  @Get('capacity')
  @RequirePerms('agents:read')
  capacity(@Query('orgId') orgId: string) { return this.agents.capacity(orgId); }

  @Get(':id')
  @RequirePerms('agents:read')
  get(@Param('id') id: string) { return this.agents.get(id); }

  @Post('dispatch')
  @RequirePerms('agents:execute')
  dispatch(@Body() dto: DispatchTaskDto) {
    return this.orchestrator.dispatch(dto.orgId, dto.goal, dto.input, dto.priority);
  }
}
