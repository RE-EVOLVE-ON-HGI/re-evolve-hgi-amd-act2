import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';

@ApiTags('Telemetry Simulator')
@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('start')
  start() {
    return this.simulationService.start();
  }

  @Post('stop')
  stop() {
    return this.simulationService.stop();
  }

  @Get('status')
  status() {
    return this.simulationService.status();
  }
}
