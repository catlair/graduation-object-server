import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { Auth, UserJwt } from '@/decorators';
import { Roles } from '@/enums/role.enum';
import { JwtDto } from '../auth/dto/jwt.dto';

@ApiTags('审核')
@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  @Auth(...Roles.DIRECTOR)
  @ApiOperation({ summary: '审核' })
  create(@Body() createCheckDto: CreateCheckDto, @UserJwt() user: JwtDto) {
    return this.checkService.create(createCheckDto, user);
  }
}
