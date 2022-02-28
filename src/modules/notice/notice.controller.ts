import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Auth, UserJwt } from '@/decorators';
import { Role } from '@/enums/role.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDto } from '../auth/dto/jwt.dto';

@Controller('notice')
@ApiTags('通知')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '获取公告（管理员）' })
  findAll() {
    return this.noticeService.findAll();
  }

  /** 将所有未读设置为已读 */
  @Patch('read-all')
  @Auth()
  @ApiOperation({ summary: '将所有未读设置为已读' })
  async readAll(@UserJwt() user: JwtDto) {
    return this.noticeService.readAll(user);
  }

  /** 设置为已读 */
  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: '设置为已读' })
  async read(@Param('id') id: string, @UserJwt() user: JwtDto) {
    return this.noticeService.read(id, user);
  }

  /** 将所有删除 */
  @Delete('all')
  @Auth()
  @ApiOperation({ summary: '将所有删除' })
  async deleteAll(@UserJwt() user: JwtDto) {
    return this.noticeService.deleteAll(user);
  }

  /** 删除所有已读 */
  @Delete('read-all')
  @Auth()
  @ApiOperation({ summary: '删除所有已读' })
  async deleteAllRead(@UserJwt() user: JwtDto) {
    return this.noticeService.deleteAllRead(user);
  }
}
