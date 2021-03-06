import { getNowTime } from '@/utils/time';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

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
    const code = Math.random().toString().slice(-6);
    const { date, createdAt } = getNowTime();

    const sendMailOptions: ISendMailOptions = {
      to: email,
      subject: '用户邮箱验证',
      template: 'validate-code',
      context: {
        code, //验证码
        date, //日期
      },
    };
    await this.mailerService.sendMail(sendMailOptions);
    const key = name ? `${name}-${email}` : email;
    await this.cacheManager.set(key, code, { ttl: 300 });

    return {
      name,
      email,
      createdAt,
    };
  }

  async sendEmailUrl(email: string, url: string) {
    const { date, createdAt } = getNowTime();
    const sendMailOptions: ISendMailOptions = {
      to: email,
      subject: '用户修改邮箱',
      template: 'change-email',
      context: {
        date, //日期
        url, //链接,
      },
    };
    await this.mailerService.sendMail(sendMailOptions);
    return {
      email,
      createdAt,
    };
  }

  /** 邮箱校验 */
  async verifyEmail(email: string, code: string) {
    const verCode = await this.cacheManager.get(email);
    if (verCode !== code) {
      throw new BadRequestException('验证码错误');
    }
    await this.cacheManager.del(email);
  }

  /** 发送通知 */
  async sendNotice(email: string, title: string, notice = '') {
    try {
      const { date, createdAt } = getNowTime();
      const sendMailOptions: ISendMailOptions = {
        to: email,
        subject: title || '用户通知',
        template: 'notice',
        context: {
          date, //日期
          notice: notice || title, //通知
        },
      };
      await this.mailerService.sendMail(sendMailOptions);
      return {
        email,
        createdAt,
      };
    } catch (error) {
      Logger.log(error.message || error, 'EmailService');
    }
  }
}
