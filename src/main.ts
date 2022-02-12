import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { ResponseExceptionFilter } from './filters/res-exception.filter';
import { WinstonModule } from 'nest-winston';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import winstonOptions from './config/logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });

  // 在 mian 中获取配置
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const swagger = new DocumentBuilder()
    .setTitle('测试 api')
    .setDescription('这是一个简单的测试 api 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true, // 忽略缺失的属性，如果需要校验，使用 @IsDefined()
      transform: true, // 开启转换
      // whitelist: true, // 开启白名单，忽略掉不应该存在的属性 （白名单必须要使用校验，否则无法通过）
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  // 优先级低的过滤器放前面
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // Prisma Client Exception Filter for unhandled exceptions
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new ResponseExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(PORT);
  Logger.log(`点击链接访问文档 http://localhost:${PORT}/api-docs`, 'Bootstrap');
}
bootstrap();
