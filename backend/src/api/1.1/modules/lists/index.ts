import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ListsModule } from './ListsModule';
import { ListServiceInterface } from './interfaces/ListServiceInterface';
import { ListService } from './ListService';
import { ListProviderInterface } from './interfaces/ListProviderInterface';
import { ListProvider } from './dataProviders/ListProvider';
import { ListFollowersProviderInterface } from './interfaces/ListFollowersProviderInterface';
import { ListFollowersProvider } from './dataProviders/ListFollowersProvider';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { ListPermissions } from './ListPermissions';

export const listsModule : ModuleLoaderType = kernel => {
  kernel.bind<ListProviderInterface>(ListsModule.ListProviderInterface).to(ListProvider);
  kernel.bind<ListFollowersProviderInterface>(ListsModule.ListFollowersProviderInterface).to(ListFollowersProvider);
  
  kernel.bind<ListServiceInterface>(ListsModule.ListServiceInterface).to(ListService);
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ListPermissions);
}
