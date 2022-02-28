import { CacheModule, Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/config/configuration';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'node:path';
import { CacheConfigService } from '@/config/cache.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Configuration>) => ({
        transport: {
          host: configService.get('email.host', { infer: true }), // 此处使用 infer: true 可以自动识别嵌套属性 email.host，避免 ts 的类型检查报错
          port: configService.get('email.port', { infer: true }),
          auth: {
            user: configService.get('email.user', { infer: true }),
            pass: configService.get('email.pass', { infer: true }),
          },
        },
        preview: false,
        defaults: {
          from: `"cat blog" <${configService.get('email.user', {
            infer: true,
          })}>`,
        },
        template: {
          dir: path.resolve(process.cwd(), './dist/modules/email/template'),
          adapter: new EjsAdapter(),
          options: {},
        },
      }),
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
