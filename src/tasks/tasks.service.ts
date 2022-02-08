import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 每小时 03分 和 33分 执行一次 删除过期的 refresh_token
   */
  @Cron('0 03,33 * * * *', {
    name: 'deleteExpiredRefreshToken',
  })
  async deleteExpiredRefreshToken() {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 604_800_000 /** 7天 */),
        },
      },
    });
    this.logger.log(`删除过期的 refresh_token ${count}`);
  }
}
