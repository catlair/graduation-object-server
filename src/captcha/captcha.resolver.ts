import { Resolver, Query, Args } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { CaptchaService } from './captcha.service';
import { ValidateCaptchaArgs } from './dto/validate.args';
import { Captcha } from './models/captcha.model';
import { ValidateCaptcha } from './models/validate.model';

@Resolver(() => Captcha)
export class CaptchaResolver {
  constructor(private readonly captchaService: CaptchaService) {}

  @Query(() => Captcha, { name: 'captcha' })
  @Throttle(10)
  getSvgCaptcha() {
    return this.captchaService.getSvgCaptcha();
  }

  @Query(() => ValidateCaptcha)
  validateCaptcha(@Args() { key, code }: ValidateCaptchaArgs) {
    return this.captchaService.validateCaptcha(key, code);
  }
}
