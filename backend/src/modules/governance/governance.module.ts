import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { GovernanceController } from './governance.controller';

@Module({
  controllers: [GovernanceController],
  providers: [PolicyService],
  exports: [PolicyService],
})
export class GovernanceModule {}
