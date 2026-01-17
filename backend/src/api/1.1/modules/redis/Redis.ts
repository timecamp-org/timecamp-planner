import { inject, injectable } from 'inversify';
import IoRedis from 'ioredis';
import { RedisModule } from './RedisModule';
import { RedisOptions } from 'ioredis';

@injectable()
export class Redis {
  redis: IoRedis;
  constructor(
    @inject(RedisModule.RedisOptions)
    protected options: RedisOptions
  ) {
    this.redis = new IoRedis(options);
  }

  async set(key: string, value: any) {
    return await this.redis.set(key, value);
  }
  async get(key: string) {
    const result = await this.redis.get(key);
    return JSON.parse(result);
  }

  async del(key: string) {
    return await this.redis.del(key);
  }
  async disconnect() {
    return this.redis.disconnect();
  }
}
