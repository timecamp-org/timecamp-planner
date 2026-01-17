import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { HttpStatus } from '../../../infrastructure/enum'

import logger from '../../../infrastructure/logger';
import { ReadNotificationResultStatus } from '../modules/notifications/types';
import { injectable, inject } from 'inversify';
import { NotificationsModule } from '../modules/notifications/NotificationsModule';
import { NotificationServiceInterface } from '../modules/notifications/interfaces/NotificationServiceInterface';
import { Request, Response } from 'express';

@injectable()
export class NotificationController {

  constructor(
    @inject(NotificationsModule.NotificationServiceInterface)
    private notificationService: NotificationServiceInterface,
  ) {
  }

  async updateNotificationAction(req: Request, res: Response) {
    try {
      const readNotificationResult = await this.notificationService.updateNotification(req.params.notificationId, req.body.readAt, req.body.isArchived);
      if (readNotificationResult.status === ReadNotificationResultStatus.RESOURCE_NOT_EXIST) {
        res.send(ErrorDefinitions[Type.NOTIFICATION_NOT_FOUND]);
        return;
      }
      return res.status(HttpStatus.OK).send()
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async archiveUserInOrganizationNotificationsAction(req: Request, res: Response) {
    try {
      await this.notificationService.archiveUserInOrganizationNotifications(req.heyspace.authResult.userId, req.params.organizationId, req.body.notificationTypesToArchive)
      return res.status(HttpStatus.OK).send()
    } catch (error) {
      logger(error)
      return res.status(HttpStatus.OK).send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

}
