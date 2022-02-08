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
import { Prisma, User } from '@prisma/client';
import { Token } from '@/common/models/token.model';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '@/common/service/hashing.service';
import { Configuration } from '@/common/config/configuration';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
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

      return this.generateTokens({
        userId: user.id,
      });
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

  async login(email: string, id: number, password: string): Promise<Token> {
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

    return this.generateTokens({
      userId: user.id,
    });
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
    token,
  }: {
    userId: number;
    token?: string;
  }): Promise<string> {
    const securityConfig =
      this.configService.get<Configuration['security']>('security');
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: securityConfig.refreshIn,
      },
    );
    const hashedToken = this.hashStr(refreshToken);

    // 确保 refreshToken 只能使用一次
    if (token) {
      await this.prisma.refreshToken.update({
        where: { token: this.hashStr(token) },
        data: { token: hashedToken },
      });
      return refreshToken;
    }
    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
      },
    });

    return refreshToken;
  }

  async refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const oldRefreshToken = await this.prisma.refreshToken.findUnique({
        where: { token_userId: { token: this.hashStr(token), userId } },
        select: { token: true },
      });

      if (!oldRefreshToken) {
        throw new UnauthorizedException();
      }

      return this.generateTokens({
        userId,
        token,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
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

  private hashStr(str: string) {
    return crypto.createHash('md5').update(str).digest('hex');
  }
}
