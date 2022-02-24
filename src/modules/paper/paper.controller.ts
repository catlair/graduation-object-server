import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { PaperService } from './paper.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, UserJwt, UserReq } from '@/decorators';
import { Role } from '@/enums/role.enum';
import { User } from '@prisma/client';
import { JwtDto } from '@/modules/auth/dto/jwt.dto';
import { PageParams } from '@/dto/page-params';

@Controller('paper')
@ApiTags('试卷')
export class PaperController {
  constructor(private readonly paperService: PaperService) {}

  @Post()
  @Auth(Role.TEACHER)
  @ApiOperation({ summary: '创建试卷' })
  create(@Body() createPaperDto: CreatePaperDto, @UserJwt() user: JwtDto) {
    return this.paperService.create(createPaperDto, user);
  }

  @Get()
  @Auth(Role.DIRECTOR, Role.VICE_DIRECTOR)
  @ApiOperation({ summary: '获取本学院试卷列表' })
  findAllByCollege(@UserReq() user: User, @Query() page: PageParams) {
    return this.paperService.findAllByCollege(user, page);
  }

  @Get('teacher')
  @Auth(Role.TEACHER)
  @ApiOperation({ summary: '教师获取自己的试卷' })
  findAllByTeacher(@UserJwt() user: JwtDto, @Query() page: PageParams) {
    return this.paperService.findAllByTeacher(user, page);
  }

  @Get(':id')
  @Auth(Role.TEACHER, Role.DIRECTOR, Role.VICE_DIRECTOR)
  @ApiOperation({ summary: '根据 id 查询具体试卷' })
  findOne(@Param('id') id: string, @UserReq() user: User) {
    return this.paperService.findOne(id, user);
  }

  @Get('life/:id')
  @Auth()
  @ApiOperation({ summary: '获取试卷生命周期' })
  findPaperLife(@Param('id') id: string) {
    return this.paperService.findPaperLife(id);
  }

  @Patch(':id')
  @Auth(Role.TEACHER)
  @ApiOperation({ summary: '教师更新试卷' })
  update(
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
    @UserJwt() user: JwtDto,
  ) {
    return this.paperService.update(id, updatePaperDto, user);
  }
}
