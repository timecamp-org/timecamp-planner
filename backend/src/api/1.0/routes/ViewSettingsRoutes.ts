import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { ViewSettingsController } from '../controllers/ViewSettingsController';
import { RateLimitRule } from '../modules/rateLimiter/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';

@injectable()
export class ViewSettingsRouteConfig implements RouteConfigInterface {
  private viewSettingsController: ViewSettingsController;

  constructor(
    @inject(ControllersModule.ViewSettingsController)
      viewSettingsController: ViewSettingsController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
  ) {
    this.viewSettingsController = autoBind(viewSettingsController)
  }


  getPathConfig(): PathConfig {
    return {
      post: {
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
          this.requirePermission([PermissionType.CAN_CREATE_VIEW_SETTINGS])
        ],
        action: this.viewSettingsController.createViewSettingsWithLinksAction,
      },
      paths: {
        '/:viewSettingsId': {
          use: [requireAuthenticatedMiddleware()],
          get: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.getViewSettingsAction,
          },
          put: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.saveViewSettingsAction,
          },
          delete: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.deleteViewSettingsAction,
          },
          paths: {
            '/links': {
              post: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
                  this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS_LINK])
                ],
                action: this.viewSettingsController.createViewSettingsLinkAction,
              },
              paths: {
                '/:linkedViewSettingsId': {
                  delete: {
                    use: [
                      this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                      this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS_LINK])
                    ],
                    action: this.viewSettingsController.removeViewSettingsLinkAction,
                  },
                }
              }
            }
          }
        },
        '/:viewType/:containerType/:containerId': {
          use: [requireAuthenticatedMiddleware()],
          get: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.getViewSettingsAction,
          },
          put: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.saveViewSettingsAction,
          },
          delete: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
              this.requirePermission([PermissionType.CAN_UPDATE_VIEW_SETTINGS])
            ],
            action: this.viewSettingsController.deleteViewSettingsAction,
          },
        },
      }
    }
  }
}
