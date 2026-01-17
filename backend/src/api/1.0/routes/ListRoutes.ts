import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { ListController } from '../controllers/ListController';
import * as autoBind from 'auto-bind'
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class ListRouteConfig implements RouteConfigInterface {

  private listController: ListController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.ListController)
      listController: ListController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.listController = autoBind(listController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.listController.createListAction,
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
          this.requirePermission([PermissionType.CREATE_LIST]),
        ],
      },
      paths: {
        '/:listId': {
          put: {
            action: this.listController.createListAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
              this.requirePermission([PermissionType.CREATE_LIST]),
            ]
          },
          get: {
            action: this.listController.getListAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              this.requirePermission([PermissionType.VIEW_LIST])
            ]
          },
          patch: {
            action: this.listController.updateListAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.VIEW_LIST])
            ]
          },
          paths: {
            '/tasks': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                this.requirePermission([PermissionType.VIEW_LIST])
              ],
              get: this.listController.getListTasksAction,
            },
            '/followers/:userId': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                this.requirePermission([PermissionType.VIEW_LIST])
              ],
              put: this.listController.addFollowerAction,
              delete: this.listController.removeFollowerAction,
            }
          }
        },
        '/:sourceListId': {
          use: [
            this.requirePermission([PermissionType.VIEW_LIST])
          ],
          paths: {
            '/copy': {
              post: this.listController.copyListAction,
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
            },
            '/moveAllTasks': {
              post: this.listController.moveAllTasksInListAction,
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
            },
          }
        }
      }
    }
  }
}
