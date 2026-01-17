import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import {
  PermissionType,
  PermissionMiddlewareHandler,
} from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { GroupController } from '../controllers/GroupController';

@injectable()
export class GroupRouteConfig implements RouteConfigInterface {
  private groupController: GroupController;
  private requirePermission: PermissionMiddlewareHandler;
  private rateLimitService: RateLimitServiceInterface;

  constructor(
    @inject(ControllersModule.GroupController)
    groupController: GroupController,
    @inject(PermissionsModule.PermissionMiddleware)
    requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.groupController = autoBind(groupController);
    this.requirePermission = requirePermission;
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        use: [this.requirePermission([PermissionType.CREATE_GROUP])],
        action: this.groupController.createOrganizationGroupAction,
      },
      paths: {
        '/:groupId': {
          use: [
            this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
          ],
          patch: {
            use: [this.requirePermission([PermissionType.UPDATE_GROUP])],
            action: this.groupController.updateOrganizationGroupAction,
          },
          delete: {
            use: [this.requirePermission([PermissionType.UPDATE_GROUP])],
            action: this.groupController.deleteOrganizationGroupAction,
          },
          paths: {
            '/people': {
              get: {
                use: [this.requirePermission([PermissionType.UPDATE_GROUP])],
                action: this.groupController.getGroupUserIdsAction,
              },
              paths: {
                '/:userId': {
                  put: {
                    use: [
                      this.requirePermission([PermissionType.UPDATE_GROUP]),
                    ],
                    action: this.groupController.addUserToGroupAction,
                  },
                  delete: {
                    use: [
                      this.requirePermission([PermissionType.UPDATE_GROUP]),
                    ],
                    action: this.groupController.removeUserFromGroupAction,
                  },
                },
              },
            },
          },
        },
      },
    };
  }
}
