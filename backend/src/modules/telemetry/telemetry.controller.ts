import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { TelemetryService } from './telemetry.service';
import { TelemetryKind } from '@prisma/client';

@ApiTags('Global Telemetry Grid')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post('ingest') @RequirePerms('telemetry:write')
  ingest(@Body() b: { orgId: string; region: string; service: string; kind: TelemetryKind; payload: any }) {
    return this.telemetry.ingest(b);
  }
  @Get('region-health') @RequirePerms('telemetry:read')
  regionHealth(@Query('orgId') orgId: string) { return this.telemetry.regionHealth(orgId); }
}
