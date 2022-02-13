import { Throttle } from '@nestjs/throttler';
import { CaptchaService } from './captcha.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('captche')
@ApiTags('验证码')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('svg')
  @Throttle(10)
  @ApiOperation({ summary: '获取验证码svg图片' })
  getSvgCaptcha() {
    return this.captchaService.getSvgCaptcha();
  }
}
