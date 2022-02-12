import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/config/configuration';
import { JwtStrategy } from './jwt.strategy';
import { CacheConfigService } from '@/config/cache.service';
import { HashingService } from '@/utils/hashing.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig =
          configService.get<Configuration['security']>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, HashingService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
