import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';
import { SettingsController } from '../controllers/SettingsController';

@injectable()
export class SettingsRouteConfig implements RouteConfigInterface {
  private settingsController: SettingsController;

  constructor(
    @inject(ControllersModule.SettingsController)
      viewSettingsController: SettingsController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
  ) {
    this.settingsController = autoBind(viewSettingsController)
  }


  getPathConfig(): PathConfig {
    return {
      paths: {
        '/userInOrganization': {
          paths: {
            '/:settingsId': {
              use: [requireAuthenticatedMiddleware()],
              get: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                  this.requirePermission([PermissionType.CAN_GET_USER_IN_ORGANIZATION_SETTINGS])
                ],
                action: this.settingsController.getUserInOrganizationSettings,
              },
              put: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                  this.requirePermission([PermissionType.CAN_UPDATE_USER_IN_ORGANIZATION_SETTINGS])
                ],
                action: this.settingsController.saveUserInOrganizationSettingsAction,
              },
            },
            '/:organizationId/:settingsType': {
              use: [requireAuthenticatedMiddleware()],
              get: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                  this.requirePermission([PermissionType.CAN_GET_USER_IN_ORGANIZATION_SETTINGS])
                ],
                action: this.settingsController.getUserInOrganizationSettings,
              },
              put: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                  this.requirePermission([PermissionType.CAN_UPDATE_USER_IN_ORGANIZATION_SETTINGS])
                ],
                action: this.settingsController.saveUserInOrganizationSettingsAction,
              },
            },
          }
        }
      },
    }
  }
}
