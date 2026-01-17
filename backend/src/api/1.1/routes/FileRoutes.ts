import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { FileController } from '../controllers/FileController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class FileRouteConfig implements RouteConfigInterface {

  private fileController: FileController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.FileController)
      fileController: FileController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.fileController = autoBind(fileController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/signature': {
          post: this.fileController.signUploadRequestAction,
          use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
        },
        '/:fileId': {
          use: [
            this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
            this.requirePermission([PermissionType.CREATE_FILE])
          ],
          put: this.fileController.createFileAction,
          delete: this.fileController.deleteFileAction,
        }
      }
    }
  }
}
