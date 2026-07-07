import { Module, Global } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';

@Global()
@Module({
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
