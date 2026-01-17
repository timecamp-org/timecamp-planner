import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { inject, injectable } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionMiddlewareHandler, PermissionType } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { UserController } from '../controllers/UserController';
import { UserStatusController } from '../controllers/UserStatusController';
import * as autoBind from 'auto-bind';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { NotificationController } from '../controllers/NotificationController';

@injectable()
export class UserRouteConfig implements RouteConfigInterface {
  private userController: UserController;
  private userStatusController: UserStatusController;
  private requirePermission: PermissionMiddlewareHandler;
  private rateLimitService: RateLimitServiceInterface;
  private notificationController: NotificationController;

  constructor(
    @inject(ControllersModule.UserController)
    userController: UserController,
    @inject(ControllersModule.UserStatusController)
    userStatusController: UserStatusController,
    @inject(PermissionsModule.PermissionMiddleware)
    requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface,
    @inject(ControllersModule.NotificationController)
    notificationController: NotificationController
  ) {
    this.userController = autoBind(userController);
    this.userStatusController = autoBind(userStatusController);
    this.requirePermission = requirePermission;
    this.rateLimitService = rateLimitService;
    this.notificationController = autoBind(notificationController);
  }

  getPathConfig(): PathConfig {
    return {
      paths: {
        '/self': {
          use: [requireAuthenticatedMiddleware()],

          get: {
            action: this.userController.getSelfAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
          },
          patch: {
            action: this.userController.updateSelfAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
          },
          delete: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.DELETE_USER]),
            ],
            action: this.userController.deleteSelfAction,
          },

          paths: {
            '/organizationSubscriptions': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getUserOrganizationSubscriptions,
            },
            '/organizations': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getUserOrganizationsAction,
            },
            '/organizationRoles': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getUserOrganizationRolesAction,
            },
            '/password': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
              patch: this.userController.updatePasswordAction,
            },
            '/pushDevices/:deviceId': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
              put: this.userController.addPushDeviceAction,
              delete: this.userController.deletePushDeviceAction,
            },
            '/:projectId/chatNotificationSettings': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                this.requirePermission([PermissionType.VIEW_PROJECT]),
              ],
              put: this.userController.updateChatNotificationSettingsType,
            },
            '/chatNotificationSettings': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getUserChatNotificationSettingsTypes,
            },
            '/deleteAvatar': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
              delete: this.userController.deleteUserAvatarAction,
            },
            '/unreadNotifications': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getAllUnreadNotificationsAction,
            },
            '/latestNotificationDisplays': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
              get: this.userController.getUserLatestAllNotificationsDisplay,
            },
            '/initialData/:localOrganizationId': {
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
              get: this.userController.getUserInitialData,
            },
            '/:organizationId': {
              use: [this.requirePermission([PermissionType.VIEW_ORGANIZATION])],
              paths: {
                '/latestNotificationDisplays': {
                  get: {
                    action: this.userController.getUserInOrganizationLatestNotificationsDisplay,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
                  },
                  put: {
                    action: this.userController.saveUserInOrganizationLatestNotificationDisplay,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                  },
                },
                '/latestVisitedTasks': {
                  action: this.userController.getUserLatestVisitedTasks,
                  use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
                },
                '/notifications': {
                  get: {
                    action: this.userController.getNotificationsByOrganizationAction,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
                  },
                  paths: {
                    '/archive': {
                      patch: {
                        action: this.notificationController.archiveUserInOrganizationNotificationsAction,
                        use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                      },
                    },
                  },
                },
                '/jobStatuses': {
                  use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
                  get: this.userController.getUserInOrganizationJobStatuses,
                },
                '/unreadNotifications': {
                  get: {
                    action: this.userController.getUnreadNotificationsByOrganizationAction,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
                  },
                  patch: {
                    action: this.userController.updateUnreadNotificationsByOrganizationAction,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                  },
                },
                '/:containerType/:containerId/unreadNotifications': {
                  patch: this.userController.updateUnreadNotificationsByContainerAction,
                  use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                },
                '/notificationsDeliverySettings': {
                  get: {
                    action: this.userController.getNotificationDeliverySettingsAction,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
                  },
                  put: {
                    action: this.userController.updateNotificationDeliverySettingsAction,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
                  },
                },
                '/userStatuses': {
                  get: {
                    action: this.userStatusController.getOrganizationUserStatuses,
                    use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
                  },
                },
                '/userStatus': {
                  use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_FREQUENTLY)],
                  patch: this.userStatusController.setUserStatus,
                  delete: this.userStatusController.deleteUserStatus,
                },
              },
            },
          },
        },
        '/:userId': {
          put: {
            action: this.userController.createUserAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_ACCOUNT)],
          },
          paths: {
            '/openId': {
              put: {
                action: this.userController.createOpenIdUserAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_ACCOUNT)],
              },
            },
            '/apple': {
              put: {
                action: this.userController.createAppleUserAction,
                use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_ACCOUNT)],
              },
            },
          },
        },
        '/:email': {
          action: this.userController.checkEmailExistsAction,
          use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
        },
        '/:email/resetPassword': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
          post: this.userController.resetPasswordAction,
        },
        '/password/token': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
          patch: this.userController.updatePasswordByTokenAction,
        },
      },
    };
  }
}
