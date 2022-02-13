import { Auth, UserReq } from '@/decorators';
import { Role } from '@/enums/role.enum';
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
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

  @Auth()
  @Get('me')
  @ApiOperation({ summary: '获取个人信息' })
  async user(@UserReq() user: User) {
    return user;
  }

  @Auth(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  async allUsers() {
    return await this.userService.getAllUser();
  }

  @Auth()
  @Patch()
  @ApiOperation({ summary: '更新用户信息' })
  async updateUser(
    @UserReq() user: User,
    @Body('data') newUserData: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.id, newUserData);
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
    @UserReq() user: User,
    @Body() changePassword: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }
}
