import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { InternalModule } from './InternalModule';
import { InternalServiceInterface } from './InternalServiceInterface';
import { InternalService } from './InternalService';
import { AppVersionProviderInterface } from './interfaces/AppVersionProviderInterface'
import { AppVersionProvider } from './providers/AppVersionProvider'
import { DictProviderInterface } from '../dict/interfaces/DictProviderInterface'
import { interfaces } from 'inversify'
import { ConnectionInterface } from '../db/ConnectionInterface'
import { DbModule } from '../db/DbModule'
import { DictProvider } from '../dict/DictProvider'
import Table from '../db/Table'
import { AppPlatform } from '../dict/types'

export const internalModule : ModuleLoaderType = kernel => {
  kernel.bind<InternalServiceInterface>(InternalModule.InternalServiceInterface).to(InternalService);
  kernel.bind<AppVersionProviderInterface>(InternalModule.AppVersionProviderInterface).to(AppVersionProvider)

  kernel.bind<DictProviderInterface<AppPlatform>>(InternalModule.DictAppPlatform)
    .toDynamicValue((ctx: interfaces.Context) => {
      const connection = ctx.container.get<ConnectionInterface>(DbModule.ConnectionInterface);
      return new DictProvider(connection, Table.DICT_APP_PLATFORM)
    })
}
