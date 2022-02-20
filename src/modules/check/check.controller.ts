import { Mimetype } from '@/enums/mimetype';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import path = require('node:path');
import fs = require('node:fs');
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { downloadFileHeader } from '@/utils';

@ApiTags('审核')
@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  create(@Body() createCheckDto: CreateCheckDto) {
    return this.checkService.create(createCheckDto);
  }

  @Get()
  findAll() {
    return this.checkService.findAll();
  }

  @Get(':id')
  @ApiResponseProperty({
    format: 'binary',
  })
  findOne(@Param('id') id: string, @Res() res: Response) {
    // TODO: 测试下载文件
    const dir = '/home/catlair/github/bs/server/uploads';
    const filename = '简历模板1.doc';
    res.set(downloadFileHeader(filename));

    const file = fs.createReadStream(path.resolve(dir, filename));
    file.pipe(res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    return this.checkService.update(+id, updateCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkService.remove(+id);
  }
}
