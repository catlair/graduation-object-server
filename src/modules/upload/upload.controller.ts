import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PaperUploadDto } from './dto/paper-upload.dto';
import { UploadService } from './upload.service';
import { paperFilter, paperStorage } from './utils';

@Controller('upload')
@ApiTags('文件上传')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('paper')
  @ApiOperation({ summary: '上传试卷文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传试卷文件',
    type: PaperUploadDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'paperA', maxCount: 1 },
        { name: 'paperB', maxCount: 1 },
      ],
      { storage: paperStorage, fileFilter: paperFilter },
    ),
  )
  uploadPaperFile(
    @UploadedFiles()
    files: {
      paperA?: Express.Multer.File[];
      paperB?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return {};
  }
}
