import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import {
  PermissionType,
  PermissionMiddlewareHandler,
} from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind';
import { TaskController } from '../controllers/TaskController';
import { InternalController } from '../controllers/InternalController';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { ChecklistController } from '../controllers/ChecklistController';

@injectable()
export class TaskRouteConfig implements RouteConfigInterface {
  private taskController: TaskController;
  private checklistController: ChecklistController;
  private internalController: InternalController;
  private requirePermission: PermissionMiddlewareHandler;
  private rateLimitService: RateLimitServiceInterface;

  constructor(
    @inject(ControllersModule.TaskController)
    taskController: TaskController,
    @inject(ControllersModule.InternalController)
    internalController: InternalController,
    @inject(PermissionsModule.PermissionMiddleware)
    requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface,
    @inject(ControllersModule.ChecklistController)
    checklistController: ChecklistController
  ) {
    this.taskController = autoBind(taskController);
    this.checklistController = autoBind(checklistController);
    this.internalController = autoBind(internalController);
    this.requirePermission = requirePermission;
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.taskController.createTaskAction,
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
          this.requirePermission([PermissionType.CREATE_TASK]),
        ],
      },
      paths: {
        '/:taskId': {
          get: {
            action: this.internalController.getTaskDetailsAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              this.requirePermission([PermissionType.VIEW_TASK]),
            ],
          },
          put: {
            action: this.taskController.createTaskAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
              this.requirePermission([PermissionType.CREATE_TASK]),
            ],
          },
          patch: {
            action: this.taskController.updateTaskAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
              this.requirePermission([PermissionType.VIEW_TASK]),
            ],
          },
          paths: {
            '/people/:userId': {
              use: [this.requirePermission([PermissionType.VIEW_TASK])],
              put: {
                action: this.taskController.addTaskPeopleAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              patch: {
                action: this.taskController.updateTaskPeopleRoleAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
              delete: {
                action: this.taskController.deleteTaskPeopleRoleAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
            },
            '/followers/:userId': {
              use: [this.requirePermission([PermissionType.VIEW_TASK])],
              put: {
                action: this.taskController.addTaskFollowerAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              delete: {
                action: this.taskController.removeTaskFollowerAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
            },
            '/latestVisit/:userId': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.CREATE_FREQUENTLY
                ),
                this.requirePermission([PermissionType.VIEW_TASK]),
              ],
              put: this.taskController.setUserLatestTaskVisitDateAction,
            },
            '/tags/:tagId': {
              use: [
                this.requirePermission([
                  PermissionType.VIEW_TASK,
                  PermissionType.UPDATE_TAG,
                ]),
              ],
              put: {
                action: this.taskController.attachTagToTaskAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              delete: {
                action: this.taskController.detachTagFromTaskAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
            },
            '/attachments/:fileId': {
              use: [this.requirePermission([PermissionType.VIEW_TASK])],
              put: {
                action: this.taskController.attachFileToTaskAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              delete: {
                action: this.taskController.detachFileFromTaskAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
            },
            '/checklist': {
              use: [this.requirePermission([PermissionType.VIEW_TASK])],
              get: {
                action: this.taskController.getTaskChecklistAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.GET_FREQUENTLY
                  ),
                ],
              },
              post: {
                action: this.checklistController.createChecklistItemAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              paths: {
                '/:checkListItemId': {
                  get: {
                    action: this.checklistController.getChecklistItemAction,
                    use: [
                      this.rateLimitService.getLimiter(
                        RateLimitRule.GET_FREQUENTLY
                      ),
                    ],
                  },
                  put: {
                    action: this.checklistController.createChecklistItemAction,
                    use: [
                      this.rateLimitService.getLimiter(
                        RateLimitRule.CREATE_FREQUENTLY
                      ),
                    ],
                  },
                  patch: {
                    action: this.checklistController.updateChecklistItemAction,
                    use: [
                      this.rateLimitService.getLimiter(
                        RateLimitRule.UPDATE_FREQUENTLY
                      ),
                    ],
                  },
                  delete: {
                    action: this.checklistController.deleteChecklistItemAction,
                    use: [
                      this.rateLimitService.getLimiter(
                        RateLimitRule.UPDATE_FREQUENTLY
                      ),
                    ],
                  },
                },
              },
            },
            '/timeEstimates': {
              use: [this.requirePermission([PermissionType.VIEW_TASK])],
              get: {
                action: this.taskController.getTaskTimeEstimatesAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.GET_FREQUENTLY
                  ),
                ],
              },
              post: {
                action: this.taskController.createTaskTimeEstimatesAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.CREATE_FREQUENTLY
                  ),
                ],
              },
              patch: {
                action: this.taskController.updateTaskTimeEstimatesAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
              delete: {
                action: this.taskController.deleteTaskTimeEstimatesAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.UPDATE_FREQUENTLY
                  ),
                ],
              },
            },
          },
        },
        '/:sourceTaskId': {
          use: [this.requirePermission([PermissionType.VIEW_TASK])],
          paths: {
            '/copy': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.CREATE_FREQUENTLY
                ),
              ],
              post: this.taskController.copyTaskAction,
            },
          },
        },
      },
    };
  }
}
