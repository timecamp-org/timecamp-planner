import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { NotificationController } from '../controllers/NotificationController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class NotificationRouteConfig implements RouteConfigInterface {

  private notificationController: NotificationController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.NotificationController)
      notificationController: NotificationController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.notificationController = autoBind(notificationController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/:notificationId': {
          use: [
            this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
            this.requirePermission([PermissionType.UPDATE_NOTIFICATION])
          ],
          patch: this.notificationController.updateNotificationAction,
        },
      }
    }
  }
}
