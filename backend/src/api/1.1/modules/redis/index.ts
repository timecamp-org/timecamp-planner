import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { Redis } from './Redis';
import { RedisModule } from './RedisModule';
import config from '../../../../config';

export const redisModule: ModuleLoaderType = (kernel) => {
  kernel.bind<Redis>(RedisModule.Redis).to(Redis);
  kernel.bind(RedisModule.RedisOptions).toConstantValue(config.redis);
};
