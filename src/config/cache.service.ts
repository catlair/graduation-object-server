import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { Configuration } from '@/config/configuration';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService<Configuration>) {}

  createCacheOptions(): CacheModuleOptions {
    const options: CacheModuleOptions = {
      ttl: this.configService.get('cacheTTl'),
      isGlobal: true,
    };
    // 如果使用 redis 缓存，则需要指定 store
    if (!this.configService.get('REDIS_DISABLE')) {
      Object.assign(options, {
        store: redisStore,
        host: this.configService.get('redis.host', { infer: true }),
        port: this.configService.get('redis.port', { infer: true }),
      });
    }
    return options;
  }
}
