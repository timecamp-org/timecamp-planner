import { NotificationType } from '../../models/domain/NotificationsModel/types'
import { NotificationExternalData } from '../../models/domain/NotificationsModel/models';

export interface NotificationLinkData {
  notificationType: NotificationType
  notificationData: NotificationExternalData,
}