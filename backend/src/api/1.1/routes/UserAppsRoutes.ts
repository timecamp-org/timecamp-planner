import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import * as autoBind from 'auto-bind'
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';
import { UserAppsController } from '../controllers/UserAppsController';

@injectable()
export class UserAppsRouteConfig implements RouteConfigInterface {

  constructor(
    @inject(ControllersModule.UserAppsController)
    private userAppsController: UserAppsController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
  ) {
    this.userAppsController = autoBind(userAppsController)
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.userAppsController.createAppAction,
        use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
      },
      get: {
        action: this.userAppsController.getUserAppsAction,
        use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
      },
      paths: {
        '/:appId': {
          put: {
            action: this.userAppsController.createAppAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
          },
          patch: {
            action: this.userAppsController.updateAppAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.UPDATE_APP])
            ],
          },
          delete: {
            action: this.userAppsController.deleteAppAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.DELETE_APP])
            ],
          },
          paths: {
            '/people': {
              post: {
                action: this.userAppsController.inviteAppMemberAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
                  this.requirePermission([PermissionType.ADD_APP_MEMBER])
                ],
              },
              paths: {
                '/:userId': {
                  use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                  put: {
                    action: this.userAppsController.addAppMemberAction,
                    use: [
                      this.requirePermission([PermissionType.ADD_APP_MEMBER])
                    ]
                  },
                  delete: {
                    action: this.userAppsController.removeAppMemberAction,
                    use: [
                      this.requirePermission([PermissionType.REMOVE_APP_MEMBER])
                    ]
                  },
                }
              },
            }
          }
        },
      }
    }
  }
}
