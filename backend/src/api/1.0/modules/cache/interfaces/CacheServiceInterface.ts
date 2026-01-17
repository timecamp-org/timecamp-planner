import { AnyDict } from '../../common/types';

export interface CacheServiceInterface {
  set(key: string, value: AnyDict, ttl?: number): void;

  get(key: string): AnyDict;
}
