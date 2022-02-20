import { Module } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';

@Module({
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule {}
