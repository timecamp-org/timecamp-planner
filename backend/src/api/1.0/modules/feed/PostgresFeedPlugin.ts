import { LoggerInterface } from '../../../../infrastructure/logger';
import { Notification } from 'pg';
import Table from '../db/Table';
import {
  ActivityChangedPropDbRow,
  ActivityContainerProjectDbRow,
  ActivityContainerTaskDbRow,
  ActivityDbRow,
  ActivityTargetProjectDbRow,
  ActivityTargetTaskDbRow,
  ActivityTargetTaskListDbRow,
  ActivityType,
  AppDbRow,
  ChecklistItemDbRow,
  ContainerType,
  CustomFieldDbRow,
  CustomFieldTargetType,
  CustomFieldValueDbRow,
  DeviceType,
  DictDbRow,
  FileDbRow,
  GuestInProjectFullDbRow,
  IntegrationDbRow,
  JobStatusDbRow,
  ListDbRow,
  MessageContainerType,
  MessageDbRow,
  MessageFileDbRow,
  MessageReactionDbRow,
  OAuthClientDbRow,
  OrganizationDbRow,
  OrganizationRole,
  PaymentDbRow,
  ProjectDbRow,
  ProjectKeyPressDbRow,
  ProjectMessageReadDbRow,
  PublicUserDbRow,
  SubscriptionCancellationInOrganizationDbRow,
  SubscriptionInOrganizationDbRow,
  SubscriptionPlanDbRow,
  TagDbRow,
  TargetType,
  TaskDbRow,
  TaskKeyPressDbRow,
  TaskMessageReadDbRow,
  TaskRecurrenceDependencyDbRow,
  TaskRecurrenceSettingsDbRow,
  UserFollowsTaskDbRow,
  UserInOrganizationDbRow,
  UserInProjectDbRow,
  UserInTaskDbRow,
  UserStatusDbRow,
} from '../db/schema';
import { Id } from '../common/identifier';
import {
  Broadcast,
  BroadcastRecipients,
  EntityDiffMessage,
  FeedMessage,
  FeedMessageType,
  NewNotification,
  PushNotificationMessage,
  PutEntityMessage,
} from './types';
import { EntityStatus, EntityType } from '../common/enum';

import PostgresListenerPlugin from '../../../../infrastructure/PostgresListenerPlugin';
import { NEW_NOTIFICATION } from '../../../../infrastructure/types';
import { parseDateToEpochInMS } from '../../../../infrastructure/utils';
import { parseNotificationIds } from '../db/utils';
import { Type } from '../common/ErrorDefinitions';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { inject, injectable } from 'inversify';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TaskChangedProps } from '../tasks/types';
import { NotificationSettingsServiceInterface } from '../notifications/interfaces/NotificationSettingsServiceInterface';
import { NotificationsModule } from '../notifications/NotificationsModule';
import { ExtensionsModule } from '../extensions/ExtensionsModule';
import { NotificationRendererInterface } from '../notifications/interfaces/NotificationRendererInterface';
import {
  NotificationType,
  PushNotificationContent,
} from '../notifications/types';
import { MessageContainerServiceInterface } from '../messages/interfaces/MessageContainerServiceInterface';
import {
  MessageContainer,
  MessageWithContainerStatus,
} from '../messages/types';
import { MessagesModule } from '../messages/MessagesModule';
import { groupBy, isEmpty, keyBy, pullAllBy, union, uniq } from 'lodash';
import { FeedServiceInterface } from './interfaces/FeedServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { CommonModule } from '../common/CommonModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { ActivityProviderInterface } from '../activities/interfaces/ActivityProviderInterface';
import { MessageServiceInterface } from '../messages/interfaces/MessageServiceInterface';
import { NotificationServiceInterface } from '../notifications/interfaces/NotificationServiceInterface';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UsersModule } from '../users/UsersModule';
import { ExtensionServiceInterface } from '../extensions/interfaces/ExtensionServiceInterface';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { ProjectTasksServiceInterface } from '../projects/interfaces/ProjectTasksServiceInterface';
import { ProcessMessage, ProcessType } from '../processManager/types';
import { OnlineStatusModule } from '../onlineStatus/OnlineStatusModule';
import { UserSessionServiceInterface } from '../onlineStatus/UserSessionServiceInterface';
import { CustomFieldName, ExtensionNamespace } from '../extensions/types';
import { NotificationAction, NotificationPayload } from '../db/types';
import { UserAppsDataProviderInterface } from '../userApps/interfaces/UserAppsDataProviderInterface';
import { UserAppsModule } from '../userApps/UserAppsModule';
import { JobNamespace } from '../messageQueue/types';
import { IntegrationModule } from '../integration/IntegrationModule';
import { IntegrationProviderInterface } from '../integration/interfaces/IntegrationProviderInterface';
import { IntegrationStatus } from '../integration/types';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { AbstractFeedServicePlugin } from './AbstractFeedServicePlugin';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';
import { UserInProjectProviderInterface } from '../projects/interfaces/UserInProjectProviderInterface';
import { GuestInProjectProviderInterface } from '../projects/interfaces/GuestInProjectProviderInterface';
import { UserEntityBody } from '../users/types';
import {
  onlyGuestUsersQueryModifier,
  onlyOwnerAndAdminsQueryModifier,
} from '../organizations/queryDecorators';
import { AppPlatform } from '../dict/types';
import { ChatWithMeModule } from '../chatWithMe/ChatWithMeModule';
import { ChatWithMeCustomFieldsProviderInterface } from '../chatWithMe/interfaces/ChatWithMeCustomFieldsProviderInterface';
import { UserInOrganizationServiceInterface } from '../organizations/interfaces/UserInOrganizationServiceInterface';
import { ProjectPersonalStructureModule } from '../projectPersonalStructure/ProjectPersonalStructureModule';
import { PersonalProjectOrderProviderInterface } from '../projectPersonalStructure/interfaces/PersonalProjectOrderProviderInterface';
import { ProjectInGroupProviderInterface } from '../projectPersonalStructure/interfaces/ProjectInGroupProviderInterface';
import { PersonalProjectGroupProviderInterface } from '../projectPersonalStructure/interfaces/PersonalProjectGroupProviderInterface';
import { TagServiceInterface } from '../tags/TagServiceInterface';
import { TagsModule } from '../tags/TagsModule';

const privateCustomFieldNames: CustomFieldName[] = ['syncToken', 'inviteToken'];

/**
 * Subscribes to Postgres' feed and prepares broadcasts to be sent through
 * FeedServer.
 * Examples of messages:
 *  - new message
 *  - new ip-app notification
 *  - entity updated
 */
@injectable()
export class PostgresFeedPlugin extends AbstractFeedServicePlugin {
  private feedService: FeedServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(InfrastructureModule.PostgresListener)
    private postgresListener: PostgresListenerPlugin,
    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private notificationSettingsService: NotificationSettingsServiceInterface,
    @inject(MessagesModule.MessageContainerServiceInterface)
    private messageContainerService: MessageContainerServiceInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface)
    private extensionService: ExtensionServiceInterface,
    @inject(NotificationsModule.NotificationRendererInterface)
    private pushNotificationRenderer: NotificationRendererInterface<PushNotificationContent>,
    @inject(CommonModule.JsonSerializerInterface)
    private jsonSerializer: JsonSerializerInterface,
    @inject(ActivitiesModule.ActivityProviderInterface)
    private activityProvider: ActivityProviderInterface,
    @inject(MessagesModule.MessageServiceInterface)
    private messageService: MessageServiceInterface,
    @inject(NotificationsModule.NotificationServiceInterface)
    private notificationService: NotificationServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ChatWithMeModule.ChatWithMeCustomFieldsProviderInterface)
    private chatWithMeCustomFieldsProvider: ChatWithMeCustomFieldsProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectTasksServiceInterface)
    private projectTasksService: ProjectTasksServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(OnlineStatusModule.UserSessionServiceInterface)
    private userSessionService: UserSessionServiceInterface,
    @inject(UserAppsModule.UserAppsDataProviderInterface)
    private userAppsDataProvider: UserAppsDataProviderInterface,
    @inject(IntegrationModule.IntegrationProviderInterface)
    private integrationProvider: IntegrationProviderInterface,
    @inject(ProjectsModule.GuestInProjectProviderInterface)
    private guestInProjectProvider: GuestInProjectProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(
      ProjectPersonalStructureModule.PersonalProjectOrderProviderInterface
    )
    private personalProjectOrderProvider: PersonalProjectOrderProviderInterface,
    @inject(
      ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface
    )
    private personalProjectGroupProvider: PersonalProjectGroupProviderInterface,
    @inject(ProjectPersonalStructureModule.ProjectInGroupProviderInterface)
    private projectInGroupProvider: ProjectInGroupProviderInterface,
    @inject(TagsModule.TagServiceInterface)
    private tagService: TagServiceInterface
  ) {
    super();
  }

  /**
   * Main handler for Posgtres notifications from LISTEN.
   *
   * @param {Notification} notification
   * @return {Promise<void>}
   */
  protected async handleNotification(notification: Notification) {
    try {
      const payload: NotificationPayload = this.jsonSerializer.fromJson(
        notification.payload
      );
      if (!payload) {
        this.logger.error(
          `Unknown payload in pg notification: ${notification.payload}`
        );
        return;
      }

      const entityMessage: PutEntityMessage = {
        entityId: payload.id,
        optionalId: payload.optionalId,
        type: FeedMessageType.ENTITY,
      };

      switch (payload.action) {
        case NotificationAction.INSERT:
          entityMessage.operation = NotificationAction.INSERT;
          if (
            payload.table === Table.ACTIVITY_CONTAINER_TASK ||
            payload.table === Table.ACTIVITY_CONTAINER_PROJECT
          ) {
            const entityDiffMessage: EntityDiffMessage = {
              entityId: payload.id,
              optionalId: payload.optionalId,
              type: FeedMessageType.ENTITY_DIFF,
              operation: NotificationAction.INSERT,
            };
            await this.handleEntityDiff(payload.table, entityDiffMessage);
          } else if (payload.table === Table.NOTIFICATION_IN_APP) {
            // New notification for specific user
            await this.handleInAppNotification(entityMessage);
          } else if (payload.table === Table.NOTIFICATION_PUSH) {
            // New push notification for specific user
            await this.handlePushNotification(entityMessage);
          } else {
            // All remaining tables are handles as other notification:
            await this.handleEntity(payload.table, entityMessage);
          }
          break;

        case NotificationAction.UPDATE:
          // Updates are only applicable to normal business entities (not notifications)
          entityMessage.operation = NotificationAction.UPDATE;
          await this.handleEntity(payload.table, entityMessage);
          break;

        case NotificationAction.DELETE:
          entityMessage.operation = NotificationAction.DELETE;
          await this.handleEntity(payload.table, entityMessage);
          break;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Pushes push notification to the user that is notification's recipient.
   *
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  protected async handlePushNotification(entityMessage: PutEntityMessage) {
    const notificationData = await this.notificationService.getPushNotification(
      entityMessage.entityId
    );

    const { notification, pushNotification } = notificationData;
    if (!pushNotification || !notification) {
      // No rows in db. Should not happen, but we cannot proceed

      this.logger.warn(
        `Push notification handler cannot proceed. Missing notification or in-app-notification: ${this.jsonSerializer.toJson(
          pushNotification
        )}`
      );
      return;
    }

    const { notificationType, data, actorId } = notification;

    this.createAndSendPushNotificationBroadcast(
      {
        type: FeedMessageType.PUSH_NOTIFICATION,
        pushNotification:
          await this.pushNotificationRenderer.renderNotification(notification),
        notificationType,
        actorId,
        data,
        organizationId: notification.organizationId,
      },
      [notification.recipientId]
    );
  }

  /**
   * Pushes ip-app notification to the user that is notification's recipient.
   *
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  protected async handleInAppNotification(entityMessage: PutEntityMessage) {
    this.logger.debug(
      `Received in-app notification [${entityMessage.entityId}]`
    );
    const notificationInApp =
      await this.notificationService.getInAppNotification(
        entityMessage.entityId
      );
    const { notification, inAppNotification } = notificationInApp;
    if (!inAppNotification || !notification) {
      // No rows in db. Should not happen, but we cannot proceed

      this.logger.warn(
        `In-app notification handler cannot proceed. Missing notification or in-app-notification: ${this.jsonSerializer.toJson(
          notificationInApp
        )}`
      );
      return;
    }

    if (inAppNotification.isArchived) {
      return; // if we archive all notifications we dont want to send million notifications
    }

    const notificationMessage: NewNotification = {
      type: FeedMessageType.NOTIFICATION,
      notificationId: entityMessage.entityId,
      notification: notification,
      inApp: inAppNotification,
      operation: entityMessage.operation,
    };

    this.createAndSendBroadcast(notificationMessage, [
      notification.recipientId,
    ]);
  }

  /**
   * For now all entities diffs are bradcasted to **ALL** users in specified organization.
   *
   * @param {string} table
   * @param {EntityDiffMessage} entityDiffMessage
   * @return {Promise<void>}
   */
  protected async handleEntityDiff(
    table: string,
    entityDiffMessage: EntityDiffMessage
  ) {
    switch (table) {
      case Table.ACTIVITY_CONTAINER_TASK:
        await this.handleActivityContainerTask(entityDiffMessage);
        break;

      case Table.ACTIVITY_CONTAINER_PROJECT:
        await this.handleActivityContainerProject(entityDiffMessage);
        break;

      default:
        this.logger.info(
          `Ignoring entity diff '${table}' [${entityDiffMessage.entityId}] in broadcast source`
        );
    }
  }

  /**
   * For now all entities are bradcasted to **ALL** users in specified organization.
   *
   * @param {string} table
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  protected async handleEntity(table: string, entityMessage: PutEntityMessage) {
    switch (table) {
      case Table.TASK_LIST:
        await this.handleTaskList(entityMessage);
        break;

      case Table.USER_FOLLOWS_TASK_LIST:
        await this.handleTaskListFollowers(entityMessage);
        break;

      case Table.TASK:
        await this.handleTask(entityMessage);
        break;

      case Table.USER_IN_TASK:
        await this.handleUserInTask(entityMessage);
        break;

      case Table.USER_FOLLOWS_TASK:
        await this.handleTaskFollowers(entityMessage);
        break;

      case Table.PROJECT:
        await this.handleProject(entityMessage);
        break;

      case Table.USER_IN_PROJECT:
        await this.handleProjectPeople(entityMessage);
        break;

      case Table.USER_FOLLOWS_PROJECT:
        await this.handleProjectFollowers(entityMessage);
        break;

      case Table.MESSAGE:
        await this.handleMessage(entityMessage);
        break;

      case Table.USER:
        await this.handleUser(entityMessage);
        break;

      case Table.TAG:
        await this.handleTag(entityMessage);
        break;

      case Table.TASK_HAS_TAG:
        await this.handleTaskHasTag(entityMessage);
        break;

      case Table.FILE:
        await this.handleFile(entityMessage);
        break;

      case Table.TASK_ATTACHMENT:
        await this.handleTaskAttachment(entityMessage);
        break;

      case Table.MESSAGE_FILE:
        await this.handleMessageAttachment(entityMessage);
        break;

      case Table.MESSAGE_REACTION:
        await this.handleMessageReaction(entityMessage);
        break;

      case Table.PROJECT_KEY_PRESS:
        await this.handleProjectKeyPress(entityMessage);
        break;

      case Table.TASK_KEY_PRESS:
        await this.handleTaskKeyPress(entityMessage);
        break;

      case Table.PROJECT_MESSAGE_READ:
        await this.handleProjectMessageRead(entityMessage);
        break;

      case Table.TASK_MESSAGE_READ:
        await this.handleTaskMessageRead(entityMessage);
        break;

      case Table.MESSAGE_CONTAINER_PROJECT:
        await this.handleMessageContainerProject(entityMessage);
        break;

      case Table.MESSAGE_CONTAINER_TASK:
        await this.handleMessageContainerTask(entityMessage);
        break;

      case Table.CHECKLIST_ITEM:
        await this.handleChecklistItem(entityMessage);
        break;

      case Table.USER_IN_CHECKLIST_ITEM:
        await this.handleUserInChecklistItem(entityMessage);
        break;

      case Table.ACTIVITY:
        await this.handleActivity(entityMessage);
        break;

      case Table.USER_IN_ORGANIZATION:
        await this.handleUserInOrganization(entityMessage);
        break;

      case Table.USER_STATUS:
        await this.handleUserStatus(entityMessage);
        break;

      case Table.ORGANIZATION:
        await this.handleOrganization(entityMessage);
        break;

      case Table.CHAT_NOTIFICATION_SETTINGS:
        await this.handleChatNotificationSettings(entityMessage);
        break;

      case Table.NOTIFICATION_IN_APP:
        await this.handleInAppNotification(entityMessage);
        break;

      case Table.EXTENSION_IN_ORGANIZATION:
        await this.handleExtensionInOrganization(entityMessage);
        break;

      case Table.EXTENSION_CUSTOM_FIELD_VALUE:
        await this.handleExtensionCustomFieldValue(entityMessage);
        break;

      case Table.TASK_VOTING_REACTION:
        await this.handleTaskVotingReaction(entityMessage);
        break;

      case Table.TASK_RECURRENCE_SETTINGS:
        await this.handleTaskRecurrenceSettings(entityMessage);
        break;

      case Table.TASK_RECURRENCE_DEPENDENCY:
        await this.handleTaskRecurrenceDependency(entityMessage);
        break;

      case Table.CONVERSATION_SETTINGS:
        await this.handleConversationSettings(entityMessage);
        break;

      case Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION:
        await this.handleSubscriptionInOrganization(entityMessage);
        break;

      case Table.PAYMENTS_PAYMENT:
        await this.handlePayment(entityMessage);
        break;

      case Table.PAYMENTS_SUBSCRIPTION_PLAN:
        await this.handleSubscriptionPlan(entityMessage);
        break;

      case Table.PAYMENTS_SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION:
        await this.handleSubscriptionInOrganizationCancellation(entityMessage);
        break;

      case Table.INTEGRATION:
        await this.handleIntegration(entityMessage);
        break;

      case Table.EXTENSION_APP:
        await this.handleExtensionApp(entityMessage);
        break;

      case Table.EXTENSION_USER_IN_APP:
        await this.handleExtensionUserInApp(entityMessage);
        break;

      case Table.JOBS_JOB_STATUS:
        await this.handleJobStatus(entityMessage);
        break;

      case Table.GUEST_IN_PROJECT:
        await this.handleGuestInProject(entityMessage);
        break;

      case Table.APP_VERSION:
        await this.handleAppVersion(entityMessage);
        break;

      case Table.USER_PROJECT_ORDER:
        await this.handleUserProjectOrder(entityMessage);
        break;

      case Table.USER_PROJECT_GROUP:
        await this.handleUserProjectGroup(entityMessage);
        break;

      case Table.PROJECT_IN_GROUP:
        await this.handleProjectInGroup(entityMessage);
        break;

      default:
        this.logger.info(
          `Ignoring entity '${table}' [${entityMessage.entityId}] in broadcast source`
        );
    }
  }

  /**
   * Broadcasts given user in organization to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleUserInOrganization(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const [userId, organizationId] = this.parseNotificationIds(entityId);

    entityMessage.entityType = EntityType.UserInOrganization;

    let recipientIds = [];
    const organization = await this.getEntity<OrganizationDbRow>(
      Table.ORGANIZATION,
      organizationId
    );
    const userInOrganization =
      await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        organizationId
      );
    const user = await this.userService.getUserById(userId);

    if (userInOrganization.role === OrganizationRole.GUEST) {
      recipientIds = await this.getRecipientsForGuestChange(userInOrganization);
    } else {
      recipientIds = await this.getOrganizationRecipientUserIds(
        organizationId,
        true
      );
    }

    this.createAndSendEntityBroadcast(
      entityMessage,
      {
        userId,
        organizationId,
        organization,
        userInOrganization,
        user,
      },
      recipientIds
    );
  }

  private async getRecipientsForGuestChange(
    userInOrganization: UserInOrganizationDbRow
  ): Promise<Id[]> {
    const { userId, organizationId } = userInOrganization;
    const chatWithMeInviterId =
      await this.chatWithMeCustomFieldsProvider.getInviterId(
        userId,
        organizationId
      );
    const organizationAdminIds =
      await this.userInOrganizationProvider.getOrganizationAdminUserIds(
        organizationId
      );
    const sharedProjectsUserIds =
      await this.userInOrganizationProvider.getMemberUserIdsFromAllProjectsShardedWithUser(
        userId,
        organizationId
      );

    if (chatWithMeInviterId) {
      if (sharedProjectsUserIds.length > 0) {
        return union(organizationAdminIds, sharedProjectsUserIds, [
          chatWithMeInviterId,
        ]);
      } else {
        return union(sharedProjectsUserIds, [chatWithMeInviterId]);
      }
    } else {
      const inviterInOrganization =
        await this.userInOrganizationProvider.getUserInviterInOrganization(
          userId,
          organizationId
        );
      let recipients = union(sharedProjectsUserIds, organizationAdminIds);
      if (inviterInOrganization) {
        recipients = union(recipients, [inviterInOrganization.userId]);
      }
      return recipients;
    }
  }

  /**
   * Broadcasts given user status to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleUserStatus(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const [id, organizationId] = this.parseNotificationIds(entityId);

    entityMessage.entityType = EntityType.userStatus;

    const userIds = await this.getOrganizationRecipientUserIds(
      organizationId,
      true
    );
    const userStatus = await this.getEntity<UserStatusDbRow>(
      Table.USER_STATUS,
      id
    );

    this.createAndSendEntityBroadcast(
      entityMessage,
      userStatus || { id, organizationId },
      userIds
    );
  }

  /**
   * Broadcasts organization to whole all users in organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleOrganization(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;

    entityMessage.entityType = EntityType.Organization;

    const userIds = await this.getOrganizationRecipientUserIds(entityId);
    const organization = await this.getEntity<OrganizationDbRow>(
      Table.ORGANIZATION,
      entityId
    );

    this.createAndSendEntityBroadcast(entityMessage, organization, userIds);
  }

  /**
   * Broadcasts given changes in task to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleActivityContainerProject(
    entityMessage: EntityDiffMessage
  ) {
    const { entityId } = entityMessage;
    const [activityId, projectId] = this.parseNotificationIds(entityId);
    const activity = await this.getEntity<ActivityDbRow>(
      Table.ACTIVITY,
      activityId
    );

    if (activity.type === ActivityType.MODIFY) {
      const result = await this.getEntities<ActivityChangedPropDbRow>(
        Table.ACTIVITY_CHANGED_PROP,
        { activityId }
      );
      const projectData = {
        id: projectId,
      };
      const userIds = await this.getProjectOrganizationRecipientIds(projectId);

      result.forEach(
        (changedProp) =>
          (projectData[changedProp.propertyName] = changedProp.new)
      );

      entityMessage.entityType = EntityType.ProjectChangedProps;

      this.createAndSendEntityDiffBroadcast(
        entityMessage,
        projectData,
        userIds
      );
    }
  }

  /**
   * Broadcasts given changes in project to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleActivityContainerTask(entityMessage: EntityDiffMessage) {
    const { entityId } = entityMessage;
    const [activityId, taskId] = this.parseNotificationIds(entityId);
    const activity = await this.getEntity<ActivityDbRow>(
      Table.ACTIVITY,
      activityId
    );

    if (activity.type === ActivityType.MODIFY) {
      const result = await this.getEntities<ActivityChangedPropDbRow>(
        Table.ACTIVITY_CHANGED_PROP,
        { activityId }
      );
      const task = await this.getEntity<TaskDbRow>(Table.TASK, taskId);
      let taskData: TaskChangedProps = {
        id: taskId,
      };

      let taskAssigneeIds: Array<Id>;
      let taskFollowerIds: Array<Id>;
      const userIds = await this.getTaskRecipientIds(taskId);

      // if projectId has changed -> task was moved, and we send whole task data
      // with assignee and follower ids to recipients who might not have
      // this data at all in the frontend
      if (
        result.some((changedProp) => changedProp.propertyName === 'projectId')
      ) {
        const taskFollowersPromise = this.getEntities<UserFollowsTaskDbRow>(
          Table.USER_FOLLOWS_TASK,
          { taskId }
        );
        const taskAssigneesPromise = this.getEntities<UserInTaskDbRow>(
          Table.USER_IN_TASK,
          { taskId }
        );

        const [taskFollowersDbRow, taskAssigneesDbRow] = await Promise.all([
          taskFollowersPromise,
          taskAssigneesPromise,
        ]);

        taskFollowerIds = taskFollowersDbRow.map(({ userId }) => userId);
        taskAssigneeIds = taskAssigneesDbRow.map(({ userId }) => userId);

        taskData = {
          ...taskData,
          ...task,
        };
      }

      result.forEach(
        (changedProp) => (taskData[changedProp.propertyName] = changedProp.new)
      );

      if (taskData.order && !taskData.taskListId) {
        taskData.taskListId = task.taskListId;
      }

      entityMessage.entityType = EntityType.TaskChangedProps;

      this.createAndSendEntityDiffBroadcast(
        entityMessage,
        {
          ...taskData,
          taskFollowerIds,
          taskAssigneeIds,
        },
        userIds
      );
    }
  }

  /**
   * Broadcasts given user message key press to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleMessageContainerProject(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.DELETE) {
      const [messageId, projectId] = this.parseNotificationIds(entityId);
      const project = await this.getEntity<ProjectDbRow>(
        Table.PROJECT,
        projectId
      );
      const organizationId = project.organizationId;
      const userIds = await this.getOrganizationRecipientUserIds(
        organizationId
      );

      entityMessage.entityType = EntityType.Message;

      this.createAndSendEntityBroadcast(
        entityMessage,
        {
          containerId: projectId,
          containerType: ContainerType.PROJECT,
          messageId,
        },
        userIds
      );
    }
  }

  /**
   * Broadcasts given user message key press to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleMessageContainerTask(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.DELETE) {
      const [messageId, taskId] = this.parseNotificationIds(entityId);

      const project = await this.projectTasksService.getProjectByTaskId(taskId);
      const organizationId = project.organizationId;
      const userIds = await this.getOrganizationRecipientUserIds(
        organizationId
      );

      entityMessage.entityType = EntityType.Message;

      this.createAndSendEntityBroadcast(
        entityMessage,
        {
          containerId: taskId,
          containerType: ContainerType.TASK,
          messageId,
        },
        userIds
      );
    }
  }

  /**
   * Broadcasts given user message key press to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleMessageReaction(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.INSERT) {
      const reaction = await this.getEntity<MessageReactionDbRow>(
        Table.MESSAGE_REACTION,
        entityId
      );
      const message = await this.getEntity<MessageDbRow>(
        Table.MESSAGE,
        reaction.messageId
      );
      const userIds = await this.getOrganizationRecipientUserIds(
        message.organizationId
      );

      entityMessage.entityType = EntityType.MessageReaction;

      this.createAndSendEntityBroadcast(entityMessage, reaction, userIds);
    } else {
      const [id, messageId] = this.parseNotificationIds(entityId);
      const message = await this.getEntity<MessageDbRow>(
        Table.MESSAGE,
        messageId
      );
      const userIds = await this.getOrganizationRecipientUserIds(
        message.organizationId
      );

      entityMessage.entityType = EntityType.MessageReaction;

      this.createAndSendEntityBroadcast(
        entityMessage,
        { id, messageId },
        userIds
      );
    }
  }

  /**
   * Broadcasts given user message key press to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskKeyPress(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.UPDATE) {
      const [taskId, userId] = this.parseNotificationIds(entityId);
      const keyPress = await this.getEntity<TaskKeyPressDbRow>(
        Table.TASK_KEY_PRESS,
        {
          taskId,
          userId,
        }
      );
      const container = await this.messageContainerService.getContainer(
        MessageContainerType.TASK,
        taskId
      );
      const userIds = await this.getMessageRecipientUserIds(container);

      entityMessage.entityType = EntityType.MessageKeyPress;

      const entity = {
        containerId: taskId,
        containerType: ContainerType.TASK,
        timestamp: keyPress.timestamp,
        userId,
      };

      this.createAndSendEntityBroadcast(entityMessage, entity, userIds);
    }
  }

  /**
   * Broadcasts given user message read to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleProjectKeyPress(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.UPDATE) {
      const [projectId, userId] = this.parseNotificationIds(entityId);

      const keyPress = await this.getEntity<ProjectKeyPressDbRow>(
        Table.PROJECT_KEY_PRESS,
        {
          projectId,
          userId,
        }
      );

      const container = await this.messageContainerService.getContainer(
        MessageContainerType.PROJECT,
        projectId
      );
      const userIds = await this.getMessageRecipientUserIds(container);

      entityMessage.entityType = EntityType.MessageKeyPress;

      const entity = {
        containerId: projectId,
        containerType: ContainerType.PROJECT,
        timestamp: keyPress.timestamp,
        userId,
      };

      this.createAndSendEntityBroadcast(entityMessage, entity, userIds);
    }
  }

  /**
   * Broadcasts given user message read to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleProjectMessageRead(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.UPDATE) {
      const [projectId, userId] = this.parseNotificationIds(entityId);

      const messageRead = await this.getEntity<ProjectMessageReadDbRow>(
        Table.PROJECT_MESSAGE_READ,
        {
          projectId,
          userId,
        }
      );
      const message = await this.getEntity<MessageDbRow>(Table.MESSAGE, {
        id: messageRead.messageId,
      });

      const container = await this.messageContainerService.getContainer(
        MessageContainerType.PROJECT,
        projectId
      );
      const userIds = await this.getMessageRecipientUserIds(container);

      entityMessage.entityType = EntityType.MessageRead;

      const entity = {
        containerId: projectId,
        containerType: ContainerType.PROJECT,
        timestamp: messageRead.timestamp,
        messageId: messageRead.messageId,
        userId,
        messageUserId: message ? message.senderId : null,
      };

      this.createAndSendEntityBroadcast(entityMessage, entity, userIds);
    }
  }

  /**
   * Broadcasts given user message read to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskMessageRead(entityMessage: PutEntityMessage) {
    const { entityId, operation } = entityMessage;

    if (operation === NotificationAction.UPDATE) {
      const [taskId, userId] = this.parseNotificationIds(entityId);
      const messageRead = await this.getEntity<TaskMessageReadDbRow>(
        Table.TASK_MESSAGE_READ,
        {
          taskId,
          userId,
        }
      );
      const message = await this.getEntity<MessageDbRow>(Table.MESSAGE, {
        id: messageRead.messageId,
      });

      const container = await this.messageContainerService.getContainer(
        MessageContainerType.TASK,
        taskId
      );
      const userIds = await this.getMessageRecipientUserIds(container);

      entityMessage.entityType = EntityType.MessageRead;

      const entity = {
        containerId: taskId,
        containerType: ContainerType.TASK,
        timestamp: messageRead.timestamp,
        messageId: messageRead.messageId,
        userId,
        messageUserId: message ? message.senderId : null,
      };

      this.createAndSendEntityBroadcast(entityMessage, entity, userIds);
    }
  }

  /**
   * Broadcasts given task list to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskList(entityMessage: PutEntityMessage) {
    const list = await this.getEntity<ListDbRow>(
      Table.TASK_LIST,
      entityMessage.entityId
    );
    const userIds = await this.getTaskListRecipientIds(entityMessage.entityId);
    entityMessage.entityType = EntityType.TaskList;

    this.createAndSendEntityBroadcast(entityMessage, list, userIds);
  }

  /**
   * Broadcasts given task list followers to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskListFollowers(entityMessage: PutEntityMessage) {
    const userIds = await this.getTaskListRecipientIds(entityMessage.entityId);

    entityMessage.entityType = EntityType.TaskListFollower;

    this.createAndSendEntityBroadcast(
      entityMessage,
      { userId: entityMessage.optionalId },
      userIds
    );
  }

  /**
   * Broadcasts given task to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTask(entityMessage: PutEntityMessage) {
    const task = await this.getEntity<TaskDbRow>(
      Table.TASK,
      entityMessage.entityId
    );
    const userIds = await this.getTaskRecipientIds(entityMessage.entityId);
    entityMessage.entityType = EntityType.Task;

    if (entityMessage.operation === NotificationAction.UPDATE) {
      // Send only valuable data to prevent blinking frontend during editing
      this.handleTaskUpdate(task, userIds);
    } else {
      this.createAndSendEntityBroadcast(entityMessage, task, userIds);
    }
  }

  private async handleTaskUpdate(task: TaskDbRow, userIds: Id[]) {
    const entityDiffMessage: EntityDiffMessage = {
      entityId: task.id,
      type: FeedMessageType.ENTITY_DIFF,
      operation: NotificationAction.INSERT,
      entityType: EntityType.TaskChangedProps,
    };
    this.createAndSendEntityDiffBroadcast(
      entityDiffMessage,
      {
        id: task.id,
        taskListId: task.taskListId,
        order: task.order,
      },
      userIds
    );
  }

  private async handleConversationSettings(entityMessage: PutEntityMessage) {
    const [userId, conversationHash, organizationId] = parseNotificationIds(
      entityMessage.entityId
    );
    const conversationSettings =
      await this.conversationService.getConversationSettings(
        userId,
        conversationHash,
        organizationId
      );
    entityMessage.entityType = EntityType.ConversationSettings;

    this.createAndSendEntityBroadcast(entityMessage, conversationSettings, [
      userId,
    ]);

    if (
      entityMessage.operation === NotificationAction.UPDATE &&
      conversationSettings.isVisible
    ) {
      await this.handleConversationVisibilityChange(
        userId,
        organizationId,
        conversationSettings.conversationHash
      );
    }
  }

  private async handleConversationVisibilityChange(
    userId: Id,
    organizationId: Id,
    currentConversationHash: Id
  ) {
    const conversations = await this.conversationService.getUserConversations(
      userId,
      organizationId
    );
    const projectIds = conversations.map((project) => project.id);
    const conversationsPeople =
      await this.userInProjectProvider.getProjectsPeople(projectIds);
    const projectsPeopleMap = groupBy(conversationsPeople, 'projectId');

    let conversationToSend = null;
    let conversationPeopleIds = null;

    conversations.some((conversation) => {
      const projectPeople = projectsPeopleMap[conversation.id];

      if (!projectPeople) {
        return false;
      }
      const peopleIds = projectPeople.map((role) => role.userId);
      const conversationHash =
        this.conversationService.generateConversationHash(
          organizationId,
          peopleIds
        );
      if (conversationHash === currentConversationHash) {
        conversationToSend = conversation;
        conversationPeopleIds = peopleIds;
        return true;
      }

      return false;
    });

    if (conversationToSend) {
      this.broadcastProjectEntity(conversationToSend.id, conversationPeopleIds);
    }
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleUserInTask(entityMessage: PutEntityMessage) {
    const [taskId, userId] = this.parseNotificationIds(entityMessage.entityId);
    let entity;

    if (entityMessage.operation === NotificationAction.DELETE) {
      entity = { userId };
    } else {
      const userInTaskRow = await this.getEntity<UserInTaskDbRow>(
        Table.USER_IN_TASK,
        { taskId, userId }
      );
      entity = { userId, role: userInTaskRow.role };
    }

    const recipientIds = await this.getTaskRecipientIds(taskId);
    entityMessage.entityType = EntityType.TaskPerson;
    entityMessage.entityId = taskId;

    this.createAndSendEntityBroadcast(entityMessage, entity, recipientIds);
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskFollowers(entityMessage: PutEntityMessage) {
    const [taskId, userId] = this.parseNotificationIds(entityMessage.entityId);
    const recipientIds = await this.getTaskRecipientIds(taskId);

    entityMessage.entityType = EntityType.TaskFollower;
    entityMessage.entityId = taskId;

    this.createAndSendEntityBroadcast(entityMessage, { userId }, recipientIds);
  }

  /**
   * Broadcasts given project to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleProject(entityMessage: PutEntityMessage) {
    const project = await this.getEntity<ProjectDbRow>(
      Table.PROJECT,
      entityMessage.entityId
    );
    const userIds = await this.getProjectOrganizationRecipientIds(
      entityMessage.entityId
    );
    entityMessage.entityType = EntityType.Project;

    this.createAndSendEntityBroadcast(entityMessage, project, userIds);
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleProjectPeople(entityMessage: PutEntityMessage) {
    const [projectId, userId] = this.parseNotificationIds(
      entityMessage.entityId
    );
    const projectRow = await this.getEntity<ProjectDbRow>(Table.PROJECT, {
      id: projectId,
    });
    const { organizationId } = projectRow;
    const userInOrganizationRow = await this.getEntity<UserInOrganizationDbRow>(
      Table.USER_IN_ORGANIZATION,
      { userId, organizationId }
    );
    const isUserGuest = userInOrganizationRow.role === OrganizationRole.GUEST;

    let entity;

    entityMessage.entityType = EntityType.ProjectPerson;
    entityMessage.entityId = projectId;

    switch (entityMessage.operation) {
      case NotificationAction.INSERT: {
        await this.broadcastProjectEntity(projectId, [userId]);

        if (isUserGuest) {
          await this.handleNewGuestInProject(
            entityMessage,
            userId,
            organizationId,
            projectId
          );
        } else {
          await this.handleNewUserInProjectWithGuests(
            entityMessage,
            userId,
            organizationId,
            projectId
          );
        }
        const userInProjectRow = await this.getEntity<UserInProjectDbRow>(
          Table.USER_IN_PROJECT,
          { projectId, userId }
        );
        entity = { userId, role: userInProjectRow.role };
        break;
      }
      case NotificationAction.DELETE: {
        entity = { userId };

        if (isUserGuest) {
          await this.handleRemoveGuestFromProject(
            entityMessage,
            projectId,
            userId,
            organizationId
          );
        } else {
          await this.handleRemoveMemberFromProject(
            entityMessage,
            projectId,
            userId,
            organizationId
          );
        }
        break;
      }
      default: {
        const userInProjectRow = await this.getEntity<UserInProjectDbRow>(
          Table.USER_IN_PROJECT,
          { projectId, userId }
        );
        entity = { userId, role: userInProjectRow.role };
        break;
      }
    }

    const projectOrganizationRecipientIds =
      await this.getProjectOrganizationRecipientIds(projectId);
    this.createAndSendEntityBroadcast(
      entityMessage,
      entity,
      projectOrganizationRecipientIds
    );
  }

  private async handleNewGuestInProject(
    entityMessage: PutEntityMessage,
    guestId: Id,
    organizationId: Id,
    projectId: Id
  ): Promise<void> {
    await this.sendGuestToProjectPeople(
      entityMessage,
      guestId,
      organizationId,
      projectId
    );
    await this.sendProjectPeopleToGuest(
      entityMessage,
      guestId,
      organizationId,
      projectId
    );
  }

  private async sendGuestToProjectPeople(
    entityMessage: PutEntityMessage,
    guestId: Id,
    organizationId: Id,
    projectId: Id
  ) {
    const entityBody = await this.createUserEntityBody(organizationId, guestId);

    const projectRecipientIds = await this.getProjectRecipientIds(projectId);
    const guestUserInOrganizationEntityMessage = {
      ...entityMessage,
      entityId: entityBody.userInOrganization.id,
      entityType: EntityType.UserInOrganization,
      operation: NotificationAction.INSERT,
    };
    this.createAndSendEntityBroadcast(
      guestUserInOrganizationEntityMessage,
      entityBody,
      projectRecipientIds
    );
  }

  private async createUserEntityBody(
    organizationId: Id,
    userId: Id,
    user?: PublicUserDbRow,
    userInOrganization?: UserInOrganizationDbRow
  ): Promise<UserEntityBody> {
    const userDbRow =
      user || (await this.userService.getPublicUserDataByUserId(userId));
    const userInOrganizationDbRow =
      userInOrganization ||
      (await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        organizationId
      ));
    return {
      userId,
      organizationId,
      user: userDbRow,
      userInOrganization: userInOrganizationDbRow,
    };
  }

  private async sendProjectPeopleToGuest(
    entityMessage: PutEntityMessage,
    guestId: Id,
    organizationId: Id,
    projectId: Id
  ) {
    const allOrganizationPeopleInProject =
      await this.userInOrganizationProvider.getOrganizationUsersInSpecifiedProjects(
        organizationId,
        [projectId]
      );
    const allUsersInProject =
      await this.userService.getPublicUsersDataByUserIds(
        allOrganizationPeopleInProject.map((userInOrg) => userInOrg.userId)
      );
    const allUsersInProjectMapped = keyBy(allUsersInProject, 'id');

    for (const userInOrganization of allOrganizationPeopleInProject) {
      const currentUserId = userInOrganization.userId;
      const currentUser = allUsersInProjectMapped[currentUserId];
      const userEntityMessage = {
        ...entityMessage,
        entityId: userInOrganization.id,
        entityType: EntityType.UserInOrganization,
        operation: NotificationAction.INSERT,
      };
      const userEntityBody = await this.createUserEntityBody(
        organizationId,
        currentUserId,
        currentUser,
        userInOrganization
      );
      this.createAndSendEntityBroadcast(userEntityMessage, userEntityBody, [
        guestId,
      ]);
    }
  }

  private async handleNewUserInProjectWithGuests(
    entityMessage: PutEntityMessage,
    userId: Id,
    organizationId: Id,
    projectId: Id
  ) {
    const allOrganizationGuestsInProjectEntities =
      await this.userInOrganizationProvider.getOrganizationGuestsForGivenProject(
        organizationId,
        projectId
      );
    const allGuestUsersInProjectEntities =
      await this.userService.getPublicUsersDataByUserIds(
        allOrganizationGuestsInProjectEntities.map(
          (userInOrg) => userInOrg.userId
        )
      );

    const allGuestUsersInProjectEntitiesMapped = keyBy(
      allGuestUsersInProjectEntities,
      'id'
    );

    const userEntityBody = await this.createUserEntityBody(
      organizationId,
      userId
    );
    const userEntityMessage = {
      ...entityMessage,
      entityId: userEntityBody.userInOrganization.id,
      entityType: EntityType.UserInOrganization,
      operation: NotificationAction.INSERT,
    };

    for (const guestInOrganization of allOrganizationGuestsInProjectEntities) {
      const guestUser =
        allGuestUsersInProjectEntitiesMapped[guestInOrganization.userId];
      const guestEntityMessage = {
        ...entityMessage,
        entityId: guestInOrganization.id,
        entityType: EntityType.UserInOrganization,
        operation: NotificationAction.INSERT,
      };
      const guestEntityBody = await this.createUserEntityBody(
        organizationId,
        guestUser.id,
        guestUser,
        guestInOrganization
      );
      this.createAndSendEntityBroadcast(guestEntityMessage, guestEntityBody, [
        userId,
      ]);
      this.createAndSendEntityBroadcast(userEntityMessage, userEntityBody, [
        guestUser.id,
      ]);
    }
  }

  private async handleRemoveGuestFromProject(
    entityMessage: PutEntityMessage,
    projectId: Id,
    guestId: Id,
    organizationId: Id
  ): Promise<void> {
    const usersInOrganizationWithoutAccessToGuest =
      await this.getUsersInOrganizationWithoutAccessToGuest(
        organizationId,
        projectId,
        guestId
      );

    await this.removeUserFromInaccessibleUsersInOrganization(
      entityMessage,
      guestId,
      organizationId,
      usersInOrganizationWithoutAccessToGuest
    );
    this.removeInaccessibleUsersInOrganizationFromUser(
      entityMessage,
      guestId,
      organizationId,
      usersInOrganizationWithoutAccessToGuest
    );
  }

  private async getUsersInOrganizationWithoutAccessToGuest(
    organizationId: Id,
    projectId: Id,
    guestId: Id
  ): Promise<UserInOrganizationDbRow[]> {
    const projectUsersWithoutSharedProjects =
      await this.userInOrganizationProvider.getProjectUsersInOrganizationWithoutSharedProjects(
        guestId,
        projectId,
        organizationId
      );
    const workspaceAdmins =
      await this.userInOrganizationProvider.getOrganizationUsersByOrganizationId(
        organizationId,
        undefined,
        onlyOwnerAndAdminsQueryModifier
      );
    const guestInviter =
      await this.userInOrganizationProvider.getUserInviterInOrganization(
        guestId,
        organizationId
      );
    return pullAllBy(
      projectUsersWithoutSharedProjects,
      [guestInviter, ...workspaceAdmins],
      (u) => u.userId
    );
  }

  private async removeUserFromInaccessibleUsersInOrganization(
    entityMessage: PutEntityMessage,
    userId: Id,
    organizationId: Id,
    usersInOrganizationWithoutAccessToUser: UserInOrganizationDbRow[]
  ) {
    const guestInOrganization =
      await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        organizationId
      );

    const recipientIds = usersInOrganizationWithoutAccessToUser.map(
      (u) => u.userId
    );
    const entityBody = {
      userId,
      organizationId,
    };

    const guestInOrganizationEntityMessage = {
      ...entityMessage,
      operation: NotificationAction.DELETE,
      entityId: guestInOrganization.id,
      entityType: EntityType.UserInOrganization,
    };

    await this.createAndSendEntityBroadcast(
      guestInOrganizationEntityMessage,
      entityBody,
      recipientIds
    );
  }

  private removeInaccessibleUsersInOrganizationFromUser(
    entityMessage: PutEntityMessage,
    userId: Id,
    organizationId: Id,
    usersInOrganizationWithoutAccessToUser: UserInOrganizationDbRow[]
  ) {
    for (const userInOrganization of usersInOrganizationWithoutAccessToUser) {
      const entityBody = {
        userId: userInOrganization.userId,
        organizationId,
      };
      const removedUserEntityMessage = {
        ...entityMessage,
        operation: NotificationAction.DELETE,
        entityId: userInOrganization.id,
        entityType: EntityType.UserInOrganization,
      };
      this.createAndSendEntityBroadcast(removedUserEntityMessage, entityBody, [
        userId,
      ]);
    }
  }

  private async handleRemoveMemberFromProject(
    entityMessage: PutEntityMessage,
    projectId: Id,
    userId: Id,
    organizationId: Id
  ): Promise<void> {
    const isProjectWithNoGuests = isEmpty(
      await this.guestInProjectProvider.getProjectGuestIds(projectId)
    );
    if (isProjectWithNoGuests) {
      return;
    }

    const guestsInOrganizationWithoutAccessToUser =
      await this.getGuestsInOrganizationWithoutAccessToUser(
        organizationId,
        projectId,
        userId
      );

    if (isEmpty(guestsInOrganizationWithoutAccessToUser)) {
      return;
    }

    await this.removeUserFromInaccessibleUsersInOrganization(
      entityMessage,
      userId,
      organizationId,
      guestsInOrganizationWithoutAccessToUser
    );

    this.removeInaccessibleUsersInOrganizationFromUser(
      entityMessage,
      userId,
      organizationId,
      guestsInOrganizationWithoutAccessToUser
    );
  }

  private async getGuestsInOrganizationWithoutAccessToUser(
    organizationId: Id,
    projectId: Id,
    userId: Id
  ): Promise<UserInOrganizationDbRow[]> {
    const { userIsOrganizationAdmin: isUserAdmin } =
      await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(
        userId,
        organizationId
      );
    if (isUserAdmin) {
      return [];
    }
    const projectGuestsWithoutSharedProjects =
      await this.userInOrganizationProvider.getProjectUsersInOrganizationWithoutSharedProjects(
        userId,
        projectId,
        organizationId,
        onlyGuestUsersQueryModifier
      );

    const guestsInvitedByUser =
      await this.userInOrganizationProvider.getGuestsInvitedByUser(
        userId,
        organizationId
      );
    return pullAllBy(
      projectGuestsWithoutSharedProjects,
      guestsInvitedByUser,
      (u) => u.userId
    );
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleGuestInProject(entityMessage: PutEntityMessage) {
    const [id, organizationId] = this.parseNotificationIds(
      entityMessage.entityId
    );
    let entity: Partial<GuestInProjectFullDbRow>;

    if (entityMessage.operation === NotificationAction.DELETE) {
      entity = { id, organizationId };
    } else {
      entity = await this.guestInProjectProvider.getGuestInProjectById(id);
    }

    entityMessage.entityType = EntityType.GuestInProject;
    entityMessage.entityId = id;

    const recipientIds = await this.getOrganizationRecipientUserIds(
      organizationId
    );
    this.createAndSendEntityBroadcast(entityMessage, entity, recipientIds);
  }

  async broadcastProjectEntity(projectId: Id, userIds: Id[]): Promise<void> {
    const projectEntityMessage: PutEntityMessage = {
      operation: NotificationAction.INSERT,
      type: FeedMessageType.ENTITY,
      entityId: projectId,
      entityType: EntityType.Project,
    };

    const projectPeopleEntityMessage: PutEntityMessage = {
      operation: NotificationAction.INSERT,
      type: FeedMessageType.ENTITY,
      entityId: projectId,
      entityType: EntityType.ProjectPeople,
    };

    const project = await this.getEntity<ProjectDbRow>(
      Table.PROJECT,
      projectId
    );
    const projectPeople = await this.projectPeopleService.getProjectPeople(
      projectId
    );

    this.createAndSendEntityBroadcast(projectEntityMessage, project, userIds);
    this.createAndSendEntityBroadcast(
      projectPeopleEntityMessage,
      projectPeople,
      userIds
    );
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleProjectFollowers(entityMessage: PutEntityMessage) {
    const [projectId, userId] = this.parseNotificationIds(
      entityMessage.entityId
    );

    const recipientIds = await this.getProjectRecipientIds(projectId);
    entityMessage.entityType = EntityType.ProjectFollower;
    entityMessage.entityId = projectId;

    this.createAndSendEntityBroadcast(entityMessage, { userId }, recipientIds);
  }

  /**
   *
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleMessage(entityMessage: PutEntityMessage) {
    const messageWithContainerResult =
      await this.messageService.getMessageWithContainer(
        entityMessage.entityId,
        false
      );
    if (messageWithContainerResult.status !== MessageWithContainerStatus.OK) {
      return;
    }

    const { container } = messageWithContainerResult;

    const recipientIds = await this.getMessageRecipientUserIds(container);

    const message: PutEntityMessage = {
      ...entityMessage,
      optionalId: messageWithContainerResult.container.id,
      entityType: EntityType.Message,
    };

    this.createAndSendEntityBroadcast(
      message,
      messageWithContainerResult.message,
      recipientIds
    );
  }

  private async handleUser(entityMessage: PutEntityMessage) {
    const user = await this.userService.getUserById(entityMessage.entityId);
    const usersFromAllOrganizations =
      await this.userService.getAllUsersFromOrganizationsForUser(
        entityMessage.entityId
      );

    entityMessage.entityType = EntityType.User;

    this.createAndSendEntityBroadcast(
      entityMessage,
      user,
      usersFromAllOrganizations
    );
  }

  /**
   * Broadcasts given tag to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTag(entityMessage: PutEntityMessage) {
    const [tagId, organizationId] = this.parseNotificationIds(
      entityMessage.entityId
    );
    entityMessage.entityId = tagId;
    const tag = await this.getEntity<TagDbRow>(Table.TAG, tagId);
    if (!organizationId) {
      return;
    }

    const userIds = await this.getOrganizationRecipientUserIds(organizationId);
    entityMessage.entityType = EntityType.Tag;

    this.createAndSendEntityBroadcast(entityMessage, tag, userIds);
  }

  /**
   * Broadcasts given tag to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleExtensionInOrganization(entityMessage: PutEntityMessage) {
    const [extensionId, organizationId] = this.parseNotificationIds(
      entityMessage.entityId
    );
    const extensionInOrganization =
      await this.extensionService.getExtensionInWorkspace(
        extensionId,
        organizationId
      );

    const userIds = await this.getOrganizationRecipientUserIds(organizationId);
    entityMessage.entityType = EntityType.ExtensionInOrganization;

    this.createAndSendEntityBroadcast(
      entityMessage,
      extensionInOrganization,
      userIds
    );
  }

  /**
   * Broadcasts given extension custom field valu to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleExtensionCustomFieldValue(
    entityMessage: PutEntityMessage
  ) {
    const customFieldValue: CustomFieldValueDbRow =
      await this.getEntity<CustomFieldValueDbRow>(
        Table.EXTENSION_CUSTOM_FIELD_VALUE,
        entityMessage.entityId
      );
    const customField: CustomFieldDbRow =
      await this.getEntity<CustomFieldDbRow>(
        Table.EXTENSION_CUSTOM_FIELD,
        customFieldValue.fieldId
      );

    let userIds = [];
    switch (customFieldValue.targetType) {
      case CustomFieldTargetType.ORGANIZATION: {
        userIds = await this.getOrganizationRecipientUserIds(
          customFieldValue.targetId
        );
        break;
      }
      case CustomFieldTargetType.USER_IN_ORGANIZATION: {
        const userInOrganization =
          await this.userInOrganizationProvider.getUserInOrganizationById(
            customFieldValue.targetId
          );
        if (privateCustomFieldNames.includes(customField.name)) {
          userIds = [userInOrganization.userId];
        } else {
          userIds = await this.getOrganizationRecipientUserIds(
            userInOrganization.organizationId
          );
        }
        break;
      }
      case CustomFieldTargetType.PROJECT: {
        userIds = await this.getProjectRecipientIds(customFieldValue.targetId);
        break;
      }
      case CustomFieldTargetType.TASK_LIST: {
        userIds = await this.getTaskListRecipientIds(customFieldValue.targetId);
        break;
      }
      case CustomFieldTargetType.TASK: {
        userIds = await this.getTaskRecipientIds(customFieldValue.targetId);
        break;
      }
      default:
        break;
    }

    entityMessage.entityType = EntityType.ExtensionCustomFieldValue;

    this.createAndSendEntityBroadcast(
      entityMessage,
      {
        ...customFieldValue,
        name: customField.name,
        extensionId: customField.extensionId,
      },
      userIds
    );
  }

  private async handleTaskVotingReaction(entityMessage: PutEntityMessage) {
    const [taskId, userId, emojiCode] = this.parseNotificationIds(
      entityMessage.entityId
    );

    const userIds = await this.getTaskRecipientIds(taskId);
    entityMessage.entityType = EntityType.ExtensionDataTaskVotingReaction;

    this.createAndSendEntityBroadcast(
      entityMessage,
      { taskId, userId, emojiCode },
      userIds
    );
  }

  private async handleTaskRecurrenceSettings(entityMessage: PutEntityMessage) {
    const [id, taskId] = this.parseNotificationIds(entityMessage.entityId);

    const recurrenceSettings: TaskRecurrenceSettingsDbRow =
      await this.getEntity<TaskRecurrenceSettingsDbRow>(
        Table.TASK_RECURRENCE_SETTINGS,
        id
      );

    const userIds = await this.getTaskRecipientIds(taskId);
    entityMessage.entityType = EntityType.ExtensionDataTaskRecurrenceSettings;

    this.createAndSendEntityBroadcast(
      entityMessage,
      recurrenceSettings || { id, taskId },
      userIds
    );
  }

  private async handleTaskRecurrenceDependency(
    entityMessage: PutEntityMessage
  ) {
    const [id, taskId, targetTaskId] = this.parseNotificationIds(
      entityMessage.entityId
    );

    const recurrenceDependency: TaskRecurrenceDependencyDbRow =
      await this.getEntity<TaskRecurrenceDependencyDbRow>(
        Table.TASK_RECURRENCE_DEPENDENCY,
        id
      );

    const userIds = await this.getTaskRecipientIds(taskId);
    entityMessage.entityType = EntityType.ExtensionDataTaskRecurrenceDependency;

    this.createAndSendEntityBroadcast(
      entityMessage,
      recurrenceDependency || { id, taskId, targetTaskId },
      userIds
    );
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskHasTag(entityMessage: PutEntityMessage) {
    const taskId = entityMessage.entityId;
    const tasksTagIds = await this.tagService.getTasksTagsIds([taskId]);

    const project = await this.projectTasksService.getProjectByTaskId(taskId);
    const userIds = await this.getProjectOrganizationRecipientIds(project.id);

    entityMessage.entityType = EntityType.TaskTags;

    this.createAndSendEntityBroadcast(
      entityMessage,
      tasksTagIds[taskId],
      userIds
    );
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleTaskAttachment(entityMessage: PutEntityMessage) {
    const taskId = entityMessage.entityId;
    const taskAttachments = await this.connection
      .getQueryBuilder()
      .select('fileId')
      .from(Table.TASK_ATTACHMENT)
      .where('taskId', taskId)
      .pluck('file_id');

    const project = await this.projectTasksService.getProjectByTaskId(taskId);
    const userIds = await this.getProjectOrganizationRecipientIds(project.id);

    entityMessage.entityType = EntityType.TaskAttachments;

    this.createAndSendEntityBroadcast(entityMessage, taskAttachments, userIds);
  }

  /**
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleMessageAttachment(entityMessage: PutEntityMessage) {
    const [messageId] = this.parseNotificationIds(entityMessage.entityId);
    entityMessage.entityId = messageId;
    const messageAttachments: MessageFileDbRow[] = await this.connection
      .getQueryBuilder()
      .select()
      .from(Table.MESSAGE_FILE)
      .where('messageId', messageId);

    if (messageAttachments.length === 0) {
      return;
    }

    const file: FileDbRow = await this.getEntity<FileDbRow>(
      Table.FILE,
      messageAttachments[0].fileId
    );

    if (!file) {
      return;
    }

    const message: MessageDbRow = await this.getEntity<MessageDbRow>(
      Table.MESSAGE,
      messageAttachments[0].messageId
    );
    const container: MessageContainer =
      await this.messageContainerService.getContainerForMessage(message);

    if (!container) {
      return;
    }

    const fileIds = messageAttachments.map((messageFile) => messageFile.fileId);

    const userIds = await this.getOrganizationRecipientUserIds(
      file.organizationId
    );
    entityMessage.entityType = EntityType.MessageAttachment;

    this.createAndSendEntityBroadcast(
      entityMessage,
      { messageAttachments: fileIds, containerId: container.id },
      userIds
    );
  }

  /**
   * Broadcasts given checklistItem to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleChecklistItem(entityMessage: PutEntityMessage) {
    const [checklistItemId, taskId] = this.parseNotificationIds(
      entityMessage.entityId
    );

    const checklistItem: ChecklistItemDbRow =
      await this.getEntity<ChecklistItemDbRow>(
        Table.CHECKLIST_ITEM,
        checklistItemId
      );

    const task = await this.getEntity<TaskDbRow>(Table.TASK, taskId);
    const userIds = await this.getProjectOrganizationRecipientIds(
      task.projectId
    );

    entityMessage.entityType = EntityType.ChecklistItem;

    return this.createAndSendEntityBroadcast(
      entityMessage,
      checklistItem || { id: checklistItemId, taskId },
      userIds
    );
  }

  private async handleUserInChecklistItem(entityMessage: PutEntityMessage) {
    const [checklistItemId, userId] = this.parseNotificationIds(
      entityMessage.entityId
    );
    const checklistItemData = await this.getEntity<ChecklistItemDbRow>(
      Table.CHECKLIST_ITEM,
      checklistItemId
    );

    if (!checklistItemData) {
      // checklist item was deleted - no need to broadcast this event
      return;
    }

    const recipientIds = await this.getTaskRecipientIds(
      checklistItemData.taskId
    );
    entityMessage.entityType = EntityType.ChecklistItemAssignee;
    entityMessage.entityId = checklistItemId;

    return this.createAndSendEntityBroadcast(
      entityMessage,
      { userId },
      recipientIds
    );
  }

  /**
   * Broadcasts given task to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleFile(entityMessage: PutEntityMessage) {
    const fileId = entityMessage.entityId;
    const file: FileDbRow = await this.getEntity<FileDbRow>(Table.FILE, fileId);

    const userIds = await this.getOrganizationRecipientUserIds(
      file.organizationId
    );
    entityMessage.entityType = EntityType.File;

    return this.createAndSendEntityBroadcast(entityMessage, file, userIds);
  }

  /**
   * Broadcasts given chat notification settings to user
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleChatNotificationSettings(
    entityMessage: PutEntityMessage
  ) {
    const { entityId } = entityMessage;
    const [userId, projectId] = this.parseNotificationIds(entityId);
    const chatNotificationSettingsType =
      await this.notificationSettingsService.getChatNotificationSettingsType(
        userId,
        projectId
      );

    entityMessage.entityType = EntityType.ChatNotificationSettings;

    return this.createAndSendEntityBroadcast(
      entityMessage,
      { chatNotificationSettingsType, projectId },
      [userId]
    );
  }

  /**
   * Broadcasts given activity to whole organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleActivity(entityMessage: PutEntityMessage) {
    const activityId = entityMessage.entityId;
    const activity: ActivityDbRow = await this.getEntity<ActivityDbRow>(
      Table.ACTIVITY,
      activityId
    );

    let targetId = null;
    let containerId = null;
    let userIds = [] as Id[];

    if (activity.targetType) {
      const target = await this.activityProvider.getActivityTarget(
        activityId,
        activity.targetType
      );
      switch (activity.targetType) {
        case TargetType.TASK: {
          targetId = (target as ActivityTargetTaskDbRow).taskId;
          userIds = await this.getTaskRecipientIds(targetId);
          break;
        }
        case TargetType.PROJECT: {
          targetId = (target as ActivityTargetProjectDbRow).projectId;
          userIds = await this.getProjectRecipientIds(targetId);
          break;
        }
        case TargetType.TASK_LIST: {
          targetId = (target as ActivityTargetTaskListDbRow).taskListId;
          userIds = await this.getTaskListRecipientIds(targetId);
          break;
        }
        default: {
          userIds = await this.userService.getAllUsersFromOrganizationsForUser(
            activity.actorId
          );
        }
      }
    }

    if (activity.containerType) {
      const container = await this.activityProvider.getActivityContainer(
        activityId,
        activity.containerType
      );
      switch (activity.containerType) {
        case ContainerType.TASK: {
          containerId = (container as ActivityContainerTaskDbRow).taskId;
          break;
        }
        case ContainerType.PROJECT: {
          containerId = (container as ActivityContainerProjectDbRow).projectId;
          break;
        }
      }
    }

    const changedProps = await this.activityProvider.getActivityChangedProps(
      activityId
    );
    entityMessage.entityType = EntityType.Activity;

    this.createAndSendEntityBroadcast(
      entityMessage,
      {
        ...activity,
        targetId,
        containerId,
        changedProps,
      },
      userIds
    );

    const isProjectMadePublic = this.isProjectMadePublic(
      activity,
      changedProps
    );
    const isProjectUnarchived = this.isProjectUnarchived(
      activity,
      changedProps
    );

    if (isProjectMadePublic) {
      const projectPeopleIds =
        await this.projectPeopleService.getUserIdsInProject(targetId);
      const organizationUserIds = await this.getProjectOrganizationRecipientIds(
        targetId
      );

      const newUsersWithAccess = organizationUserIds.filter(
        (userId) => !projectPeopleIds.includes(userId)
      );

      await this.broadcastProjectEntity(targetId, newUsersWithAccess);
    }

    if (isProjectUnarchived) {
      const projectPeopleIds =
        await this.projectPeopleService.getUserIdsInProject(targetId);
      const project = await this.getEntity<ProjectDbRow>(
        Table.PROJECT,
        targetId
      );
      const organizationUserIds = await this.getProjectOrganizationRecipientIds(
        targetId
      );

      const newUsersWithAccess = project.isPrivate
        ? projectPeopleIds
        : organizationUserIds;

      await this.broadcastProjectEntity(targetId, newUsersWithAccess);
    }
  }

  isProjectMadePublic(
    activity: ActivityDbRow,
    changedProps: ActivityChangedPropDbRow[]
  ): boolean {
    return (
      activity.targetType === TargetType.PROJECT &&
      Boolean(
        changedProps.find(
          (changedProp) =>
            changedProp.propertyName === 'isPrivate' &&
            changedProp.old &&
            !changedProp.new
        )
      )
    );
  }

  isProjectUnarchived(
    activity: ActivityDbRow,
    changedProps: ActivityChangedPropDbRow[]
  ): boolean {
    return (
      activity.targetType === TargetType.PROJECT &&
      Boolean(
        changedProps.find(
          (changedProp) =>
            changedProp.propertyName === 'status' &&
            changedProp.old === EntityStatus.ARCHIVED &&
            changedProp.new === EntityStatus.EXISTS
        )
      )
    );
  }

  /**
   * Broadcasts given csubscription in organization
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleSubscriptionInOrganization(
    entityMessage: PutEntityMessage
  ) {
    const { entityId } = entityMessage;
    const [id, organizationId] = this.parseNotificationIds(entityId);
    const subscriptionInOrganization =
      await this.getEntity<SubscriptionInOrganizationDbRow>(
        Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION,
        id
      );

    entityMessage.entityType = EntityType.SubscriptionInOrganization;
    const userIds = await this.getOrganizationRecipientUserIds(organizationId);

    return this.createAndSendEntityBroadcast(
      entityMessage,
      subscriptionInOrganization || { id, organizationId },
      userIds
    );
  }

  /**
   * Broadcasts given csubscription plan
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleSubscriptionPlan(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const subscriptionPlan = await this.getEntity<SubscriptionPlanDbRow>(
      Table.PAYMENTS_SUBSCRIPTION_PLAN,
      entityId
    );

    entityMessage.entityType = EntityType.SubscriptionPlan;

    return this.createAndSendEntityBroadcast(
      entityMessage,
      subscriptionPlan || { id: entityId },
      '*'
    );
  }

  /**
   * Broadcasts given subscription cancellation status
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleSubscriptionInOrganizationCancellation(
    entityMessage: PutEntityMessage
  ) {
    const { entityId } = entityMessage;
    const [subscriptionId, organizationId] =
      this.parseNotificationIds(entityId);

    const subscriptionCancellationInOrganization =
      await this.getEntity<SubscriptionCancellationInOrganizationDbRow>(
        Table.PAYMENTS_SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION,
        subscriptionId,
        'subscription_id'
      );

    const userIds =
      await this.userInOrganizationProvider.getOrganizationActiveUserIds(
        organizationId
      );

    entityMessage.entityType =
      EntityType.SubscriptionCancellationInOrganization;

    return this.createAndSendEntityBroadcast(
      entityMessage,
      subscriptionCancellationInOrganization || {
        subscriptionId,
        organizationId,
      },
      userIds
    );
  }

  /**
   * Broadcasts integration to user
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleIntegration(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const [userId, organizationId, extensionId] =
      this.parseNotificationIds(entityId);

    entityMessage.entityType = EntityType.Integration;

    const integration = await this.getEntity<IntegrationDbRow>(
      Table.INTEGRATION,
      {
        userId,
        organizationId,
        extensionId,
      }
    );

    this.createAndSendEntityBroadcast(
      entityMessage,
      integration || { userId, organizationId, extensionId },
      [userId]
    );
  }

  /**
   * Broadcasts extension app to user
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleExtensionApp(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const app = await this.getEntity<AppDbRow>(Table.EXTENSION_APP, entityId);

    entityMessage.entityType = EntityType.ExtensionApp;

    const appMembers = await this.userAppsDataProvider.getAppMembers(entityId);
    const userIds = appMembers.map((member) => member.userId);

    let oAuthClient: OAuthClientDbRow = null;

    if (app) {
      oAuthClient = await this.getEntity<OAuthClientDbRow>(
        Table.OAUTH_CLIENT,
        app.oauthClientId
      );
    }

    const entity = {
      app: app || { id: entityId },
      oAuthClient,
    };

    this.createAndSendEntityBroadcast(entityMessage, entity, userIds);
  }
  /**
   * Broadcasts extension user_in_app to user
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleExtensionUserInApp(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const [appId, userId] = this.parseNotificationIds(entityId);
    entityMessage.entityType = EntityType.ExtensionUserInApp;

    const appMembers = await this.userAppsDataProvider.getAppMembers(appId);
    const userIds = appMembers.map((member) => member.userId);
    const users = await this.userService.getUsersByIds(userIds);

    const app = await this.getEntity<AppDbRow>(Table.EXTENSION_APP, appId);
    let oAuthClient: OAuthClientDbRow;
    if (app) {
      oAuthClient = await this.getEntity<OAuthClientDbRow>(
        Table.OAUTH_CLIENT,
        app.oauthClientId
      );
    }
    const entity = { app, appMembers, users, oAuthClient, appId, userId };

    this.createAndSendEntityBroadcast(entityMessage, entity, [
      ...userIds,
      userId,
    ]);
  }
  /**
   * Broadcasts job_status
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handleJobStatus(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    entityMessage.entityType = EntityType.JobStatus;

    const jobStatus = await this.getEntity<JobStatusDbRow>(
      Table.JOBS_JOB_STATUS,
      entityId
    );
    const { userId, organizationId, jobsDone, jobsSpawned } = jobStatus;

    let userIds = [];

    if (userId) {
      userIds = [userId];
    } else if (organizationId) {
      userIds = await this.getOrganizationRecipientUserIds(organizationId);
    } else {
      return;
    }

    const isDone = jobsDone > 0 && jobsSpawned === jobsDone;
    const isStarted = jobsDone === 0 && jobsSpawned === 0;

    if (isDone || isStarted) {
      this.createAndSendEntityBroadcast(entityMessage, jobStatus, userIds);
    }

    if (!isDone) {
      return;
    }

    switch (jobStatus.namespace) {
      case JobNamespace.TRELLO_DATA_IMPORT: {
        const extension = await this.extensionService.getExtensionByNamespace(
          ExtensionNamespace.TRELLO_DATA_IMPORT
        );
        await this.integrationProvider.setIntegrationStatus(
          extension.id,
          organizationId,
          userId,
          IntegrationStatus.SUCCESS
        );
        break;
      }
      default:
        break;
    }
  }

  private async handleAppVersion(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const [versionCode, appPlatformId] = this.parseNotificationIds(entityId);
    const appPlatform = await this.getEntity<DictDbRow<AppPlatform>>(
      Table.DICT_APP_PLATFORM,
      appPlatformId
    );

    entityMessage.entityType = EntityType.AppVersion;

    const entity = {
      appVersionCode: versionCode,
      appPlatform: appPlatform.value,
    };

    return this.createAndSendEntityBroadcast(entityMessage, entity, '*');
  }

  private async handleUserProjectOrder(entityMessage: PutEntityMessage) {
    const [projectOrderId, userInOrganizationId, projectId] =
      this.parseNotificationIds(entityMessage.entityId);

    entityMessage.entityType = EntityType.PersonalProjectOrder;
    entityMessage.entityId = projectOrderId;

    let entity;
    if (entityMessage.operation === NotificationAction.DELETE) {
      entity = {
        projectId,
      };
    } else {
      entity =
        await this.personalProjectOrderProvider.getProjectOrderEntityById(
          projectOrderId
        );
      if (!entity) {
        return;
      }
    }

    const { userId: recipientId } =
      await this.userInOrganizationProvider.getUserInOrganizationById(
        userInOrganizationId
      );

    this.createAndSendEntityBroadcast(entityMessage, entity, [recipientId]);
  }

  private async handleUserProjectGroup(entityMessage: PutEntityMessage) {
    const [groupId, userInOrganizationId] = this.parseNotificationIds(
      entityMessage.entityId
    );

    entityMessage.entityType = EntityType.PersonalProjectGroup;
    entityMessage.entityId = groupId;

    let entity;
    if (entityMessage.operation === NotificationAction.DELETE) {
      entity = {
        groupId,
      };
    } else {
      entity = await this.personalProjectGroupProvider.getPersonalProjectGroup(
        groupId
      );
    }

    const { userId: recipientId } =
      await this.userInOrganizationProvider.getUserInOrganizationById(
        userInOrganizationId
      );

    this.createAndSendEntityBroadcast(entityMessage, entity, [recipientId]);
  }

  private async handleProjectInGroup(entityMessage: PutEntityMessage) {
    const [userId, groupId, projectId] = this.parseNotificationIds(
      entityMessage.entityId
    );

    entityMessage.entityType = EntityType.ProjectInGroup;

    let entity;
    if (entityMessage.operation === NotificationAction.DELETE) {
      entity = { projectId, groupId };
    } else {
      entity =
        await this.projectInGroupProvider.getProjectInGroupByProjectIdAndGroupId(
          projectId,
          groupId
        );
    }

    this.createAndSendEntityBroadcast(entityMessage, entity, [userId]);
  }

  /**
   * Broadcasts given csubscription payment
   * @param {PutEntityMessage} entityMessage
   * @return {Promise<void>}
   */
  private async handlePayment(entityMessage: PutEntityMessage) {
    const { entityId } = entityMessage;
    const payment = await this.getEntity<PaymentDbRow>(
      Table.PAYMENTS_PAYMENT,
      entityId
    );

    entityMessage.entityType = EntityType.SubscriptionPayment;
    const userIds = await this.userService.getAllUsersFromOrganizationsForUser(
      payment.userId
    );

    return this.createAndSendEntityBroadcast(
      entityMessage,
      payment || { id: entityId },
      userIds
    );
  }

  private async getEntities<T>(
    table: string,
    value: Id | any,
    property?: string
  ): Promise<T[]> {
    return await this.getQueryBuilder(table, value, property);
  }

  private async getEntity<T>(
    table: string,
    value: Id | any,
    property?: string
  ): Promise<T> {
    return await this.getQueryBuilder(table, value, property).first();
  }

  private getQueryBuilder(table: string, value: Id | any, property: string) {
    const isValueObject = typeof value === 'object';
    return this.connection
      .getQueryBuilder()
      .select()
      .from(table)
      .where(isValueObject ? value : { [property || 'id']: value });
  }

  /**
   * Returns list of all user ids that are in organization.
   *
   * @param {Id} organizationId
   */
  private async getOrganizationRecipientUserIds(
    organizationId: Id,
    includeInactiveUsers: boolean = false
  ): Promise<Id[]> {
    if (includeInactiveUsers) {
      return await this.userInOrganizationProvider.getOrganizationUserIdsWithoutBot(
        organizationId
      );
    } else {
      return await this.userInOrganizationProvider.getOrganizationActiveUserIds(
        organizationId
      );
    }
  }

  private async getProjectOrganizationRecipientIds(
    projectId: Id
  ): Promise<Id[]> {
    const project = await this.getEntity<ProjectDbRow>(
      Table.PROJECT,
      projectId
    );
    return await this.getOrganizationRecipientUserIds(project.organizationId);
  }

  private async getProjectRecipientIds(projectId: Id): Promise<Id[]> {
    return await this.projectPeopleService.getUserIdsInProject(projectId);
  }

  private async getTaskListRecipientIds(taskListId: Id): Promise<Id[]> {
    const list = await this.getEntity<ListDbRow>(Table.TASK_LIST, taskListId);

    return await this.projectPeopleService.getUserIdsInProject(list.projectId);
  }

  private async getTaskRecipientIds(taskId: Id): Promise<Id[]> {
    const task = await this.getEntity<TaskDbRow>(Table.TASK, taskId);

    return await this.projectPeopleService.getUserIdsInProject(task.projectId);
  }

  private async getMessageRecipientUserIds(
    container: MessageContainer
  ): Promise<Id[]> {
    let project = null;
    switch (container.containerType) {
      case MessageContainerType.PROJECT: {
        project = await this.projectService.getProject(container.id);
        break;
      }
      case MessageContainerType.TASK: {
        project = await this.projectTasksService.getProjectByTaskId(
          container.id
        );
        break;
      }
      default:
        throw Type.NOT_IMPLEMENTED_CONTAINER_TYPE;
    }

    if (!project) {
      return [];
    }

    return await this.projectPeopleService.getUserIdsInProject(project.id);
  }

  /**
   * Sends specific type of broadcast that updates entity on client side.
   *
   * @param {PutEntityMessage} message
   * @param entity
   * @param {any[]} recipientUserIds
   */
  private createAndSendEntityBroadcast(
    message: PutEntityMessage,
    entity: any,
    recipientUserIds: BroadcastRecipients
  ) {
    message.body = parseDateToEpochInMS(entity);

    this.createAndSendBroadcast(message, recipientUserIds);
  }

  /**
   * Sends specific type of broadcast that updates entity on client side.
   *
   * @param {EntityDiffMessage} message
   * @param entity
   * @param {any[]} recipientUserIds
   */
  private createAndSendEntityDiffBroadcast(
    message: EntityDiffMessage,
    entity: any,
    recipientUserIds: any[]
  ) {
    message.body = parseDateToEpochInMS(entity);

    this.createAndSendBroadcast(message, recipientUserIds);
  }

  /**
   * Sends specific type of broadcast that updates entity on client side.
   *
   * @param {PushNotificationMessage} message
   * @param {any[]} recipientUserIds
   */
  private createAndSendPushNotificationBroadcast(
    message: PushNotificationMessage,
    recipientUserIds: any[]
  ) {
    this.createAndSendBroadcast(message, recipientUserIds);
  }

  public async attach(feedService: FeedServiceInterface): Promise<void> {
    if (this.feedService) {
      const err = 'Cannot attach plugin to more than one FeedService!';
      this.logger.error(err);
      throw err;
    }
    this.feedService = feedService;
    this.postgresListener.on(
      NEW_NOTIFICATION,
      this.handleNotification.bind(this)
    );
    this.registerNotificationCommand();
    this.logger.info('Attached.');
    this.onMessage = this.onMessage.bind(this);
  }

  /**
   * Wraps message and recipients together (into Broadcast object).
   *
   * @param {PutEntityMessage} message
   * @param {Id[]} recipients
   */
  private createAndSendBroadcast(
    message: FeedMessage,
    recipients: BroadcastRecipients
  ) {
    if (!this.feedService) {
      this.logger.warn('Cannot send broadcast before FeedService is attached!');
      return;
    }
    const broadcast: Broadcast = {
      message,
      recipients: Array.isArray(recipients) ? uniq(recipients) : recipients,
    };

    this.feedService.broadcast(broadcast);
  }

  registerNotificationCommand() {
    this.logger.debug('Registering notification command');
    process.on('message', this.onMessage);
  }

  async onMessage(message: ProcessMessage): Promise<void> {
    if (
      !message ||
      !message.type ||
      message.type !== ProcessType.NOTIFICATION_COMMAND
    ) {
      return;
    }
    const { title, content } = message.data;

    const recipientIds = await this.userSessionService.getOnlineUserIds(
      DeviceType.DESKTOP_APP
    );

    if (recipientIds.length === 0) {
      return this.logger.debug('No desktop devices to push to');
    }

    this.logger.debug(
      `Sending push notification to ${recipientIds.length} desktop devices.`
    );

    const pushMessage: PushNotificationMessage = {
      type: FeedMessageType.PUSH_NOTIFICATION,
      notificationType: NotificationType.GLOBAL,
      pushNotification: {
        content,
        title,
      },
      actorId: '',
    };

    const broadcast: Broadcast = {
      message: pushMessage,
      recipients: recipientIds,
    };
    this.feedService.broadcast(broadcast);
  }

  /**
   * @param ids
   */
  private parseNotificationIds(ids: string): Id[] {
    return parseNotificationIds(ids);
  }
}
