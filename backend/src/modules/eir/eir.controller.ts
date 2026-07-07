import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EirService } from './eir.service';

@ApiTags('Engineering Intelligence Runtime')
@Controller('eir')
export class EirController {
  constructor(private readonly eirService: EirService) {}

  @Get('scan')
  scan(@Query('orgId') orgId: string) {
    return this.eirService.scanRepository(orgId);
  }

  @Post('compress')
  compress(@Body() body: { prompt: string }) {
    return this.eirService.compressPrompt(body.prompt);
  }

  @Get('context')
  context(@Query('orgId') orgId: string, @Query('query') query: string) {
    return this.eirService.assembleContext(orgId, query);
  }
}
