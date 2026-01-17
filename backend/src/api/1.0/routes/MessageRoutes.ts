import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { MessageController } from '../controllers/MessageController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class MessageRouteConfig implements RouteConfigInterface {

  private messageController: MessageController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.MessageController)
      messageController: MessageController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.messageController = autoBind(messageController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
          this.requirePermission([PermissionType.VIEW_ORGANIZATION, PermissionType.CREATE_MESSAGE])
        ],
        action: this.messageController.createMessageAction,
      },
      paths: {
        '/:messageId': {
          put: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
              this.requirePermission([PermissionType.CREATE_MESSAGE])
            ],
            action: this.messageController.createMessageAction,
          },
          patch: {
            action: this.messageController.updateMessageAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.UPDATE_MESSAGE])
            ],
          },
          delete: {
            action: this.messageController.deleteMessageAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.UPDATE_MESSAGE])
            ],
          },
          paths: {
            '/reactions': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY),
              ],
              post: {
                action: this.messageController.addReactionAction,
                use: [this.requirePermission([PermissionType.CREATE_REACTION])],
              },
              paths: {
                '/:reactionId': {
                  put: {
                    action: this.messageController.addReactionAction,
                    use: [this.requirePermission([PermissionType.CREATE_REACTION])],
                  },
                  delete: {
                    action: this.messageController.deleteReactionAction,
                    use: [this.requirePermission([PermissionType.UPDATE_REACTION])],
                  }
                }
              }
              
            },
          }
        },
        '/:containerType/:containerId': {
          use: [this.requirePermission([PermissionType.VIEW_MESSAGES])],
          get: {
            action: this.messageController.getContainerMessagesAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
          },
          paths: {
            '/messageRead': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
              patch: this.messageController.updateMessageReadAction,
            },
            '/messageKeyPress': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
              patch: this.messageController.updateKeyPressAction,
            },
            '/metadata': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              get: this.messageController.getContainerMetadataAction,
            }
          }
        },
      }
    }
  }
}
