import { Configuration } from '@/common/config/configuration';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class HashingService {
  readonly salt: string;
  constructor(private readonly configService: ConfigService<Configuration>) {
    this.salt = this.configService.get('salt');
  }

  /**
   * 使用 salt 创建 hash
   * @param value 待加密的值
   */
  async hash(value: string): Promise<string> {
    return crypto.createHmac('sha256', this.salt + value).digest('hex');
  }

  /**
   * 使用 bcrypt 随机盐值加密
   * @param value 待加密的值
   */
  async bcrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.configService.get('saltRounds'));
  }

  /**
   * 使用 bcrypt 对比密码
   * @param value 待对比的值
   * @param hash 加密后的值
   */
  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  /**
   * 自定义加密
   * @param value 待加密的值
   */
  async get(value: string): Promise<string> {
    // 多此一举，似乎不能提高安全性
    const hashValue = await this.hash(value);
    return await this.bcrypt(hashValue);
  }

  /**
   * 自定义对比
   * @param value 待对比的值
   * @param hash 加密后的值
   */
  async match(value: string, hash: string): Promise<boolean> {
    const hashValue = await this.hash(value);
    return await this.compare(hashValue, hash);
  }
}
