import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import winstonOptions from './common/config/logging';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { PrismaKnownFilter } from './common/exception/prisma-know.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });
  const { httpAdapter } = app.get(HttpAdapterHost);

  // 在 mian 中获取配置
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new PrismaKnownFilter());

  const swagger = new DocumentBuilder()
    .setTitle('测试 api')
    .setDescription('这是一个简单的测试 api 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true, // 忽略缺失的属性，如果需要校验，使用 @IsDefined()
      transform: true, // 开启转换
      // whitelist: true, // 开启白名单，忽略掉不应该存在的属性 （白名单必须要使用校验，否则被忽略掉, 重要）
    }),
  );

  await app.listen(PORT);
  Logger.log(`点击链接访问文档 http://localhost:${PORT}/swagger`, 'Bootstrap');
  Logger.log(`点击链接访问接口 http://localhost:${PORT}/graphql`, 'Bootstrap');
}
bootstrap();
