interface DirectEnvType {
  /** JWT 密匙 */
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  /** 运行环境 */
  NODE_ENV: 'development' | 'production';
  /** 不使用 redis 进行缓存 */
  REDIS_DISABLE: string;
}

// 下面是非直接使用的环境变量
interface IndirectEnvType {
  PORT?: string;
  EMAIL_HOST: string;
  EMAIL_PORT?: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  CACHE_TTL?: string;
  REDIS_PASSWORD?: string;
  /** 盐 */
  SALT?: string;
  SALT_ROUNDS?: string;
  RATE_LIMIT_MAX?: string;
}

type EnvType = IndirectEnvType & DirectEnvType;

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends EnvType {
        TZ?: string;
      }
    }
  }
}
