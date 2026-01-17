import { Id } from '../../common/identifier'
import {
  ActivityDbRow,
  FileDbRow,
  MessageDbRow,
  NotificationDbRow,
  ProjectDbRow,
  TaskDbRow,
  UserDbRow
} from '../../db/schema';


export interface NotificationFactoryInterface
{
  /**
   *
   * @param {Id} id
   * @param {Id} userId
   * @param {Id} projectId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserInvitedToProject(
    userId: Id,
    projectId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} id
   * @param {Id} userId
   * @param {Id} projectId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserRemovedFromProject(
    userId: Id,
    projectId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} projectId
   * @param {ActivityDbRow} activity
   * @return {Array<NotificationDbRow>}
   */
  createNotificationProjectUpdated(
    projectId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} taskId
   * @param {ActivityDbRow} activity
   * @return {Array<NotificationDbRow>}
   */
  createNotificationTaskCreated(
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} taskId
   * @param {ActivityDbRow} activity
   * @param recipientIds
   * @return {Array<NotificationDbRow>}
   */
  createNotificationTaskUpdated(
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} taskId
   * @param {Id} userId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserAssignedToTask(
    userId: Id,
    taskId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} taskId
   * @param {Id} userId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserRemovedFromTaskAssignees(
    userId: Id,
    taskId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} checklistItemId
   * @param {Id} userId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserAssignedToChecklistItem(
    userId: Id,
    checklistItemId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} checklistItemId
   * @param {Id} userId
   * @param {ActivityDbRow} activity
   * @return {NotificationRow}
   */
  createNotificationUserRemoveFromChecklistItemAssignees(
    userId: Id,
    checklistItemId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} listId
   * @param {ActivityDbRow} activity
   * @param {Array<Id>} recipientIds
   * @return {Array<NotificationDbRow>}
   */
  createNotificationTaskListCreated(
    listId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} listId
   * @param {ActivityDbRow} activity
   * @param {Array<Id>} recipientIds
   * @return {Array<NotificationDbRow>}
   */
  createNotificationTaskListUpdated(
    listId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} messageId
   * @param {Id} taskId
   * @return {Array<NotificationDbRow>}
   */
  createNotificationTaskMessageSent(
    messageId: Id,
    taskId: Id,
  ): Promise<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} fileId
   * @param {Id} taskId
   * @param {ActivityDbRow} activity
   * @param {Array<Id>} recipientIds
   * @return {Array<NotificationDbRow>}
   */
  createNotificationFileAttachedToTask(
    fileId: Id,
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): PromiseLike<Array<NotificationDbRow>>

  /**
   *
   * @param {Id} messageId
   * @param {ProjectDbRow} project
   * @return {Array<NotificationDbRow>}
   */
  createNotificationConversationMessageSent(messageId: Id, project: ProjectDbRow): Promise<Array<NotificationDbRow>>

  createNotificationFileUploadedInChat(
    message: MessageDbRow,
    file: FileDbRow,
  ) : PromiseLike<NotificationDbRow[]>

  /**
   *
   * @param {Id} messageId
   * @return {Array<NotificationDbRow>}
   */
  createNotificationUserMentioned(messageId: Id): Promise<Array<NotificationDbRow>>

  /**
   * @param {Id} messageId
   * @return {Array<NotificationDbRow>}
   */
  createNotificationHailMentioned(messageId: Id): Promise<Array<NotificationDbRow>>

  createDueDateNotification(
    task: TaskDbRow,
    recipientIds: Id[]
  ): Promise<NotificationDbRow[]>

  createJoinedInvitationNotification(
    inviterId: Id,
    invitedUser: Partial<UserDbRow>,
    organizationId: Id,
    trx?: Transaction,
  ): Promise<NotificationDbRow>
}
