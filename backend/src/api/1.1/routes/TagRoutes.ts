import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { TagController } from '../controllers/TagController';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class TagRouteConfig implements RouteConfigInterface {

  private tagController: TagController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.TagController)
      tagController: TagController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.tagController = autoBind(tagController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        use: [this.requirePermission([PermissionType.CREATE_TAG])],
        action: this.tagController.createTagAction,
      },
      paths: {
        '/:tagId': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
          put: {
            use: [this.requirePermission([PermissionType.CREATE_TAG])],
            action: this.tagController.createTagAction,
          },
          patch: {
            use: [this.requirePermission([PermissionType.UPDATE_TAG])],
            action: this.tagController.updateTagAction,
          },
          delete: {
            use: [this.requirePermission([PermissionType.UPDATE_TAG])],
            action: this.tagController.deleteTagAction,
          },
        },
        '/usage/:organizationId': {
          use: [
            this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
            this.requirePermission([PermissionType.VIEW_TAGS_OVERVIEW])
          ],
          get: this.tagController.getTagsUsageStatisticsAction,
        }
      }
    }
  }
}
