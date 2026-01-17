import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ActivitiesModule } from './ActivitiesModule'
import { ActivityService } from './ActivityService';
import { ActivityServiceInterface } from './interfaces/ActivityServiceInterface';
import { ActivityProviderInterface } from './interfaces/ActivityProviderInterface';
import { ActivityProvider } from './dataProviders/ActivityProvider';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { ActivityPermissions } from './ActivityPermissions';

export const activitiesModule : ModuleLoaderType = kernel => {
  kernel.bind<ActivityProviderInterface>(ActivitiesModule.ActivityProviderInterface).to(ActivityProvider);
  kernel.bind<ActivityServiceInterface>(ActivitiesModule.ActivityServiceInterface).to(ActivityService);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ActivityPermissions)
}
