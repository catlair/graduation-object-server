import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HashingService } from '@/utils/hashing.service';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { Cache } from 'cache-manager';
import { randomUUID } from 'node:crypto';
import { ChangeEmailDto, UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { pagination } from '@/utils/transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  async createUser(payload: any) {
    const hashedPassword = await this.hashingService.get(payload.password);
    const roles = payload.roles || ['TEACHER'];
    try {
      return await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          roles,
        },
        select: {
          id: true,
          email: true,
          roles: true,
          college: true,
          createdAt: true,
        },
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

  deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getAllUser() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        college: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return pagination(
      users,
      { current: 1, pageSize: users.length },
      users.length,
    );
  }

  updateUser(userId: number, newUserData: UpdateUserDto) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  /** 修改邮箱 */
  async changeEmail(userId: number, { email, code, oldEmail }: ChangeEmailDto) {
    // 验证邮箱验证码
    await this.emailService.verifyEmail(oldEmail, code);
    // 邮箱是否已经被注册
    const userExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new BadRequestException('邮箱已经被注册');
    }
    const key = randomUUID();
    // 发送邮件
    await Promise.all([
      this.cacheManager.set(key + userId, email, { ttl: 300 }),
      this.emailService.sendEmailUrl(
        email,
        'http://localhost:8000/settings/email/' + key,
      ),
    ]);
    return {
      email,
      userId,
    };
  }

  /** 真正的修改邮箱 */
  async updateEmail(key: string, userId: number) {
    // userId 应该手动输入，这样可以防止恶意修改，并且可以不要求用户登录
    const email = await this.cacheManager.get(key + userId);
    if (!email) {
      throw new ForbiddenException('你没有权限修改邮箱');
    }
    await this.prisma.user.update({
      data: {
        email,
      },
      where: { id: userId },
    });
    this.cacheManager.del(key + userId);

    return {
      email,
      userId,
    };
  }

  /** 修改密码（需要提供旧密码） */
  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordDto,
  ) {
    // 验证邮箱验证码
    const passwordValid = await this.hashingService.match(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('密码错误');
    }

    return this.updatePassword(userId, changePassword.password);
  }

  /** 重置密码 （需要邮箱） */
  async resetPassword(userId: number, resetPassword: ResetPasswordDto) {
    // 验证邮箱验证码
    const { email, code } = resetPassword;
    await this.emailService.verifyEmail(email, code);
    return this.updatePassword(userId, resetPassword.password);
  }

  /** 更新密码 */
  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await this.hashingService.get(newPassword);
    const user = await this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
    // 需要重新登录
    this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return user;
  }
}
