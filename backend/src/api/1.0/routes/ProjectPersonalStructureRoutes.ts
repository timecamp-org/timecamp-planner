import { RouteConfigInterface } from './RouteConfigInterface';
import { RouteConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { ProjectPersonalStructureController } from '../controllers/ProjectPersonalStructureController';
import * as autoBind from 'auto-bind';

@injectable()
export class ProjectPersonalStructureRouteConfig implements RouteConfigInterface {

  private personalProjectOrderController: ProjectPersonalStructureController

  constructor(
    @inject(ControllersModule.ProjectPersonalStructureController)
      personalProjectOrderController: ProjectPersonalStructureController,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface
  ) {
    this.personalProjectOrderController = autoBind(personalProjectOrderController)
  }

  getRouteConfig(): RouteConfig {
    return {
      '/personalProjectStructure': {
        use: [requireAuthenticatedMiddleware()],
        paths: {
          '/:organizationId': {
            get: {
              action: this.personalProjectOrderController.getProjectPersonalStructureAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                this.requirePermission([PermissionType.GET_PERSONAL_PROJECT_STRUCTURE]),
              ]
            },
            paths: {
              '/:projectId': {
                put: this.personalProjectOrderController.updatePersonalProjectOrderAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                  this.requirePermission([PermissionType.UPDATE_PERSONAL_PROJECT_STRUCTURE]),
                ],
              },
            },
          },
        },
      },
      '/projectGroups': {
        post: {
          action: this.personalProjectOrderController.createPersonalProjectGroupAction,
          use: [
            this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
            this.requirePermission([PermissionType.CREATE_PROJECT_GROUP]),
          ],
        },
        paths: {
          '/:groupId': {
            patch: {
              action: this.personalProjectOrderController.updatePersonalProjectGroupAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                this.requirePermission([PermissionType.UPDATE_PROJECT_GROUP]),
              ]
            },
            delete: {
              action: this.personalProjectOrderController.deletePersonalProjectGroupAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                this.requirePermission([PermissionType.UPDATE_PROJECT_GROUP]),
              ],
            },
          },
        },
      }
    }
  }
}
