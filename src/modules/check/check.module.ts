import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { NoticeService } from '../notice/notice.service';
import { NoticeModule } from '../notice/notice.module';

@Module({
  imports: [NoticeModule],
  controllers: [CheckController],
  providers: [CheckService, NoticeService],
})
export class CheckModule {}
