import { Module, Global } from '@nestjs/common';
import { EirService } from './eir.service';
import { EirController } from './eir.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [EirController],
  providers: [EirService],
  exports: [EirService],
})
export class EirModule {}
