import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { PolicyService } from './policy.service';

@ApiTags('Governance Grid')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('governance')
export class GovernanceController {
  constructor(private readonly policy: PolicyService) {}

  @Post('evaluate') @RequirePerms('governance:evaluate')
  evaluate(@Body() b: { policyId: string; subject: Record<string, any> }) {
    return this.policy.evaluate(b.policyId, b.subject);
  }
  @Get('score') @RequirePerms('governance:read')
  score(@Query('orgId') orgId: string) { return this.policy.score(orgId); }
}
