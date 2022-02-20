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
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() createPaperDto: CreatePaperDto, @UserJwt() user: JwtDto) {
    return this.paperService.create(createPaperDto, user);
  }

  @Get()
  @Auth(Role.DIRECTOR, Role.VICE_DIRECTOR)
  findAllByCollege(@UserReq() user: User, @Query() page: PageParams) {
    return this.paperService.findAllByCollege(user, page);
  }

  @Get('teacher')
  @Auth(Role.TEACHER)
  findAllByTeacher(@UserJwt() user: JwtDto, @Query() page: PageParams) {
    return this.paperService.findAllByTeacher(user, page);
  }

  @Get(':id')
  @Auth(Role.TEACHER, Role.DIRECTOR, Role.VICE_DIRECTOR)
  findOne(@Param('id') id: string, @UserReq() user: User) {
    return this.paperService.findOne(id, user);
  }

  @Get('life/:id')
  @Auth()
  findPaperLife(@Param('id') id: string) {
    return this.paperService.findPaperLife(id);
  }

  @Patch(':id')
  @Auth(Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updatePaperDto: UpdatePaperDto,
    @UserJwt() user: JwtDto,
  ) {
    return this.paperService.update(id, updatePaperDto, user);
  }
}
