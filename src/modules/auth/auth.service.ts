import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '@/utils/hashing.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { RefreshToken, User } from '@prisma/client';
import { Configuration } from '@/config/configuration';
import { isString } from 'class-validator';
import * as crypto from 'crypto';
import * as UAParser from 'ua-parser-js';
import { UA } from './interface/ua.interface';
import { Token } from '@/types';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async loginValidate(
    userVal: string | number,
    userKey: 'email' | 'id',
    password: string,
    userAgent: string,
  ): Promise<Token & { user: Omit<User, 'password'> }> {
    const user = await this.prisma.user.findUnique({
      where: { [userKey]: userVal },
    });

    if (!user) {
      throw new BadRequestException('user or password is incorrect');
    }

    const passwordValid = await this.hashingService.match(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('user or password is incorrect');
    }

    const tokenObj = await this.generateTokens(user);
    await this.setRefreshToken(user.id, tokenObj.refreshToken, userAgent);
    delete user.password;
    return {
      ...tokenObj,
      user,
    };
  }

  async validateUser(userId: number, selectPass = false): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (selectPass) return user;
    delete user.password;
    return user;
  }

  async logout(refreshToken: string) {
    await this.deleteRefreshToken(refreshToken);
    return {
      message: 'logout success',
    };
  }

  async loginByEmail(
    email: string,
    code: string,
    userAgent: string,
    name?: string,
  ) {
    const key = name ? `${name}-${email}` : email;
    const cacheCode = await this.cacheManager.get(key);
    if (cacheCode !== code) {
      throw new BadRequestException('验证码错误');
    }
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('邮箱不存在');
    }

    const tokenObj = await this.generateTokens(user);
    await this.setRefreshToken(user.id, tokenObj.refreshToken, userAgent);
    delete user.password;
    return {
      ...tokenObj,
      user,
    };
  }

  async generateTokens(user: User): Promise<Token> {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign({ id: user.id, roles: user.roles });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const securityConfig =
      this.configService.get<Configuration['security']>('security');
    return this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: securityConfig.refreshIn,
      },
    );
  }

  async refreshToken(token: string, userAgent: string) {
    const { id } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    // 是否登录
    const oldRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token_userId: { token: this.hashStr(token), userId: id } },
    });
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }
    // 刷新时需要获取用户信息
    const ua = this.initUserAgent(userAgent);
    const validate = this.validateUA(ua, oldRefreshToken);
    if (!validate) {
      throw new ForbiddenException('账号异常');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    const tokenObj = await this.generateTokens(user);
    await this.setRefreshToken(id, tokenObj.refreshToken, ua, token);
    return tokenObj;
  }

  private async deleteRefreshToken(token: string) {
    try {
      return await this.prisma.refreshToken.delete({
        where: { token: this.hashStr(token) },
      });
    } catch (error) {
      throw new ForbiddenException('logout fail');
    }
  }

  async setRefreshToken(
    userId: number,
    refreshToken: string,
    userAgent: string | UA,
    token?: string,
  ) {
    const hashedToken = this.hashStr(refreshToken),
      ua = isString(userAgent) ? this.initUserAgent(userAgent) : userAgent;

    // 确保 refreshToken 只能使用一次
    if (token) {
      await this.prisma.refreshToken.update({
        where: { token: this.hashStr(token) },
        data: { token: hashedToken, ...ua },
      });
      return refreshToken;
    }

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        ...ua,
      },
    });
  }

  private hashStr(str: string) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  private initUserAgent(userAgent: string): UA {
    const { browser, os, device } = UAParser(userAgent);

    if (!browser.name || !browser.version || !os.name || !os.version) {
      throw new ForbiddenException('账号异常');
    }

    return {
      browser: {
        name: browser.name,
        version: browser.version,
      },
      os: {
        name: os.name,
        version: os.version,
      },
      device: {
        model: device.model,
        type: device.type,
        vendor: device.vendor,
      },
    };
  }

  private validateUA(
    { browser, os }: UA,
    { browser: userBrowser, os: userOs }: RefreshToken,
  ) {
    if (!browser.name || !browser.version || !os.name || !os.version) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return browser.name === userBrowser.name && os.name === userOs.name;
  }
}
