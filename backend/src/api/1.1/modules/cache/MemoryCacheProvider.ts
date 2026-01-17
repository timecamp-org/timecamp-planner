import * as memoryCache from 'memory-cache';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { injectable, inject } from 'inversify';
import { CacheOptions } from './types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { CacheProviderInterface } from './interfaces/CacheProviderInterface';
import { CacheModule } from './CacheModule';

@injectable()
export class MemoryCacheProvider implements CacheProviderInterface {
  private logger: LoggerInterface;
  private options: CacheOptions;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CacheModule.CacheOptions) options: CacheOptions
  ) {
    this.logger = logger;
    this.options = options;
  }

  set(key: string, value: any, ttl: number = this.options.cachedValueExpirationTime): void {
    memoryCache.put(key, value, ttl, this.onFlushCachedValue.bind(this));
  }

  get(key: string) {
    return memoryCache.get(key);
  }

  onFlushCachedValue(key: string) {
    this.logger.debug(`${key} was deleted from cache`);
  }
}
