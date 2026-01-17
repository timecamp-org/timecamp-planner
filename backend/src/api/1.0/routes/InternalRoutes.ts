import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { InternalController } from '../controllers/InternalController';
import * as autoBind from 'auto-bind'
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class InternalRouteConfig implements RouteConfigInterface {

  private internalController: InternalController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.InternalController)
      internalController: InternalController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.internalController = autoBind(internalController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      paths:
      {
        '/myIp': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
          get: this.internalController.getClientIp,
        },
        '/appVersion/:appPlatform': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
          get: this.internalController.getAppVersion,
        },
        '/projects/:projectId': {
          use: [
            requireAuthenticatedMiddleware(),
            this.requirePermission([PermissionType.VIEW_PROJECT])
          ],
          paths: {
            '/messageBoard': {
              action: this.internalController.getProjectMessageBoardAction,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            },
            '/viewData': {
              action: this.internalController.getProjectViewData,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            },
            '/files': {
              action: this.internalController.getProjectFiles,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            },
          }
        },
        '/tasks/:taskId': {
          use: [
            requireAuthenticatedMiddleware(),
            this.requirePermission([PermissionType.VIEW_TASK])
          ],
          get: {
            action: this.internalController.getTaskDetailsAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
          },
          paths: {
            '/messageBoard': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              action: this.internalController.getTaskMessageBoardAction,
            },
            '/files': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              action: this.internalController.getTaskFiles,
            },
          }
        },
        '/conversationViewData/:organizationId/:userId': {
          use: [
            requireAuthenticatedMiddleware(),
            this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
            this.requirePermission([PermissionType.VIEW_CONVERSATION_DATA])
          ],
          action: this.internalController.getConversationViewData,
        },
        '/organizations/:organizationId': {
          use: [
            requireAuthenticatedMiddleware(),
            this.requirePermission([PermissionType.VIEW_ORGANIZATION])
          ],
          paths: {
            '/latestActiveConversations': {
              action: this.internalController.getLatestActiveUserConversations,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
            },
            '/viewData': {
              action: this.internalController.getOrganizationViewData,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
            },
            '/tagsOverview': {
              action: this.internalController.getOrganizationTagsOverviewData,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
            },
            '/backgroundResources': {
              action: this.internalController.getFrontendBackgroundResourcesAction,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            },
          }
        },
        '/linkMetadata': {
          use: [requireAuthenticatedMiddleware()],
          get: this.internalController.getLinkMetadataAction,
        },
      }
    }
  }
}
