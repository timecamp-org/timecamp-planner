import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ChecklistModule } from './ChecklistModule';
import { ChecklistItemService } from './ChecklistItemService';
import { ChecklistItemServiceInterface } from './ChecklistItemServiceInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface'
import { PermissionsModule } from '../permissions/PermissionsModule'
import { ChecklistPermissions } from './ChecklistPermissions'
import { ChecklistItemProviderInterface } from './ChecklistItemProviderInterface'
import { ChecklistItemProvider } from './ChecklistItemProvider'

export const checklistModule : ModuleLoaderType = kernel => {
  kernel.bind<ChecklistItemServiceInterface>(ChecklistModule.ChecklistItemServiceInterface).to(ChecklistItemService);
  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ChecklistPermissions);
  kernel.bind<ChecklistItemProviderInterface>(ChecklistModule.ChecklistItemProviderInterface).to(ChecklistItemProvider)
}
