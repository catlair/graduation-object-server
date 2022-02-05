import dayjs from '@/common/utils/dayjs';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as path from 'node:path';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 发送邮件验证码
   * @param email 邮件
   */
  async sendEmailCode(email: string, name?: string) {
    const code = Math.random().toString().slice(-6),
      createdAt = Date.now(),
      date = dayjs.unix(createdAt / 1000).format('YYYY-MM-DD HH:mm:ss');
    const sendMailOptions: ISendMailOptions = {
      to: email,
      subject: '用户邮箱验证',
      template: path.resolve(__dirname, './template', 'validate-code'),
      context: {
        code, //验证码
        date, //日期
      },
    };
    await this.mailerService.sendMail(sendMailOptions);
    const key = name ? `${name}-${email}` : email;
    await this.cacheManager.set(key, code, { ttl: 300 });

    return {
      code,
      name,
      email,
      createdAt,
    };
  }
}
