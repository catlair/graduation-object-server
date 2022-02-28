import { Module } from '@nestjs/common';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';
import { NoticeModule } from '../notice/notice.module';
import { NoticeService } from '../notice/notice.service';

@Module({
  imports: [NoticeModule],
  controllers: [PaperController],
  providers: [PaperService, NoticeService],
})
export class PaperModule {}
