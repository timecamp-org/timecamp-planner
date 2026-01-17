import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { EntityHistoryModule } from './EntityHistoryModule';
import { EntityHistoryServiceFactory } from './EntityHistoryServiceFactory';
import { EntityHistoryServiceFactoryInterface } from './EntityHistoryServiceFactoryInterface';

export const entityHistoryModule : ModuleLoaderType = kernel => {
  kernel.bind<EntityHistoryServiceFactoryInterface>(EntityHistoryModule.EntityHistoryServiceFactoryInterface).to(EntityHistoryServiceFactory);
}
