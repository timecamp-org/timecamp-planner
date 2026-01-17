import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { ActivityController } from '../controllers/ActivityController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class ActivityRouteConfig implements RouteConfigInterface {

  private activityController: ActivityController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.ActivityController)
      activityController: ActivityController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.activityController = autoBind(activityController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/:containerType/:containerId': {
          use: [
            this.requirePermission([PermissionType.VIEW_ACTIVITIES])
          ],
          get: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),

            ],
            action: this.activityController.getActivitiesAction,
          },
        },
      }
    }
  }
}
