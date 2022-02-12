import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('hello')
@ApiTags('hello')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  hello() {
    return this.uploadService.hello();
  }
}
