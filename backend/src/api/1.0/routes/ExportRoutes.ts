import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { ExportController } from '../controllers/ExportController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';

@injectable()
export class ExportRouteConfig implements RouteConfigInterface {

  private exportController: ExportController

  constructor(
    @inject(ControllersModule.ExportController)
      exportController: ExportController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
  ) {
    this.exportController = autoBind(exportController)
  }


  getPathConfig(): PathConfig {
    return {
      paths: {
        '/:dataType/:format': {
          get: {
            action: this.exportController.exportDataAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
              this.requirePermission([PermissionType.EXPORT_DATA]),
            ],
          }
        }
      }
    }
  }
}
