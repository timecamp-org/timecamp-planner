import { Request, Response } from 'express';

import {
  CreateUserResultStatus,
  DeleteUserAvatarStatus,
  UpdateUserPasswordResultStatus,
  UpdateUserResultStatus,
} from '../modules/users/types';

import { HttpStatus } from '../../../infrastructure/enum';

import { CustomFieldTargetType, ChatNotificationSettingsDbRow } from '../modules/db/schema';
import { GetCustomFieldValueStatus } from '../modules/extensions/types';
import {
  ChatNotificationSettingsResultStatus,
  UserOrganizationNotificationsResourceQueryParams,
} from '../modules/notifications/types';
import { CreateUserFromTokenResultStatus } from '../modules/openId/types';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { Cookie, EntityStatus } from '../modules/common/enum';
import { GetUserLatestVisitedTasksStatus } from '../modules/tasks/types';
import { injectable, inject } from 'inversify';
import { AuthenticationServiceInterface } from '../modules/authentication/AuthenticationServiceInterface';
import { CustomFieldServiceInterface } from '../modules/extensions/interfaces/CustomFieldServiceInterface';
import { ExtensionsModule } from '../modules/extensions/ExtensionsModule';
import { AuthenticationModule } from '../modules/authentication/AuthenticationModule';
import { NotificationServiceInterface } from '../modules/notifications/interfaces/NotificationServiceInterface';
import { NotificationsModule } from '../modules/notifications/NotificationsModule';
import { NotificationSettingsServiceInterface } from '../modules/notifications/interfaces/NotificationSettingsServiceInterface';
import { OpenIdServiceInterface } from '../modules/openId/OpenIdServiceInterface';
import { OpenIdModule } from '../modules/openId/OpenIdModule';
import { OrganizationServiceInterface } from '../modules/organizations/interfaces/OrganizationServiceInterface';
import { OrganizationsModule } from '../modules/organizations/OrganizationsModule';
import { TaskServiceInterface } from '../modules/tasks/interfaces/TaskServiceInterface';
import { TasksModule } from '../modules/tasks/TasksModule';
import { UsersModule } from '../modules/users/UsersModule';
import { UserServiceInterface } from '../modules/users/UserServiceInterface';
import { InternalModule } from '../modules/internal/InternalModule';
import { InternalServiceInterface } from '../modules/internal/InternalServiceInterface';
import { GetUserInitialDataStatus } from '../modules/internal/types';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../infrastructure/logger';
import { MessageQueueModule } from '../modules/messageQueue/MessageQueueModule';
import { JobStatusServiceInterface } from '../modules/messageQueue/interfaces/JobStatusServiceInterface';
import { NotificationCenterType } from '../modules/dict/types';
import { AppleAuthServiceInterface } from '../modules/authentication/apple/AppleAuthServiceInterface';
import { CreateUserFromAppleTokenStatus } from '../modules/authentication/types';
import { configureCookie } from '../modules/authentication/helpers';

@injectable()
export class UserController {
  constructor(
    @inject(AuthenticationModule.AuthenticationServiceInterface)
    private authenticationService: AuthenticationServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    private customFieldService: CustomFieldServiceInterface,
    @inject(NotificationsModule.NotificationServiceInterface)
    private notificationService: NotificationServiceInterface,
    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private notificationSettingsService: NotificationSettingsServiceInterface,
    @inject(OpenIdModule.OpenIdServiceInterface)
    private openIdService: OpenIdServiceInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(InternalModule.InternalServiceInterface)
    private internalService: InternalServiceInterface,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    private jobStatusService: JobStatusServiceInterface,
    @inject(AuthenticationModule.AppleAuthServiceInterface)
    private appleAuthService: AppleAuthServiceInterface
  ) {}

  public async createUserAction(req: Request, res: Response) {
    try {
      const userJson = { ...req.body, ipAddress: req.clientIp || null };
      const userCreateResult = await this.userService.createUser(req.params.userId, userJson);

      switch (userCreateResult.status) {
        case CreateUserResultStatus.OK:
          break;
        case CreateUserResultStatus.EMAIL_TAKEN:
          return res.send(ErrorDefinitions[Type.EMAIL_ALREADY_IN_USE]);
        case CreateUserResultStatus.PASSWORD_TOO_SHORT:
          return res.send(ErrorDefinitions[Type.VALIDATION_FAILED]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

      const token = this.authenticationService.getUserToken(
        // TODO CR a nie createUT?
        userCreateResult.user.id,
        req.originalUrl
      );

      if (!(userCreateResult && token)) {
        return res.send(ErrorDefinitions[Type.INTERNAL]);
      } else {
        return res
          .cookie(Cookie.AUTH_TOKEN, token.tokenString, configureCookie(token.expiresAt))
          .status(HttpStatus.CREATED)
          .send(userCreateResult.user);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createOpenIdUserAction(req: Request, res: Response) {
    try {
      const userCreateResult = await this.openIdService.createUserFromToken(
        req.params.userId,
        req.body.token,
        req.clientIp || null
      );

      switch (userCreateResult.status) {
        case CreateUserFromTokenResultStatus.OK:
          break;
        case CreateUserFromTokenResultStatus.EMAIL_TAKEN:
          return res.send(ErrorDefinitions[Type.EMAIL_ALREADY_IN_USE]);
        case CreateUserFromTokenResultStatus.INVALID_ID_TOKEN:
          return res.send(ErrorDefinitions[Type.INVALID_AUTH_TOKEN]);
        case CreateUserFromTokenResultStatus.OPENID_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
      const token = this.authenticationService.getUserToken(userCreateResult.user.id, req.originalUrl);

      if (!(userCreateResult && token)) {
        return res.send(ErrorDefinitions[Type.INTERNAL]);
      } else {
        return res
          .cookie(Cookie.AUTH_TOKEN, token.tokenString, configureCookie(token.expiresAt))
          .status(HttpStatus.CREATED)
          .send(userCreateResult.user);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createAppleUserAction(req: Request, res: Response) {
    try {
      const { token, firstName, lastName } = req.body;
      const userCreateResult = await this.appleAuthService.createUserFromToken(
        req.params.userId,
        token,
        firstName,
        lastName,
        req.clientIp || null
      );

      switch (userCreateResult.status) {
        case CreateUserFromAppleTokenStatus.OK:
          break;
        case CreateUserFromAppleTokenStatus.EMAIL_TAKEN:
          return res.send(ErrorDefinitions[Type.EMAIL_ALREADY_IN_USE]);
        case CreateUserFromAppleTokenStatus.INVALID_ID_TOKEN:
          return res.send(ErrorDefinitions[Type.INVALID_AUTH_TOKEN]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
      const userToken = this.authenticationService.getUserToken(userCreateResult.user.id, req.originalUrl);

      if (!(userCreateResult && userToken)) {
        return res.send(ErrorDefinitions[Type.INTERNAL]);
      } else {
        return res
          .cookie(Cookie.AUTH_TOKEN, userToken.tokenString, configureCookie(userToken.expiresAt))
          .status(HttpStatus.CREATED)
          .send(userCreateResult.user);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserOrganizationsAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const organizations = await this.organizationService.getOrganizationsForUser(userId);
      const organizationIds = organizations.map((organization) => organization.id);
      const organizationsCustomFieldsResult = await this.customFieldService.getValuesForTargetIds(
        CustomFieldTargetType.ORGANIZATION,
        organizationIds
      );

      switch (organizationsCustomFieldsResult.status) {
        case GetCustomFieldValueStatus.OK:
          return res.status(HttpStatus.OK).send({
            organizations,
            organizationsCustomFields: organizationsCustomFieldsResult.values,
          });
        case GetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserOrganizationRolesAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const userOrganizationRoles = await this.organizationService.getOrganizationRolesForUser(userId);

      return res.status(HttpStatus.OK).send(userOrganizationRoles);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getSelfAction(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.heyspace.authResult.userId);
      if (user) {
        return res.status(HttpStatus.OK).send(this.userService.getPublicUserData(user));
      } else {
        return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateSelfAction(req: Request, res: Response) {
    try {
      const updateUserResult = await this.userService.updateUser(req.heyspace.authResult.userId, req.body);

      switch (updateUserResult.status) {
        case UpdateUserResultStatus.OK:
          return res.status(HttpStatus.OK).send();
        case UpdateUserResultStatus.RESOURCE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteSelfAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const deleteUserResult = await this.userService.deleteUser(userId);

      switch (deleteUserResult.status) {
        case UpdateUserResultStatus.OK: {
          await this.openIdService.deleteOAuthBindings(userId);
          return res.status(HttpStatus.OK).send();
        }
        case UpdateUserResultStatus.RESOURCE_NOT_FOUND: {
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        }
        default: {
          return res.send(ErrorDefinitions[Type.INTERNAL]);
        }
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserLatestVisitedTasks(req: Request, res: Response) {
    try {
      const result = await this.taskService.getUserLatestVisitedTasks(
        req.heyspace.authResult.userId,
        req.params.organizationId,
        parseInt(req.query.count as string)
      );

      switch (result.status) {
        case GetUserLatestVisitedTasksStatus.OK:
          return res.send(result.data);
        case GetUserLatestVisitedTasksStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case GetUserLatestVisitedTasksStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserInitialData(req: Request, res: Response) {
    try {
      const { projectId } = req.query;
      const result = await this.internalService.getUserInitialData(
        req.heyspace.authResult.userId,
        req.params.localOrganizationId,
        projectId as string
      );

      switch (result.status) {
        case GetUserInitialDataStatus.OK:
          return res.send(result);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updatePasswordAction(req: Request, res: Response) {
    try {
      const updateUserResult = await this.userService.changeUserPassword(
        req.heyspace.authResult.userId,
        req.body.currentPassword,
        req.body.newPassword
      );

      switch (updateUserResult.status) {
        case UpdateUserPasswordResultStatus.OK:
          return res.status(HttpStatus.OK).send({ userEmail: updateUserResult.userEmail });
        case UpdateUserPasswordResultStatus.PASSWORD_DOESNT_MATCH:
          return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
        case UpdateUserPasswordResultStatus.PASSWORD_TOO_SHORT:
          return res.send(ErrorDefinitions[Type.VALIDATION_FAILED]);
        case UpdateUserPasswordResultStatus.RESOURCE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updatePasswordByTokenAction(req: Request, res: Response) {
    try {
      const updateUserResult = await this.userService.changeUserPasswordForToken(req.body.token, req.body.password);

      switch (updateUserResult.status) {
        case UpdateUserPasswordResultStatus.OK:
          return res.status(HttpStatus.OK).send({ userEmail: updateUserResult.userEmail });
        case UpdateUserPasswordResultStatus.PASSWORD_DOESNT_MATCH:
          return res.send(ErrorDefinitions[Type.UNAUTHORIZED]);
        case UpdateUserPasswordResultStatus.PASSWORD_TOO_SHORT:
          return res.send(ErrorDefinitions[Type.VALIDATION_FAILED]);
        case UpdateUserPasswordResultStatus.RESOURCE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getNotificationsByOrganizationAction(req: Request, res: Response) {
    try {
      const result = await this.notificationService.getFilteredNotificationsForUserInOrganization(
        req.heyspace.authResult.userId,
        req.params.organizationId,
        req.query as unknown as UserOrganizationNotificationsResourceQueryParams
      );
      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUnreadNotificationsByOrganizationAction(req: Request, res: Response) {
    try {
      const unreadNotifications = await this.notificationService.getUnreadNotificationsForUserInOrganization(
        req.heyspace.authResult.userId,
        req.params.organizationId
      );
      return res.status(HttpStatus.OK).send(unreadNotifications);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getAllUnreadNotificationsAction(req: Request, res: Response) {
    try {
      const unreadNotifications = await this.notificationService.getAllUnreadNotifications(
        req.heyspace.authResult.userId
      );
      return res.status(HttpStatus.OK).send(unreadNotifications);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateUnreadNotificationsByOrganizationAction(req: Request, res: Response) {
    try {
      await this.notificationService.readUnreadNotificationsForUserInOrganization(
        req.heyspace.authResult.userId,
        req.params.organizationId,
        req.body.readAt,
        req.body.notificationTypes
      );
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateUnreadNotificationsByContainerAction(req: Request, res: Response) {
    try {
      await this.notificationService.readUserUnreadNotificationsForObjects(
        [req.params.containerId],
        req.heyspace.authResult.userId,
        req.body.readAt
      );
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async resetPasswordAction(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);
      if (user && user.status === EntityStatus.EXISTS) {
        await this.userService.sendPasswordResetLink(user);
      } else {
        return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
      }
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async checkEmailExistsAction(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserByEmail(req.params.email);
      if (user) {
        return res.send(ErrorDefinitions[Type.EMAIL_ALREADY_IN_USE]);
      } else {
        return res.status(HttpStatus.OK).send();
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addPushDeviceAction(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      const { deviceType } = req.body;
      await this.notificationService.addPushNotificationDevice(req.heyspace.authResult.userId, deviceId, deviceType);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deletePushDeviceAction(req: Request, res: Response) {
    try {
      await this.notificationService.removePushNotificationDevice(req.heyspace.authResult.userId, req.params.deviceId);
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getNotificationDeliverySettingsAction(req: Request, res: Response) {
    try {
      const deliverySettings = await this.notificationSettingsService.getNotificationsDeliverySettings(
        req.heyspace.authResult.userId,
        req.params.organizationId
      );
      return res.status(HttpStatus.OK).send(deliverySettings);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateNotificationDeliverySettingsAction(req: Request, res: Response) {
    try {
      await this.notificationSettingsService.updateNotificationsDeliverySettings(
        req.heyspace.authResult.userId,
        req.params.organizationId,
        req.body
      );
      return res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateChatNotificationSettingsType(req: Request, res: Response) {
    try {
      const result = await this.notificationSettingsService.updateChatNotificationSettingsType(
        req.heyspace.authResult.userId,
        req.params.projectId,
        req.body.chatNotificationSettingsType
      );

      switch (result.status) {
        case ChatNotificationSettingsResultStatus.OK:
          return res.status(HttpStatus.OK).send();
        case ChatNotificationSettingsResultStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case ChatNotificationSettingsResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserChatNotificationSettingsTypes(req: Request, res: Response) {
    try {
      const chatNotificationSettingsTypes: ChatNotificationSettingsDbRow[] =
        await this.notificationSettingsService.getUserChatNotificationSettingsTypes(req.heyspace.authResult.userId);
      return res.status(HttpStatus.OK).send(chatNotificationSettingsTypes);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteUserAvatarAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.userService.deleteUserAvatar(userId);

      switch (result.status) {
        case DeleteUserAvatarStatus.OK:
          return res.status(HttpStatus.OK).send();
        case DeleteUserAvatarStatus.AVATAR_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND]);
        case DeleteUserAvatarStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserOrganizationSubscriptions(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const subscriptions = await this.userService.getUserOrganizationSubscriptions(userId);
      return res.send(subscriptions);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserInOrganizationJobStatuses(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { organizationId } = req.params;
      const jobStatuses = await this.jobStatusService.getUserInOrganizationJobStatuses(userId, organizationId);
      return res.send(jobStatuses);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserInOrganizationLatestNotificationsDisplay(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { organizationId } = req.params;
      const { notificationCenterType } = req.query as unknown as { notificationCenterType: string };

      // TODO: add/enable express middleware for parsing arrays in queryParams
      const notificationCenterTypes = notificationCenterType.split(',') as NotificationCenterType[];

      const result = await this.notificationService.getUserInOrganizationLatestNotificationsDisplay(
        userId,
        organizationId,
        notificationCenterTypes
      );
      return res.send(result);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserLatestAllNotificationsDisplay(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { notificationCenterType } = req.query as unknown as { notificationCenterType: string };

      // TODO: add/enable express middleware for parsing arrays in queryParams
      const notificationCenterTypes = notificationCenterType.split(',') as NotificationCenterType[];

      const result = await this.notificationService.getUserLatestAllNotificationsDisplay(
        userId,
        notificationCenterTypes
      );
      return res.send(result);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async saveUserInOrganizationLatestNotificationDisplay(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { organizationId } = req.params;
      const { notificationCenterType, lastDisplayTime } = req.body;

      const result = await this.notificationService.saveUserInOrganizationLatestNotificationDisplay(
        userId,
        organizationId,
        notificationCenterType as NotificationCenterType,
        lastDisplayTime
      );

      return res.send(result);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
