import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { CustomFieldService } from './CustomFieldService'
import { ExtensionService } from './ExtensionService'
import { ExtensionsModule } from './ExtensionsModule'
import { RelationNameFactory } from './RelationNameFactory'
import { ExtensionController } from '../../controllers/ExtensionController';
import { CustomFieldController } from '../../controllers/CustomFieldController';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface'
import { PermissionsModule } from '../permissions/PermissionsModule'
import { ExtensionPermissions } from './ExtensionPermissions'
import { CustomFieldServiceInterface } from './interfaces/CustomFieldServiceInterface'
import { ExtensionServiceInterface } from './interfaces/ExtensionServiceInterface'
import { CustomRelationSqlFactoryInterface } from './interfaces/CustomRelationSqlFactoryInterface'
import { WorkspaceExtensionResource } from './resources/WorkspaceExtensionResource';
import { ExtensionProvider } from './providers/ExtensionProvider';
import { WorkspaceExtensionProvider } from './providers/WorkspaceExtensionProvider';
import { CustomRelationProvider } from './providers/CustomRelationProvider';
import { CustomFieldProvider } from './providers/CustomFieldProvider';

export const extensionsModule: ModuleLoaderType = kernel => {
  kernel.bind<CustomFieldServiceInterface>(ExtensionsModule.CustomFieldServiceInterface).to(CustomFieldService);
  kernel.bind<ExtensionServiceInterface>(ExtensionsModule.ExtensionServiceInterface).to(ExtensionService);
  kernel.bind<CustomRelationSqlFactoryInterface>(ExtensionsModule.CustomRelationSqlFactoryInterface).to(RelationNameFactory);
  kernel.bind(ExtensionsModule.ExtensionController).to(ExtensionController);
  kernel.bind(ExtensionsModule.CustomFieldController).to(CustomFieldController);
  kernel.bind(ExtensionsModule.WorkspaceExtensionResource).to(WorkspaceExtensionResource);
  kernel.bind(ExtensionsModule.ExtensionProviderInterface).to(ExtensionProvider);
  kernel.bind(ExtensionsModule.WorkspaceExtensionProviderInterface).to(WorkspaceExtensionProvider);
  kernel.bind(ExtensionsModule.CustomRelationProviderInterface).to(CustomRelationProvider);
  kernel.bind(ExtensionsModule.CustomFieldProviderInterface).to(CustomFieldProvider);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ExtensionPermissions)
}
