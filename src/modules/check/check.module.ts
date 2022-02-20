import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';

@Module({
  controllers: [CheckController],
  providers: [CheckService],
})
export class CheckModule {}
