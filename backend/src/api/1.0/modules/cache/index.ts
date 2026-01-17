import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { CacheServiceInterface } from './interfaces/CacheServiceInterface';
import { CacheModule } from './CacheModule';
import { CacheService } from './CacheService';
import { CacheOptions } from './types';
import { MemoryCacheProvider } from './MemoryCacheProvider';

export const cacheModule: ModuleLoaderType = (kernel, config) => {
  kernel.bind<CacheServiceInterface>(CacheModule.CacheServiceInterface).to(CacheService);
  kernel.bind<MemoryCacheProvider>(CacheModule.CacheProviderInterface)
    .to(MemoryCacheProvider)
    .inSingletonScope();
  kernel.bind<CacheOptions>(CacheModule.CacheOptions).toConstantValue(config.cache);
}
