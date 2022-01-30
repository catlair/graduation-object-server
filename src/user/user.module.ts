import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { HashingService } from '@/common/service/hashing.service';

@Module({
  imports: [],
  providers: [UserResolver, UserService, HashingService],
})
export class UserModule {}
