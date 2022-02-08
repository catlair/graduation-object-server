import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupInput } from './dto/signup.input';
import { Prisma, RefreshToken, User } from '@prisma/client';
import { Token } from '@/common/models/token.model';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '@/common/service/hashing.service';
import { Configuration } from '@/common/config/configuration';
import * as crypto from 'crypto';
import * as UAParser from 'ua-parser-js';
import { UA } from './interface/ua.interface';
import { isString } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(payload: SignupInput, userAgent: string): Promise<Token> {
    const hashedPassword = await this.hashingService.get(payload.password);
    const roles = payload.roles || ['TEACHER'];
    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          roles,
        },
      });

      const tokenObj = await this.generateTokens({
        userId: user.id,
      });
      await this.setRefreshToken(user.id, tokenObj.refreshToken, userAgent);
      return tokenObj;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        if (e.message.includes('PRIMARY')) {
          throw new ConflictException(`ID ${payload.id} already exists`);
        }
        throw new ConflictException(`Email ${payload.email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async login(
    email: string,
    id: number,
    password: string,
    userAgent: string,
  ): Promise<Token> {
    const keyName = id || id === 0 ? 'id' : 'email';
    const value = keyName === 'id' ? id : email;
    const user = await this.prisma.user.findUnique({
      where: { [keyName]: value },
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

    const tokenObj = await this.generateTokens({
      userId: user.id,
    });
    await this.setRefreshToken(user.id, tokenObj.refreshToken, userAgent);
    return tokenObj;
  }

  async logout(refreshToken: string) {
    await this.deleteRefreshToken(refreshToken);
    return {
      message: 'logout success',
    };
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async generateTokens(payload: {
    userId: number;
    token?: string;
  }): Promise<Token> {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken({ userId }: { userId: number }): string {
    return this.jwtService.sign({ userId });
  }

  private async generateRefreshToken({
    userId,
  }: {
    userId: number;
  }): Promise<string> {
    const securityConfig =
      this.configService.get<Configuration['security']>('security');
    return this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: securityConfig.refreshIn,
      },
    );
  }

  async refreshToken(token: string, userAgent: string) {
    const { userId } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const oldRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token_userId: { token: this.hashStr(token), userId } },
    });

    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }
    const ua = this.initUserAgent(userAgent);
    const validate = this.validateUA(ua, oldRefreshToken);

    if (!validate) {
      throw new ForbiddenException('账号异常');
    }

    const tokenObj = await this.generateTokens({
      userId,
      token,
    });

    await this.setRefreshToken(userId, tokenObj.refreshToken, ua, token);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return browser.name === userBrowser.name && os.name === userOs.name;
  }
}
