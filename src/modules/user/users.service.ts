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
import { fuzzyEmail, pagination } from '@/utils/transformer';
import { excludePassword } from '@/utils/prisma';

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
        select: excludePassword,
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

  deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async getAllUser() {
    const users = await this.prisma.user.findMany({
      select: excludePassword,
    });
    return pagination(
      users.map((user) => {
        user.email = fuzzyEmail(user.email);
        return user;
      }),
      { current: 1, pageSize: users.length },
      users.length,
    );
  }

  updateUser(userId: string, newUserData: UpdateUserDto) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
      select: excludePassword,
    });
  }

  /** ???????????? */
  async changeEmail(userId: string, { email, code, oldEmail }: ChangeEmailDto) {
    // ?????????????????????
    await this.emailService.verifyEmail(oldEmail, code);
    // ???????????????????????????
    const userExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new BadRequestException('?????????????????????');
    }
    const key = randomUUID();
    // ????????????
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

  /** ????????????????????? */
  async updateEmail(key: string, userId: string) {
    // userId ???????????????????????????????????????????????????????????????????????????????????????
    const email = await this.cacheManager.get(key + userId);
    if (!email) {
      throw new ForbiddenException('???????????????????????????');
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

  /** ??????????????????????????????????????? */
  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordDto,
  ) {
    // ?????????????????????
    const passwordValid = await this.hashingService.match(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('????????????');
    }

    return this.updatePassword(userId, changePassword.password);
  }

  /** ???????????? ?????????????????? */
  async resetPassword(userId: string, resetPassword: ResetPasswordDto) {
    // ?????????????????????
    const { email, code } = resetPassword;
    await this.emailService.verifyEmail(email, code);
    return this.updatePassword(userId, resetPassword.password);
  }

  /** ???????????? */
  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await this.hashingService.get(newPassword);
    const user = await this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
      select: excludePassword,
    });
    // ??????????????????
    this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return user;
  }

  getNotices(userId: string) {
    return this.prisma.userNotice.findMany({
      where: { userId },
      include: {
        managerNotice: true,
      },
      orderBy: {
        managerNotice: {
          createdAt: 'desc',
        },
      },
    });
  }
}
