import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { SettingsModule } from './SettingsModule';
import { ViewSettingsProvider } from './providers/ViewSettingsProvider';
import { ViewSettingsProviderInterface } from './interfaces/ViewSettingsProviderInterface';
import { ViewSettingsServiceInterface } from './interfaces/ViewSettingsServiceInterface';
import { ViewSettingsService } from './ViewSettingsService';
import { DictProviderInterface } from '../dict/interfaces/DictProviderInterface';
import { DictProvider } from '../dict/DictProvider';
import { ViewSettingsType } from '../db/schema';
import { interfaces } from 'inversify';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import Table from '../db/Table';
import { LinkedViewSettingsProviderInterface } from './interfaces/LinkedViewSettingsProviderInterface';
import { LinkedViewSettingsProvider } from './providers/LinkedViewSettingsProvider';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { SettingsPermissions } from './SettingsPermissions';
import { PermissionsModule } from '../permissions/PermissionsModule';

export const settingsModule : ModuleLoaderType = (kernel, config) => {
  kernel.bind<DictProviderInterface<ViewSettingsType>>(SettingsModule.DictViewType)
    .toDynamicValue((ctx: interfaces.Context) => {
      const connection = ctx.container.get<ConnectionInterface>(DbModule.ConnectionInterface);
      return new DictProvider(connection, Table.DICT_VIEW_TYPE)
    })

  kernel.bind<ViewSettingsProviderInterface>(SettingsModule.ViewSettingsProviderInterface).to(ViewSettingsProvider)
  kernel.bind<LinkedViewSettingsProviderInterface>(SettingsModule.LinkedViewSettingsProviderInterface).to(LinkedViewSettingsProvider)
  kernel.bind<ViewSettingsServiceInterface>(SettingsModule.ViewSettingsServiceInterface).to(ViewSettingsService)
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(SettingsPermissions)
}
