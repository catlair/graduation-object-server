import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Token } from '@/types';
import { Auth, Headers, UserLoggedIn } from '@/decorators';
import { User } from '@prisma/client';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
@ApiTags('权限验证')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _loginUserDto: LoginUserDto,
    @UserLoggedIn() tokens: Token & { user: User },
  ) {
    return tokens;
  }

  @Post('login/email')
  async loginByEmail() {
    return {
      message: 'login by email',
    };
  }

  @Auth()
  @Delete('logout')
  async logout(@Body() logoutDto: LogoutUserDto) {
    return await this.authService.logout(logoutDto.token);
  }

  @Put('token/refresh')
  async refreshToken(
    @Body() { token }: RefreshTokenDto,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.refreshToken(token, userAgent);
  }
}
