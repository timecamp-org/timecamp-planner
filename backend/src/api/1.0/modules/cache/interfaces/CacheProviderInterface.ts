import { AnyDict } from '../../common/types';

export interface CacheProviderInterface {
  set(key: string, value: AnyDict, ttl?: number): void;

  get(key: string): AnyDict;
}
