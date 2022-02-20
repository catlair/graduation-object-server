import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { randomUUID } from 'crypto';
import { Cache } from 'cache-manager';
import { base64 } from '@/utils';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getSvgCaptcha() {
    const captcha = svgCaptcha.createMathExpr({
      mathMax: 18,
      mathMin: 0,
      mathOperator: '+-',
      noise: 2,
      width: 120,
      height: 40,
      color: true,
      background: '#e0b991',
    });
    const key = randomUUID();
    await this.cacheManager.set(key, captcha.text, { ttl: 300 });
    return {
      img: 'data:image/svg+xml;base64,' + base64(captcha.data),
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
