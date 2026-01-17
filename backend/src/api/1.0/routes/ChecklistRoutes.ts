import { RouteConfigInterface } from './RouteConfigInterface'
import { inject, injectable } from 'inversify'
import { PermissionsModule } from '../modules/permissions/PermissionsModule'
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types'
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule'
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface'
import * as autoBind from 'auto-bind'
import { ControllersModule } from '../controllers/ControllersModule'
import { ChecklistController } from '../controllers/ChecklistController'
import { PathConfig } from '../../../infrastructure/RouteLoader'
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware'
import { RateLimitRule } from '../modules/rateLimiter/types'

@injectable()
export class ChecklistRoutesConfig implements RouteConfigInterface {

  constructor(
    @inject(ControllersModule.ChecklistController)
      private checklistController: ChecklistController,
    @inject(PermissionsModule.PermissionMiddleware)
      private requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      private rateLimitService: RateLimitServiceInterface,
  ) {
    this.checklistController = autoBind(checklistController)
  }

  getPathConfig(): PathConfig {
    return {
      use: [
        requireAuthenticatedMiddleware(),
      ],
      paths: {
        '/:checklistItemId': {
          paths: {
            '/people/:userId': {
              use: [
                this.requirePermission([PermissionType.UPDATE_CHECKLIST_ITEM_ASSIGNEES])
              ],
              put: {
                action: this.checklistController.addChecklistItemAssigneeAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
              },
              delete: {
                action: this.checklistController.removeChecklistItemAssigneeAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
              }
            }
          }
        }
      }
    }
  }
}