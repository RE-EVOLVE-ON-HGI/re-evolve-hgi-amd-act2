import { Args, Query, Resolver } from '@nestjs/graphql';
import { AgentsService } from './agents.service';

@Resolver('Agent')
export class AgentsResolver {
  constructor(private readonly agentsService: AgentsService) {}

  @Query('agents')
  agents(@Args('orgId') orgId: string) { return this.agentsService.list(orgId); }

  @Query('agentCapacity')
  capacity(@Args('orgId') orgId: string) { return this.agentsService.capacity(orgId); }
}
