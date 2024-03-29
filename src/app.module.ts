import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { configuration, Configuration } from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from '~/auth/auth.module';
import { resolve } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'nestjs-prisma';
import { TasksModule } from './modules/tasks/tasks.module';
import { UploadModule } from './modules/upload/upload.module';
import { EmailModule } from './modules/email/email.module';
import { CaptchaModule } from './modules/captche/captcha.module';
import { UsersModule } from './modules/user/users.module';
import { CheckModule } from './modules/check/check.module';
import { PaperModule } from './modules/paper/paper.module';
import { CollegeModule } from './modules/college/college.module';
import { NoticeModule } from './modules/notice/notice.module';
import { LoggerMiddleware, PrismaLoggerMiddleware } from './middleware';

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        `.env.${NODE_ENV}.local`,
        `.env.${NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd(), 'public'),
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [PrismaLoggerMiddleware()], // configure your prisma middleware
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (conifg: ConfigService<Configuration>) => ({
        ttl: 60,
        limit: conifg.get('rateLimitMax'),
        storage: conifg.get('REDIS_DISABLE')
          ? null
          : new ThrottlerStorageRedisService(),
      }),
    }),
    ScheduleModule.forRoot(),

    AuthModule,
    TasksModule,
    UploadModule,
    EmailModule,
    CaptchaModule,
    UsersModule,
    CheckModule,
    PaperModule,
    CollegeModule,
    NoticeModule,
  ],
  providers: [
    {
      /** 节流器 */
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
