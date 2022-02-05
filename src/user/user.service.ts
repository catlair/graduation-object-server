import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { HashingService } from '@/common/service/hashing.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
  async updateEmail(userId: number, newEmail: string) {
    // 邮箱是否已经被注册
    const userExist = await this.prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (userExist) {
      throw new BadRequestException('邮箱已经被注册');
    }
    return this.prisma.user.update({
      data: {
        email: newEmail,
      },
      where: { id: userId },
    });
  }

  /** 修改密码（需要提供旧密码） */
  async changePassword(
    userId: number,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
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
