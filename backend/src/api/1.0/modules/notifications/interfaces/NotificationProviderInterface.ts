import { Id } from "../../common/identifier";
import { NotificationDbRow } from "../../db/schema";
import { NotificationType } from '../types'

export interface NotificationProviderInterface {

  getSentDueDateRemindersForTasks(
    taskIds: Id[],
    between: Date,
    and: Date,
  ): PromiseLike<NotificationDbRow[]>

  getNotification(notificationId: Id): PromiseLike<NotificationDbRow>

  getUserInOrganizationNotifications(userId: Id, organizationId: Id, limit: number, notificationTypesToArchive?: NotificationType[]): PromiseLike<Id[]>

  archiveNotifications(notificationIds: Id[]): PromiseLike<void>
}
