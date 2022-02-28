import { Auth, UserJwt, UserReq } from '@/decorators';
import { Role } from '@/enums/role.enum';
import { fuzzyEmail } from '@/utils/transformer';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtDto } from '../auth/dto/jwt.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ChangeEmailDto,
  UpdateEmailDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(private userService: UsersService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '新增用户' })
  async addUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.deleteUser(id);
  }

  @Auth()
  @Get('me')
  @ApiOperation({ summary: '获取个人信息' })
  async user(@UserReq() user: User) {
    user.email = fuzzyEmail(user.email);
    return user;
  }

  @Auth(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  async allUsers() {
    return await this.userService.getAllUser();
  }

  @Auth()
  @Post('email')
  @ApiOperation({ summary: '发起更新邮箱请求' })
  async changeEmail(@UserReq() user: User, @Body() payload: ChangeEmailDto) {
    return this.userService.changeEmail(user.id, payload);
  }

  @Patch('email')
  @ApiOperation({ summary: '更新邮箱' })
  async updateEmail(@Body() { key, userId }: UpdateEmailDto) {
    return this.userService.updateEmail(key, userId);
  }

  @Auth()
  @Patch('password')
  @ApiOperation({ summary: '更新密码' })
  async changePassword(
    @UserReq(true) user: User,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }

  @Auth()
  @Patch('password/reset')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(
    @UserReq() user: User,
    @Body() payload: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(user.id, payload);
  }

  @Auth()
  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(
    @UserReq() user: User,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() newUserData: UpdateUserDto,
  ) {
    if (!(user.roles as string[]).includes(Role.ADMIN) && user.id !== id) {
      throw new ForbiddenException();
    }
    return this.userService.updateUser(id, newUserData);
  }

  /** 获取通知 */
  @Get('notices')
  @Auth(Role.DIRECTOR, Role.VICE_DIRECTOR, Role.TEACHER, Role.SECRETARY)
  @ApiOperation({ summary: '获取通知' })
  async getNotices(@UserJwt() user: JwtDto) {
    return await this.userService.getNotices(user.id);
  }
}
