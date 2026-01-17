import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ProjectController } from '../controllers/ProjectController';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';

@injectable()
export class ProjectRouteConfig implements RouteConfigInterface {
  private projectController: ProjectController;
  private requirePermission: PermissionMiddlewareHandler;
  private rateLimitService: RateLimitServiceInterface;

  constructor(
    @inject(ControllersModule.ProjectController)
    projectController: ProjectController,
    @inject(PermissionsModule.PermissionMiddleware)
    requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.projectController = autoBind(projectController);
    this.requirePermission = requirePermission;
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.projectController.createProjectAction,
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
          this.requirePermission([PermissionType.CREATE_PROJECT]),
        ],
      },
      paths: {
        '/:projectId': {
          put: {
            action: this.projectController.createProjectAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
              this.requirePermission([PermissionType.CREATE_PROJECT]),
            ],
          },
          get: {
            action: this.projectController.getProjectAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              this.requirePermission([PermissionType.VIEW_PROJECT]),
            ],
          },
          patch: {
            action: this.projectController.updateProjectAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.VIEW_PROJECT]),
            ],
          },

          paths: {
            '/people': {
              get: {
                action: this.projectController.getProjectPersonsAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              },
              put: {
                action: this.projectController.addProjectPersonsAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_PROJECT_PEOPLE]),
                ],
              },
            },

            '/people/:userId': {
              put: {
                action: this.projectController.addProjectPersonAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_PROJECT_PEOPLE]),
                ],
              },
              patch: {
                action: this.projectController.updateProjectPersonAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_PROJECT_PEOPLE]),
                ],
              },
              delete: {
                action: this.projectController.deleteProjectPersonAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.DELETE_PROJECT_PEOPLE]),
                ],
              },
            },

            '/followers/:userId': {
              use: [this.requirePermission([PermissionType.VIEW_PROJECT])],
              put: {
                action: this.projectController.addProjectFollowerAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
              },
              delete: {
                action: this.projectController.deleteProjectFollowerAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
              },
            },

            '/userProjectSettings': {
              use: [this.requirePermission([PermissionType.VIEW_PROJECT])],
              get: {
                action: this.projectController.getUserProjectSettings,
                use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              },
              put: {
                action: this.projectController.setUserProjectSettings,
                use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
              },
            },

            '/lists': {
              get: this.projectController.getProjectListsAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                this.requirePermission([PermissionType.VIEW_PROJECT]),
              ],
            },
            '/tasks': {
              get: this.projectController.getProjectTasksAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                this.requirePermission([PermissionType.VIEW_PROJECT]),
              ],
            },
            '/copy': {
              post: this.projectController.copySpaceAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
                this.requirePermission([PermissionType.VIEW_PROJECT]),
              ],
            },
            '/latestVisit': {
              use: [
                requireAuthenticatedMiddleware(),
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY),
                this.requirePermission([PermissionType.VIEW_PROJECT]),
              ],
              put: this.projectController.setProjectLatestVisit,
            },
            '/attachments': {
              use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              get: this.projectController.getProjectAttachments,
            },
            '/files': {
              use: [
                requireAuthenticatedMiddleware(),
                this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
              ],
              post: this.projectController.createProjectFileAction,
            },
          },
        },
        '/:organizationId': {
          paths: {
            '/conversation': {
              get: this.projectController.getConversation,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
              ],
            },
          },
        },
      },
    };
  }
}
