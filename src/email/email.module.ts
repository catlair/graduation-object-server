import { CacheModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/common/config/configuration';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { CacheConfigService } from '@/common/service/cache.service';

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
          dir: path.resolve(__dirname, './template'),
          adapter: new EjsAdapter(),
          options: {},
        },
      }),
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [EmailResolver, EmailService],
})
export class EmailModule {}
