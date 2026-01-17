import { intersection, pick, uniq, without } from 'lodash';
import { generateId, Id } from '../common/identifier';
import {
  ActivityChangedPropDbRow,
  ActivityDbRow,
  ChatNotificationSettingsDbRow,
  ChatNotificationSettingsType,
  FileDbRow,
  MessageContainerType,
  MessageDbRow,
  MessageHailType,
  NotificationData,
  NotificationDbRow,
  ProjectDbRow,
  ProjectType,
  TaskDbRow,
  UserDbRow,
} from '../db/schema';
import { MessageServiceInterface } from '../messages/interfaces/MessageServiceInterface';
import { UserSessionServiceInterface } from '../onlineStatus/UserSessionServiceInterface';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { NotificationFactoryInterface } from './interfaces/NotificationFactoryInterface';
import { DEFAULT_DELIVERY_SETTINGS, NotificationsDeliverySettingsJsonInterface, NotificationType } from './types';

import { inject, injectable, multiInject } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { ActivityProviderInterface } from '../activities/interfaces/ActivityProviderInterface';
import { BotModule } from '../bot/BotModule';
import { BotProviderInterface } from '../bot/BotProviderInterface';
import { ChecklistItemProviderInterface } from '../checklist/ChecklistItemProviderInterface';
import { ChecklistModule } from '../checklist/ChecklistModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import Table from '../db/Table';
import { FilesModule } from '../files/FilesModule';
import { FileServiceInterface } from '../files/interfaces/FileServiceInterface';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { MessageContainerServiceInterface } from '../messages/interfaces/MessageContainerServiceInterface';
import { MessagesModule } from '../messages/MessagesModule';
import { OnlineStatusModule } from '../onlineStatus/OnlineStatusModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { ProjectService } from '../projects/ProjectService';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface';
import { TasksModule } from '../tasks/TasksModule';
import UserService from '../users/UserService';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { UsersModule } from '../users/UsersModule';
import { FollowerServiceInterface } from './interfaces/FollowerServiceInterface';
import { NotificationSettingsServiceInterface } from './interfaces/NotificationSettingsServiceInterface';
import { NotificationTransportInterface } from './interfaces/NotificationTransportInterface';
import { NotificationsModule } from './NotificationsModule';
import { getIsOnlyOnlineUsersHail } from './utils';

import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

const mentionsSettingsTypes = [ChatNotificationSettingsType.ALL, ChatNotificationSettingsType.ONLY_MENTIONS];
const messagesSettingsTypes = [ChatNotificationSettingsType.ALL];

const notificationsAcceptedSettings = {
  [NotificationType.CONVERSATION_MESSAGE_SENT]: messagesSettingsTypes,
  [NotificationType.HAIL_MENTIONED]: mentionsSettingsTypes,
  [NotificationType.USER_MENTIONED]: mentionsSettingsTypes,
};

interface NotificationServiceOptions {
  defaultChatNotificationSettingsType: ChatNotificationSettingsType;
}

const defaultChatNotificationSettingsType = ChatNotificationSettingsType.ONLY_MENTIONS;

@injectable()
export class NotificationFactory implements NotificationFactoryInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,

    @inject(OnlineStatusModule.UserSessionServiceInterface)
    private sessionService: UserSessionServiceInterface,

    @inject(MessagesModule.MessageServiceInterface)
    private messageService: MessageServiceInterface,

    @inject(MessagesModule.MessageContainerServiceInterface)
    private messageContainerService: MessageContainerServiceInterface,

    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,

    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,

    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,

    @inject(ActivitiesModule.ActivityProviderInterface)
    private activityProvider: ActivityProviderInterface,

    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,

    @inject(ChecklistModule.ChecklistItemProviderInterface)
    private checklistItemProvider: ChecklistItemProviderInterface,

    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,

    @inject(FilesModule.FileServiceInterface)
    private fileService: FileServiceInterface,

    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private settingsService: NotificationSettingsServiceInterface,

    @inject(BotModule.BotProviderInterface)
    private botProvider: BotProviderInterface,

    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,

    @multiInject(NotificationsModule.NotificationTransportInterface)
    private transports: NotificationTransportInterface[],

    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,

    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,

    @inject(NotificationsModule.FollowerServiceInterface)
    protected followerService: FollowerServiceInterface,

    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,

    @inject(NotificationsModule.NotificationServiceOptions)
    private options: NotificationServiceOptions = { defaultChatNotificationSettingsType }
  ) {}

  async createNotificationConversationMessageSent(
    messageId: Id,
    project: ProjectDbRow
  ): Promise<Array<NotificationDbRow>> {
    const message = await this.messageService.getMessage(messageId);
    if (!message.content) {
      // No notifications for empty content;
      return [];
    }
    const { people, recipientIds } = await this.getRecipientsForProjectMessage(messageId, project.id);

    const conversationId = this.conversationService.generateConversationHash(message.organizationId, people);

    const type = NotificationType.CONVERSATION_MESSAGE_SENT;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      messageId: message ? message.id : null,
      messageValue: message ? message.content : null,
      conversationId,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      message.senderId,
      organizationId,
      project.id
    );
  }

  async createNotificationFileUploadedInChat(message: MessageDbRow, file: FileDbRow): Promise<NotificationDbRow[]> {
    const containerInstance = await this.messageContainerService.getContainerInstance(message);

    let data: NotificationData = {
      messageId: message ? message.id : null,
      messageValue: message ? message.content : null,

      ...(await this.createNotificationDataForFile(file)),
    };

    let notificationType: NotificationType = NotificationType.CONVERSATION_MESSAGE_SENT;

    let recipientIds = [];
    // TODO This switch is very ugly
    switch (containerInstance.containerType) {
      case MessageContainerType.PROJECT:
        notificationType = NotificationType.CONVERSATION_MESSAGE_SENT;
        const recipients = await this.getRecipientsForProjectMessage(message.id, containerInstance.id);
        recipientIds = recipients.recipientIds;
        data = {
          ...data,
          ...(await this.createNotificationDataForProject(containerInstance.instance as ProjectDbRow)),
        };
        if (ProjectService.isProjectConversation(containerInstance.instance as ProjectDbRow)) {
          const projectPeople = await this.projectPeopleService.getUserIdsInProject(containerInstance.id);
          data.conversationId = this.conversationService.generateConversationHash(
            message.organizationId,
            projectPeople
          );
        }
        break;

      case MessageContainerType.TASK:
        notificationType = NotificationType.TASK_MESSAGE_SENT;
        recipientIds = await this.getRecipientsForTaskMessage(message.id, containerInstance.id);
        data = {
          ...data,
          ...(await this.createNotificationDataForTask(containerInstance.instance as TaskDbRow)),
        };

        break;
    }
    return await this.createNotificationsInAppForRecipients(
      notificationType,
      recipientIds,
      data,
      message.senderId,
      message.organizationId,
      containerInstance.id
    );
  }

  async createNotificationUserMentioned(messageId: Id): Promise<Array<NotificationDbRow>> {
    const message = await this.messageService.getMessage(messageId);
    const { mentionedUserIds } = await this.messageService.getMentions(messageId);
    const type = NotificationType.USER_MENTIONED;

    const container = await this.messageContainerService.getContainerInstance(message);
    let projectId = null;
    let task = null;
    let list = null;
    let containerId = null;
    let conversationId = null;

    if (message.containerType === MessageContainerType.PROJECT) {
      projectId = container.id;
      containerId = container.id;
    } else if (message.containerType === MessageContainerType.TASK) {
      task = await this.taskService.getTaskById(container.id);
      list = await this.listProvider.getList(task.taskListId);
      projectId = task.projectId;
      containerId = container.id;
    }

    const project = await this.projectService.getProject(projectId);
    const organizationId = project ? project.organizationId : null;
    const userIdsInProject = await this.projectPeopleService.getUserIdsInProject(projectId);
    let recipientIds = without(mentionedUserIds, message.senderId);

    if (project.isPrivate || project.projectType === ProjectType.DIRECT_CHAT) {
      recipientIds = intersection(recipientIds, userIdsInProject);
    }

    if ([ProjectType.GROUP_CHAT, ProjectType.DIRECT_CHAT].includes(project.projectType)) {
      const users = await this.projectPeopleService.getProjectPeople(projectId);
      const userIds = users.map((row) => row.userId);
      conversationId = this.conversationService.generateConversationHash(message.organizationId, userIds);
    }

    const data: NotificationData = {
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      messageId: message ? message.id : null,
      messageValue: message ? message.content : null,
      conversationId,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      message.senderId,
      organizationId,
      containerId
    );
  }

  async createNotificationHailMentioned(messageId: Id): Promise<Array<NotificationDbRow>> {
    const message = await this.messageService.getMessage(messageId);
    const { hails } = await this.messageService.getHails(messageId);
    const container = await this.messageContainerService.getContainerInstance(message);
    const type = NotificationType.HAIL_MENTIONED;

    let recipientIds = [];
    let projectId = null;
    let taskId = null;
    let task = null;
    let list = null;
    let containerId = null;
    let conversationId = null;

    if (message.containerType === MessageContainerType.PROJECT) {
      projectId = container.id;
      containerId = container.id;
      const project = await this.projectService.getProject(projectId);

      if ([ProjectType.GROUP_CHAT, ProjectType.DIRECT_CHAT].includes(project.projectType)) {
        const users = await this.projectPeopleService.getProjectPeople(projectId);
        const userIds = users.map((row) => row.userId);
        conversationId = this.conversationService.generateConversationHash(message.organizationId, userIds);
      }
    } else if (message.containerType === MessageContainerType.TASK) {
      taskId = container.id;
      task = await this.taskService.getTaskById(taskId);
      list = await this.listProvider.getList(task.taskListId);
      projectId = task.projectId;
      containerId = container.id;
    }

    let userIds = [];
    for (let i = 0; i < hails.length; i++) {
      const hail = hails[i];
      switch (hail) {
        case MessageHailType.HERE: {
          if (message.containerType === MessageContainerType.PROJECT) {
            userIds = await this.projectPeopleService.getProjectPeople(projectId);
            const project = await this.projectService.getProject(projectId);
            userIds = userIds.map((row) => row.userId);
            if ([ProjectType.GROUP_CHAT, ProjectType.DIRECT_CHAT].includes(project.projectType)) {
              conversationId = this.conversationService.generateConversationHash(message.organizationId, userIds);
            }
          } else if (message.containerType === MessageContainerType.TASK) {
            userIds = await this.taskService.getTaskFollowerIdsWithAssignees(taskId);
          }
          const isOnline = await this.sessionService.getOnlineStatuses(userIds);
          recipientIds = userIds.filter((userId) => isOnline[userId]);
          break;
        }
        case MessageHailType.PROJECT:
        case MessageHailType.SPACE: {
          userIds = await this.projectPeopleService.getProjectPeople(projectId);
          recipientIds = userIds.map((row) => row.userId);
          break;
        }
        case MessageHailType.ASSIGNEES: {
          if (message.containerType === MessageContainerType.TASK) {
            recipientIds = await this.taskProvider.getTaskAssigneeIds(taskId);
          }
          break;
        }
      }
    }

    const project = await this.projectService.getProject(projectId);
    const organizationId = project ? project.organizationId : null;
    recipientIds = without(recipientIds, message.senderId);

    const data: NotificationData = {
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      messageId: message ? message.id : null,
      messageValue: message ? message.content : null,
      conversationId,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      message.senderId,
      organizationId,
      containerId
    );
  }

  async createNotificationUserInvitedToProject(
    userId: Id,
    projectId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const user = await this.userService.getUserById(userId);
    const project = await this.projectService.getProject(projectId);
    const organizationId = project ? project.organizationId : null;
    const type = NotificationType.USER_ADDED_TO_PROJECT;
    const data: NotificationData = {
      userId: userId,
      userValue: UserService.getUserFullName(user),
      projectId: projectId,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
    };

    if (project.projectType !== ProjectType.PROJECT) {
      // Notifications are sent only for projects, NOT chats (neither 1-1 nor group)
      return;
    }

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      projectId,
      activity.id
    );
  }

  async createNotificationUserRemovedFromProject(
    userId: Id,
    projectId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const user = await this.userService.getUserById(userId);
    const project = await this.projectService.getProject(projectId);
    const organizationId = project ? project.organizationId : null;
    const type = NotificationType.USER_REMOVED_FROM_PROJECT;

    const data: NotificationData = {
      userId: userId,
      userValue: UserService.getUserFullName(user),
      projectId,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      projectId,
      activity.id
    );
  }

  async createNotificationProjectUpdated(
    projectId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    const project = await this.projectService.getProject(projectId);
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const organizationId = project ? project.organizationId : null;
    const type = NotificationType.PROJECT_UPDATED;

    const data: NotificationData = {
      projectId: projectId,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,

      changedProps: changedProps.map(NotificationFactory.extractChangedProps),
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      projectId,
      activity.id
    );
  }

  async createNotificationTaskCreated(
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    const task = await this.taskService.getTaskById(taskId);
    const project = await this.projectService.getProject(task.projectId);
    const list = await this.listProvider.getList(task.taskListId);
    const message = await this.messageService.getMessage(task.sourceMessageId);
    const type = NotificationType.TASK_CREATED;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskId,
      taskValue: task ? task.name : null,
      taskListId: task ? task.taskListId : null,
      taskSourceMessageId: task ? task.sourceMessageId : null,
      taskSourceMessageOwnerId: message ? message.senderId : undefined,
      taskListValue: list ? list.name : null,
      projectId: task ? task.projectId : null,
      projectValue: project ? project.name : null,
      messageId: task ? task.sourceMessageId : null,
      messageValue: message ? message.content : null,
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      taskId,
      activity.id
    );
  }

  async createNotificationTaskUpdated(
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    // TODO parallelize
    const task = await this.taskService.getTaskById(taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const type = NotificationType.TASK_UPDATED;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskId,
      taskValue: task ? task.name : null,
      taskListId: task ? task.taskListId : null,
      taskListValue: list ? list.name : null,
      projectId: task ? task.projectId : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      changedProps: changedProps.map(NotificationFactory.extractChangedProps),
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      taskId,
      activity.id
    );
  }

  public static extractChangedProps(changedPropertyRow: ActivityChangedPropDbRow) {
    return pick(changedPropertyRow, ['propertyName', 'old', 'new']);
  }

  async createNotificationUserAssignedToTask(
    userId: Id,
    taskId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const task = await this.taskService.getTaskById(taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const user = await this.userService.getUserById(userId);
    const type = NotificationType.USER_ASSIGNED_TO_TASK;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskId,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      userId,
      userValue: UserService.getUserFullName(user),
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      taskId,
      activity.id
    );
  }

  async createNotificationUserRemovedFromTaskAssignees(
    userId: Id,
    taskId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const task = await this.taskService.getTaskById(taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const user = await this.userService.getUserById(userId);
    const type = NotificationType.USER_UNASSIGNED_FROM_TASK;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskId,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      userId,
      userValue: UserService.getUserFullName(user),
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      taskId,
      activity.id
    );
  }

  async createNotificationUserAssignedToChecklistItem(
    userId: Id,
    checklistItemId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId);
    const task = await this.taskService.getTaskById(checklistItem.taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const user = await this.userService.getUserById(userId);
    const type = NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      checklistItemId,
      checklistItemValue: checklistItem.name,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      userId,
      userValue: UserService.getUserFullName(user),
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      checklistItemId,
      activity.id
    );
  }

  async createNotificationUserRemoveFromChecklistItemAssignees(
    userId: Id,
    checklistItemId: Id,
    activity: ActivityDbRow
  ): Promise<Array<NotificationDbRow>> {
    const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId);
    const task = await this.taskService.getTaskById(checklistItem.taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const user = await this.userService.getUserById(userId);
    const type = NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      checklistItemId,
      checklistItemValue: checklistItem.name,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      userId,
      userValue: UserService.getUserFullName(user),
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      [userId],
      data,
      activity.actorId,
      organizationId,
      checklistItemId,
      activity.id
    );
  }

  async createNotificationTaskListCreated(
    listId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    const list = await this.listProvider.getList(listId);
    const project = await this.projectService.getProject(list.projectId);
    const type = NotificationType.TASK_LIST_CREATED;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskListId: listId,
      taskListValue: list ? list.name : null,
      projectId: list ? list.projectId : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      list.projectId,
      activity.id
    );
  }

  async createNotificationTaskListUpdated(
    listId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    const list = await this.listProvider.getList(listId);
    const project = await this.projectService.getProject(list.projectId);
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const type = NotificationType.TASK_LIST_UPDATED;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskListId: listId,
      taskListValue: list ? list.name : null,
      projectId: list ? list.projectId : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      changedProps: changedProps.map(NotificationFactory.extractChangedProps),
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      listId,
      activity.id
    );
  }

  async createNotificationTaskMessageSent(messageId: Id, taskId: Id): Promise<Array<NotificationDbRow>> {
    const recipientIds = await this.getRecipientsForTaskMessage(messageId, taskId);
    const message = await this.messageService.getMessage(messageId);

    if (!message.content) {
      // No notifications for empty content;
      return [];
    }

    const task = await this.taskService.getTaskById(taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const userIds = without(recipientIds, message.senderId);
    const type = NotificationType.TASK_MESSAGE_SENT;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      projectId: task ? task.projectId : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      messageId: message ? message.id : null,
      messageValue: message ? message.content : null,
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      userIds,
      data,
      message.senderId,
      organizationId,
      taskId
    );
  }

  async createNotificationFileAttachedToTask(
    fileId: Id,
    taskId: Id,
    activity: ActivityDbRow,
    recipientIds: Array<Id>
  ): Promise<Array<NotificationDbRow>> {
    const file = await this.fileService.getFileById(fileId);
    const task = await this.taskService.getTaskById(taskId);
    const list = await this.listProvider.getList(task.taskListId);
    const project = await this.projectService.getProject(task.projectId);
    const type = NotificationType.FILE_ATTACHED_TO_TASK;
    const organizationId = project ? project.organizationId : null;

    const data: NotificationData = {
      projectId: task ? task.projectId : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
      taskId: task ? task.id : null,
      taskValue: task ? task.name : null,
      taskListId: list ? list.id : null,
      taskListValue: list ? list.name : null,
      ...(await this.createNotificationDataForFile(file)),
    };

    return await this.createNotificationsInAppForRecipients(
      type,
      recipientIds,
      data,
      activity.actorId,
      organizationId,
      taskId,
      activity.id
    );
  }

  async createDueDateNotification(task: TaskDbRow, recipientIds: Id[]): Promise<NotificationDbRow[]> {
    const project = await this.projectService.getProject(task.projectId);
    const data: NotificationData = await this.createNotificationDataForTask(task);
    const organizationId: Id = project.organizationId;
    const bot = await this.botProvider.getBotForOrganization(organizationId);
    if (!bot) {
      this.logger.info(`Not sending due date reminder because organization [${organizationId} does not have HeyBot`);
      return;
    }

    return await this.createNotificationsInAppForRecipients(
      NotificationType.DUE_DATE_REMINDER,
      recipientIds,
      data,
      bot.id,
      organizationId,
      task.id,
      null
    );
  }

  async createJoinedInvitationNotification(
    inviterId: Id,
    invitedUser: Partial<UserDbRow>,
    organizationId: Id,
    trx?: Transaction
  ): Promise<NotificationDbRow> {
    const data: NotificationData = {
      userId: invitedUser.id,
      userValue: invitedUser.email,
    };

    const bot = await this.botProvider.getBotForOrganization(organizationId, trx);
    if (!bot) {
      this.logger.info(`Not sending due date reminder because organization [${organizationId} does not have HeyBot`);
      return;
    }
    const results = await this.createNotificationsInAppForRecipients(
      NotificationType.INVITATION_JOINED,
      [inviterId],
      data,
      bot.id,
      organizationId,
      invitedUser.id,
      null,
      trx
    );
    return results[0];
  }

  protected async createNotificationsInAppForRecipients(
    type: NotificationType,
    recipientIds: Id[],
    data: NotificationData,
    actorId: Id,
    organizationId: Id,
    containerId: Id,
    activityId?: Id,
    trx?: Transaction
  ): Promise<NotificationDbRow[]> {
    recipientIds = await this.userInOrganizationProvider.filterOutDeactivatedUsers(organizationId, recipientIds, trx);
    recipientIds = await this.userService.filterOutBots(recipientIds, trx);
    const notifications = recipientIds.map((userId) =>
      this.createNotificationRow(userId, activityId, actorId, organizationId, type, data, containerId)
    );

    return await this.createNotificationsInApp(notifications, trx);
  }

  createNotificationRow(
    recipientId: Id,
    activityId: Id,
    actorId: Id,
    organizationId: Id,
    notificationType: NotificationType,
    data: NotificationData,
    containerId: Id
  ) {
    return {
      id: generateId(),
      recipientId,
      activityId,
      actorId,
      organizationId,

      notificationType,

      data,

      containerId,
    };
  }

  private async createNotificationDataForFile(file?: FileDbRow) {
    return {
      fileId: file ? file.id : null,
      fileValue: file ? file.name : null,
      fileIsImage: file ? file.contentType.indexOf('image/') === 0 : null,
      fileImageWidth: file ? file.width : null,
      fileImageHeight: file ? file.height : null,
      fileUrl: file ? file.url : null,
      // TODO Thumb size should not be here
      fileThumbUrl:
        file && file.contentType.indexOf('image/') === 0
          ? await this.fileService.generateThumbnailUrl(file, 360, 360, true)
          : null,
    } as NotificationData;
  }

  private async createNotificationDataForProject(project?: ProjectDbRow) {
    const data: NotificationData = {
      projectId: project ? project.id : null,
      projectValue: project ? project.name : null,
      projectType: project ? project.projectType : null,
    };
    return data;
  }

  private async createNotificationDataForTask(task: TaskDbRow): Promise<NotificationData> {
    const list = task.taskListId ? await this.listProvider.getList(task.taskListId) : null;
    const project = await this.projectService.getProject(task.projectId);

    const data: NotificationData = {
      taskValue: task.name,
      taskId: task.id,
      taskListId: task.taskListId,
      taskListValue: list ? list.name : null,
      ...(await this.createNotificationDataForProject(project)),
    };

    return data;
  }

  async createNotificationsInApp(
    notifications: Array<NotificationDbRow>,
    trx?: Transaction
  ): Promise<Array<NotificationDbRow>> {
    // Filter out notifications that are sent to user who performed action (aka friday night mode)
    notifications = await this.filterNotificationsToSend(notifications, trx);

    if (notifications.length === 0) {
      return [];
    }

    let result = [];
    const connection = trx || this.connection.getConnection();

    await connection.transaction(async (trx) => {
      result = await connection.insert(notifications).transacting(trx).into(Table.NOTIFICATION).returning('*');

      if (!(result instanceof Array)) {
        this.logger.error('Unexpected query result:', result);
      }

      const notificationIds = notifications.map((row) => ({ notificationId: row.id }));

      await connection.insert(notificationIds).transacting(trx).into(Table.NOTIFICATION_IN_APP);
    });

    await Promise.all(result.map((n) => this.sendNotifications(n, trx)));
    return result;
  }

  private async getRecipientsForTaskMessage(messageId: Id, taskId: Id): Promise<Id[]> {
    const { hails } = await this.messageService.getHails(messageId);
    const isHails = hails && hails.length > 0;
    const isOnlyOnlineUsersHail = getIsOnlyOnlineUsersHail(hails);

    if (isHails && !isOnlyOnlineUsersHail) {
      return []; // they will be notified by mention notification
    }

    let recipientIds = await this.followerService.getFollowersForTask(taskId);

    const { mentionedUserIds } = await this.messageService.getMentions(messageId);
    recipientIds = recipientIds.filter((userId) => !mentionedUserIds.includes(userId));

    if (isHails && isOnlyOnlineUsersHail) {
      const userIsOnlineMap = await this.sessionService.getOnlineStatuses(recipientIds);
      recipientIds = recipientIds.filter((userId) => !userIsOnlineMap[userId]); // online users will be notified by mention notification
    }

    return recipientIds;
  }

  private async getRecipientsForProjectMessage(messageId: Id, projectId: Id) {
    const people = (await this.projectPeopleService.getProjectPeople(projectId)).map((row) => row.userId);
    const mentionedUserIdsResult = await this.messageService.getMentions(messageId);
    let recipientIds = without(people, ...mentionedUserIdsResult.mentionedUserIds);
    const hailsResult = await this.messageService.getHails(messageId);
    if (hailsResult.hails.length > 0) {
      recipientIds = [];
    }
    return { people, recipientIds };
  }

  isGlobalNotification(notification: NotificationDbRow): boolean {
    return [NotificationType.GLOBAL, NotificationType.DUE_DATE_REMINDER, NotificationType.INVITATION_JOINED].includes(
      notification.notificationType
    );
  }

  /**
   * Filters out notifications that:
   *  - are sent to actor
   *  - are sent to users that did not complete their registration process
   * @param {Array<NotificationDbRow>} notifications
   * @return {Array<NotificationDbRow>}
   */
  private async filterNotificationsToSend(
    notifications: NotificationDbRow[],
    trx?: Transaction
  ): Promise<NotificationDbRow[]> {
    if (notifications.length === 0) {
      return [];
    }
    // 1st filter: Recipient IS NOT actor
    notifications = notifications.filter((n) => n.recipientId !== n.actorId);

    // 2nd filter: remove users that did not finish registration.
    const recipientIds = notifications.map((n) => n.recipientId);

    const registeredUserIds = uniq(
      (await this.userService.getUsersByIds(recipientIds, true, trx)).map((user) => user.id)
    );

    const chatNotificationSettings = await this.getChatNotificationsSettings(notifications, trx);

    notifications = this.filterByChatNotificationSettings(notifications, chatNotificationSettings);

    return notifications.filter((n) => registeredUserIds.indexOf(n.recipientId) >= 0);
  }

  private filterByChatNotificationSettings(
    notifications: NotificationDbRow[],
    recipientsChatNotificationsSettings: ChatNotificationSettingsDbRow[]
  ): NotificationDbRow[] {
    return notifications.filter((notification) => {
      const { notificationType } = notification;

      // chat notification settings apply only to mention and new message (so chat) notifications
      if (
        this.isGlobalNotification(notification) ||
        ![
          NotificationType.HAIL_MENTIONED,
          NotificationType.USER_MENTIONED,
          NotificationType.CONVERSATION_MESSAGE_SENT,
        ].includes(notificationType)
      ) {
        return true;
      }

      if (notification.data.projectType !== ProjectType.PROJECT) {
        return true;
      }

      const setting = recipientsChatNotificationsSettings.find(
        (setting: ChatNotificationSettingsDbRow) =>
          setting && setting.userId === notification.recipientId && setting.projectId === notification.data.projectId
      );
      const type = setting ? setting.chatNotificationSettingsType : this.options.defaultChatNotificationSettingsType;

      if (type === ChatNotificationSettingsType.NOTHING) {
        return false;
      }

      return notificationsAcceptedSettings[notificationType].includes(type);
    });
  }

  private async getChatNotificationsSettings(
    notifications: NotificationDbRow[],
    trx?: Transaction
  ): Promise<ChatNotificationSettingsDbRow[]> {
    const recipientIds = notifications.map((notification) => notification.recipientId);
    const projectIds = notifications
      .filter((notification) => !this.isGlobalNotification(notification))
      .map((notification) => notification.data.projectId);

    return await this.settingsService.getPeopleChatNotificationSettingsTypes(recipientIds, projectIds, trx);
  }

  private async sendNotifications(notification: NotificationDbRow, trx?: Transaction) {
    let settings: NotificationsDeliverySettingsJsonInterface =
      await this.settingsService.getNotificationsDeliverySettings(
        notification.recipientId,
        notification.organizationId,
        trx
      );
    if (!settings) {
      settings = DEFAULT_DELIVERY_SETTINGS;
    }
    // Starts promises for those transports
    const sendPromises = this.transports
      .filter((t) => settings[t.getNotificationMethod()])
      .map((t) => t.sendNotification(notification, trx));
    // Resolves them.
    await Promise.all(sendPromises);
  }
}
