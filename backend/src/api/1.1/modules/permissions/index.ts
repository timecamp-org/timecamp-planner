import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { PermissionServiceInterface } from './interfaces/PermissionServiceInterface';
import { PermissionsModule } from './PermissionsModule';
import { PermissionService } from './PermissionService';
import { createPermissionMiddleware } from './requirePermissionMiddlewareFactory';
import { PermissionMiddlewareHandler, PermissionOptions } from './types';
import { PermissionChainInterface } from './interfaces/PermissionChainInterface';
import { PermissionChain } from './PermissionChain';
import { interfaces } from 'inversify';
import { EntityPermissionInterface } from './interfaces/EntityPermissionInterface';

export const permissionsModule: ModuleLoaderType = (kernel, config) => {
  kernel.bind<PermissionChainInterface>(PermissionsModule.PermissionChainInterface)
    .to(PermissionChain)

  kernel.bind<PermissionServiceInterface>(PermissionsModule.PermissionServiceInterface)
    .to(PermissionService)
    .onActivation((ctx: interfaces.Context, service: PermissionServiceInterface) => {
      const entityPermissions = ctx.container.getAll<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface);
      entityPermissions.forEach(entityPermission => entityPermission.registerChainableRules())
      return service
    })

  kernel.bind<PermissionMiddlewareHandler>(PermissionsModule.PermissionMiddleware)
    .toFactory(createPermissionMiddleware);

  kernel.bind<PermissionOptions>(PermissionsModule.PermissionOptions)
    .toConstantValue(config.permissions)

}
