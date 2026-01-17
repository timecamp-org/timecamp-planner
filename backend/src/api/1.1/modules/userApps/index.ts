import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { UserAppsDataProvider } from './UserAppsDataProvider'
import { UserAppsModule } from './UserAppsModule'
import { UserAppsService } from './UserAppsService'
import { PermissionsModule } from '../permissions/PermissionsModule'
import { UserAppsPermissions } from './UserAppsPermissions'
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface'
import { UserAppsServiceInterface } from './interfaces/UserAppsServiceInterface'
import { UserAppsDataProviderInterface } from './interfaces/UserAppsDataProviderInterface'


export const userAppsModule: ModuleLoaderType = kernel => {
  kernel.bind<UserAppsDataProviderInterface>(UserAppsModule.UserAppsDataProviderInterface).to(UserAppsDataProvider)
  kernel.bind<UserAppsServiceInterface>(UserAppsModule.UserAppsServiceInterface).to(UserAppsService)
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(UserAppsPermissions)
}
