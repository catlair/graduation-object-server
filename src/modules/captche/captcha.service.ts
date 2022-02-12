import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { randomUUID } from 'crypto';
import { Cache } from 'cache-manager';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getSvgCaptcha() {
    const captcha = svgCaptcha.createMathExpr({
      mathMax: 18,
      mathMin: 0,
      mathOperator: '+-',
      noise: 2,
      color: true,
    });
    const key = randomUUID();
    await this.cacheManager.set(key, captcha.text, { ttl: 300 });
    return {
      svg: captcha.data,
      key,
    };
  }

  async validateCaptcha(key: string, code: string) {
    const captcha = await this.cacheManager.get(key);
    return {
      valid: captcha === code,
      code,
    };
  }
}
