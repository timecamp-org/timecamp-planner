import { NextFunction, Response, Request } from 'express';
import { PermissionType, PermissionOptions, PermissionContext, CheckPermissionStatus } from './types';
import ErrorDefinitions, { ErrorResponse, Type } from '../common/ErrorDefinitions';
import { MiddlewareHandler } from '../../../../infrastructure/RouteLoader';
import { interfaces } from 'inversify';
import { PermissionServiceInterface } from './interfaces/PermissionServiceInterface';
import { PermissionsModule } from './PermissionsModule';
import { TagLoggerFactory } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';

export const createPermissionMiddleware: interfaces.Factory<MiddlewareHandler> = (context: interfaces.Context) => {
  const permissionService = context.container.get<PermissionServiceInterface>(
    PermissionsModule.PermissionServiceInterface
  );
  const tagLoggerFactory = context.container.get<TagLoggerFactory>(InfrastructureModule.TagLoggerFactory);
  const options = context.container.get<PermissionOptions>(PermissionsModule.PermissionOptions);
  const logger = tagLoggerFactory.create('PermissionMiddleware v1.1');

  return (permissionTypes: PermissionType[]) => async (req: Request, res: Response, next: NextFunction) => {
    if (!options.isEnabled) {
      return next();
    }

    const userId = req.heyspace.authResult.userId;
    const context: PermissionContext = buildPermissionContext(req);
    const requestDescription = getRequestDescription(req);
    const usedRoles = permissionTypes.join(',');

    try {
      logger.debug(`Check permission: "${requestDescription}" with roles [${usedRoles}]`);
      const result = await permissionService.checkPermission(permissionTypes, context);

      switch (result.status) {
        case CheckPermissionStatus.OK: {
          return next();
        }
        case CheckPermissionStatus.NOT_PERMITTED: {
          logger.warn(
            `Permission denied: "${requestDescription}" for user ${userId} with roles [${usedRoles}]. Reason: ${result.reason}.`
          );
          return res.send(new ErrorResponse(403, 403, `Permission denied. Reason: ${result.reason || ''}`));
        }
        case CheckPermissionStatus.RESOURCE_NOT_FOUND: {
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
        }
        default: {
          return res.send(ErrorDefinitions[Type.INTERNAL]);
        }
      }
    } catch (error) {
      logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  };
};

function getRequestDescription(req: Request): string {
  return `${req.method}: ${req.originalUrl}`;
}

function buildPermissionContext(req: Request): PermissionContext {
  const currentUserId = req.heyspace.authResult.userId;
  return {
    currentUserId,
    ...req.params,
    ...req.body,
    metadata: req.query || {},
  };
}
