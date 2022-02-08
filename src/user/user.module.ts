import { UserResolver } from './user.resolver';
import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HashingService } from '@/common/service/hashing.service';
import { CacheConfigService } from '@/common/service/cache.service';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    EmailModule,
  ],
  providers: [UserResolver, UserService, HashingService],
})
export class UserModule {}
