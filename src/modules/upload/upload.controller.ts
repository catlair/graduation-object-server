import {
  Controller,
  Post,
  Put,
  Query,
  UploadedFiles,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  PaperUploadDto,
  PaperUploadQueries,
  PaperUploadUpdateDto,
} from './dto/paper-upload.dto';
import { UploadService } from './upload.service';
import { paperFilter, paperStorage } from './utils';
import { Auth, UserJwt } from '@/decorators';
import { JwtDto } from '../auth/dto/jwt.dto';
import { Role } from '@/enums/role.enum';

@Controller('upload')
@ApiTags('文件上传')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('paper')
  @Auth(Role.TEACHER)
  @ApiOperation({ summary: '上传试卷文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传试卷文件',
    type: PaperUploadDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'a', maxCount: 1 },
        { name: 'b', maxCount: 1 },
      ],
      { storage: paperStorage, fileFilter: paperFilter },
    ),
  )
  uploadPaperFile(
    @UploadedFiles()
    files: {
      a: Express.Multer.File[];
      b: Express.Multer.File[];
    },
    @Query() query: PaperUploadQueries,
    @UserJwt() user: JwtDto,
  ) {
    return this.uploadService.uploadPaperFile(files, query, user);
  }

  @Put('paper/:id')
  @Auth(Role.TEACHER)
  @ApiOperation({ summary: '更新试卷文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '更新试卷文件', type: PaperUploadUpdateDto })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: paperStorage,
      fileFilter: paperFilter,
    }),
  )
  uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @UserJwt() user: JwtDto,
  ) {
    return this.uploadService.uploadFile(files, id, user);
  }
}
