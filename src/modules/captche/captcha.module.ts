import { CacheModule, Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CacheConfigService } from '@/config/cache.service';
import { CaptchaController } from './captcha.controller';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [CaptchaService],
  controllers: [CaptchaController],
})
export class CaptchaModule {}
