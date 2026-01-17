import { CacheServiceInterface } from './interfaces/CacheServiceInterface';
import { injectable, inject } from 'inversify';
import { CacheProviderInterface } from './interfaces/CacheProviderInterface';
import { CacheModule } from './CacheModule';
import { AnyDict } from '../common/types';

@injectable()
export class CacheService implements CacheServiceInterface {
  protected cacheProvider: CacheProviderInterface;

  constructor(@inject(CacheModule.CacheProviderInterface) cacheProvider: CacheProviderInterface) {
    this.cacheProvider = cacheProvider;
  }

  set(key: string, value: AnyDict, ttl?: number): void {
    return this.cacheProvider.set(key, value, ttl);
  }

  get(key: string): AnyDict {
    return this.cacheProvider.get(key);
  }
}
