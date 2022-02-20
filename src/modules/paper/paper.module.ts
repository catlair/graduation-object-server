import { Module } from '@nestjs/common';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';

@Module({
  controllers: [PaperController],
  providers: [PaperService],
})
export class PaperModule {}
