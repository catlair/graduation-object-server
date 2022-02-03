import { UserResolver } from './user.resolver';
import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HashingService } from '@/common/service/hashing.service';
import { CacheConfigService } from '@/common/service/cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [UserResolver, UserService, HashingService],
})
export class UserModule {}
