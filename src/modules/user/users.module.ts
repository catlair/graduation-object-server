import { CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HashingService } from '@/utils/hashing.service';
import { UserController } from './user.controller';
import { CacheConfigService } from '@/config/cache.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    EmailModule,
  ],
  providers: [UsersService, HashingService],
  exports: [UsersService], // 外部可以使用
  controllers: [UserController],
})
export class UsersModule {}
