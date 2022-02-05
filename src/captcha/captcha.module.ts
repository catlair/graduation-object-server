import { CacheModule, Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaResolver } from './captcha.resolver';
import { CacheConfigService } from '@/common/service/cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [CaptchaResolver, CaptchaService],
})
export class CaptchaModule {}
