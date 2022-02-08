import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangeEmailInput, UpdateUserInput } from './dto/update-user.input';
import { HashingService } from '@/common/service/hashing.service';
import { EmailService } from '@/email/email.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly emailService: EmailService,
  ) {}

  updateUser(userId: number, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  /** 修改邮箱 */
  async changeEmail(userId: number, { email, code }: ChangeEmailInput) {
    // 验证邮箱验证码
    await this.emailService.verifyEmail(email, code);
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
      this.emailService.sendEmailUrl(email, key),
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

    return {
      email,
      userId,
    };
  }

  /** 修改密码（需要提供旧密码） */
  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    // 验证邮箱验证码
    const { email, code } = changePassword;
    await this.emailService.verifyEmail(email, code);
    const passwordValid = await this.hashingService.match(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('密码错误');
    }

    return this.updatePassword(userId, changePassword.newPassword);
  }

  /** 更新密码 */
  async updatePassword(userId: number, newPassword: string) {
    const hashedPassword = await this.hashingService.get(newPassword);

    return await this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
