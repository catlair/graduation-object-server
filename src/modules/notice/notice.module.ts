import { Global, Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';

@Global()
@Module({
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
