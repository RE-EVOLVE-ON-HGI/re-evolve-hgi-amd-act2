import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from '@common/auth/permissions.guard';
import { RequirePerms } from '@common/auth/roles.decorator';
import { MemoryService } from './memory.service';
import { MemoryKind } from '@prisma/client';

@ApiTags('Memory Vault')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('memory')
export class MemoryController {
  constructor(private readonly memory: MemoryService) {}

  @Post('ingest')
  @RequirePerms('memory:write')
  ingest(@Body() body: { orgId: string; agentId?: string; kind: MemoryKind; source: string; content: string }) {
    return this.memory.ingest(body);
  }

  @Post('retrieve')
  @RequirePerms('memory:read')
  retrieve(@Body() body: { orgId: string; query: string; limit?: number }) {
    return this.memory.retrieve(body.orgId, body.query, body.limit);
  }
}
