<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

   <p align="center">用于构建高效且可扩展的服务器端应用程序的渐进式 <a href="https://nodejs.org/zh-cn/" target="blank">Node.js</a> 框架，深受 <a href="https://angular.cn" target="_blank">Angular</a> 的启发。</p> 
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 安装依赖

包管理器使用 `pnpm`，可以使用 `npm` 或 `yarn` 安装依赖。

```bash
$ pnpm install
```

## 运行应用

```bash
# development 开发环境
$ pnpm run start

# watch mode 监听文件变化
$ pnpm run start:dev

# production mode 生产环境
$ pnpm run start:prod
```

## 做了什么

### 开发环境

使用 `cross-env NODE_ENV=development` 为不同环境设置变量。

> 可用于加载不同的配置文件。

```json
{ "start:dev": "cross-env NODE_ENV=development nest start --watch" }
```

### 配置文件

`src/config/configuration.ts` 文件中进行配置。  
根据不同环境加载 `.env` 文件在 `src/app.module.ts` 修改（可能更喜欢单文件配置）。

在项目中使用 `ConfigService` 来获取配置。

```ts
// 注入
@Injectable()
export class HashingService {
  constructor(private readonly configService: ConfigService<Configuration>) {}

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.configService.get('saltRounds'));
  }
}

// 在 main 中使用
const configService = app.get(ConfigService);
const PORT = configService.get<number>('port');
```

### 缓存

默认使用 `redis` 缓存，设置 `REDIS_DISABLE=true` 使用 `memory`。

`src/modules/auth/auth.module.ts` `src/modules/auth/auth.service.ts` 中使用 `CacheService` 来获取缓存。

### 安全

**接口限速**

同上，使用的 redis 和内存缓存。

```ts
@Module({
  imports: [
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
    AuthModule,
  ],
  providers: [
    {
      /** 节流器 */
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### JWT

见 `src/modules/auth`  
参考 `src/decorators/auth.decorator.ts` 中的装饰器进行鉴权。根据实际修改。  
方法装饰器 `@Auth('admin')` 表示需要 admin 权限。  
参数装饰器 `@UserReq() user` 获取已登录用户信息。  
方法装饰器 `AuthUnlogin()` 表示可以不需要登录，但会尝试获取登录信息。

### 日志

日志使用 `winston` 来记录。
见 `src/config` 和 `src/middleware/logger.middleware.ts`。

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
