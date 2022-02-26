import {
  Controller,
  Post,
  Put,
  Query,
  UploadedFiles,
  Param,
  UseInterceptors,
  Delete,
  Res,
  Get,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponseProperty,
} from '@nestjs/swagger';
import {
  PaperUploadDto,
  PaperUploadQueries,
  PaperUploadUpdateDto,
} from './dto/paper-upload.dto';
import { UploadService } from './upload.service';
import {
  paperFilter,
  paperStorage,
  pictureFilter,
  pictureStorage,
} from './utils';
import { Auth, UserJwt } from '@/decorators';
import { JwtDto } from '../auth/dto/jwt.dto';
import { Role } from '@/enums/role.enum';
import { downloadFileHeader } from '@/utils';
import type { Response } from 'express';
import path = require('path');
import fs = require('fs');

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
  updatePaperFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') id: string,
    @UserJwt() user: JwtDto,
  ) {
    return this.uploadService.updatePaperFile(files, id, user);
  }

  @Post('picture')
  @Auth()
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '上传图片', type: PaperUploadUpdateDto })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: pictureStorage,
      fileFilter: pictureFilter,
    }),
  )
  uploadPicture(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      path: files[0].filename,
    };
  }

  @Delete('picture/:path')
  @Auth()
  @ApiOperation({ summary: '删除图片' })
  deletePicture(@Param('path') imgPath: string) {
    return this.uploadService.deletePicture(imgPath);
  }

  @Get('/:filepath/:filename')
  @ApiOperation({ summary: '获取文件' })
  @ApiResponseProperty({
    format: 'binary',
  })
  findOne(
    @Param('filepath') filepath: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    filename = decodeURIComponent(filename);
    filepath = decodeURIComponent(filepath);
    const dir = path.resolve(process.cwd(), `./uploads/${filepath}`);
    res.set(downloadFileHeader(filename));
    const file = fs.createReadStream(path.resolve(dir, filename));
    file.pipe(res);
  }
}
