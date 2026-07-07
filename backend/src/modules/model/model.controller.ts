import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModelService } from './model.service';

@ApiTags('Model Provider')
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get('health')
  health() {
    return this.modelService.checkHealth();
  }
}
