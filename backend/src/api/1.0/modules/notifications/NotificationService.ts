import { Id } from '../common/identifier'
import Table from '../db/Table'
import { first, isNil } from 'lodash';
import { EntityStatus } from '../common/enum'
import {
  DeviceType,
  NotificationDbRow,
  UnreadNotificationDbRow,
  ProjectDbRow,
  UserInProjectDbRow,
  ProjectType,
  UserLatestNotificationsDisplayFullDbRow,
} from '../db/schema'
import {
  GetNotifcationInAppResult,
  GetPushNotifcationResult, NotificationType,
  PaginatedUserNotifications,
  PushNotificationDeviceResult,
  PushNotificationDeviceResultStatus,
  ReadNotificationResultStatus,
  ReadNotificationsResult,
  UserOrganizationNotificationsResourceQueryParams,
} from './types'
import { QueryModifier } from '../../../../services/types';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { inject, injectable } from 'inversify';
import { ProjectsModule } from '../projects/ProjectsModule';
import { PaginationServiceInterface } from '../pagination/interfaces/PaginationServiceInterface';
import { PaginationModule } from '../pagination/PaginationModule';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { NotificationServiceInterface } from './interfaces/NotificationServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { RemoveProjectMemberEventData, UpdateProjectEventData } from '../projects/types';
;
import { ProjectTasksServiceInterface } from '../projects/interfaces/ProjectTasksServiceInterface';
import { NotificationsModule } from './NotificationsModule';
import { MessageQueuePublisherInterface } from '../messageQueue/interfaces/MessageQueuePublisherInterface';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { NotificationsJobFactoryInterface } from './interfaces/NotificationsJobFactoryInterface';
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface';
import { JobStatusServiceInterface } from '../messageQueue/interfaces/JobStatusServiceInterface';
import { JobNamespace } from '../messageQueue/types';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import {
  StandardPaginationToken,
  StandardPaginatorOptions
} from '../pagination/types';
import {
  notificationsRecipientsWithoutUsersModifier,
  notificationsRecipientModifier
} from './queryDecorators';
import { UserOrganizationNotificationsResource } from './resources/UserOrganizationNotificationsResource'
import { UserDisplayedNotificationsProviderInterface } from './interfaces/UserDisplayedNotificationsProviderInterface'
import { NotificationCenterType } from '../dict/types'
import { OrganizationsModule } from '../organizations/OrganizationsModule'
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface'
import { DictProvider } from '../dict/DictProvider'
import { Dict } from '../common/types';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { NotificationsProviderInterface } from './interfaces/NotificationsProviderInterface';


@injectable()
export class NotificationService
implements NotificationServiceInterface {

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectTasksServiceInterface)
    private projectTasksService: ProjectTasksServiceInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(NotificationsModule.NotificationsJobFactoryInterface)
    private jobFactory: NotificationsJobFactoryInterface,
    @inject(NotificationsModule.NotificationsQueue)
    private queue: QueueDescriptorInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    private jobStatusService: JobStatusServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(NotificationsModule.UserOrganizationNotificationsResource)
    private userOrganizationNotificationsResource: UserOrganizationNotificationsResource,
    @inject(NotificationsModule.NotificationsProviderInterface)
    private notificationsProvider: NotificationsProviderInterface,
    @inject(NotificationsModule.UserDisplayedNotificationsProviderInterface)
    private userDisplayedNotificationsProvider: UserDisplayedNotificationsProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(NotificationsModule.DictNotificationCenterType)
    private notificationCenterTypeDict: DictProvider<NotificationCenterType>,
  ) {
    this.attachToEntityEvents()
  }

  attachToEntityEvents() {
    this.projectPeopleService.removeProjectMemberEvent.attach(this.onRemoveProjectMember.bind(this));
    this.projectService.updateProjectEvent.attach(this.onUpdateProject.bind(this));
  }

  async onRemoveProjectMember(params: RemoveProjectMemberEventData): Promise<void> {
    const { projectId, userId, trx } = params
    const objectIds = await this.getProjectIdWithTaskIds(projectId, trx)

    await this.readUserUnreadNotificationsForObjects(objectIds, userId, undefined, trx)
  }

  async onUpdateProject(params: UpdateProjectEventData): Promise<void> {
    const { projectId, projectJson, trx } = params
    if (projectJson.status === EntityStatus.ARCHIVED) {
      const objectIds = await this.getProjectIdWithTaskIds(projectId, trx)

      await this.readUnreadNotificationsForObjects(objectIds, undefined, undefined, trx)
    }

    if (projectJson.isPrivate) {
      const projectPeopleIds = await this.projectPeopleService.getUserIdsInProject(projectId, trx)
      const objectIds = await this.getProjectIdWithTaskIds(projectId, trx)

      await this.readUnreadNotificationsForObjects(objectIds, notificationsRecipientsWithoutUsersModifier(projectPeopleIds), undefined, trx)
    }
  }

  private async getProjectIdWithTaskIds(projectId: Id, trx: Transaction): Promise<Id[]> {
    const projectTasks = await this.projectTasksService.getProjectTasks(projectId, trx)
    return projectTasks.map(task => task.id).concat(projectId)
  }

  async getNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    isArchived: boolean,
    page: string,
    limit: number,
    decorate?: QueryModifier,
  ): Promise<PaginatedUserNotifications> {
    let notificationsQuery = this.connection.getQueryBuilder()
      .from(Table.NOTIFICATION)
      .join(Table.NOTIFICATION_IN_APP, `${Table.NOTIFICATION}.id`, `${Table.NOTIFICATION_IN_APP}.notification_id`)
      .where(`${Table.NOTIFICATION}.recipient_id`, userId)
      .where(function () {
        this.where(`${Table.NOTIFICATION}.organization_id`, organizationId)
          .orWhereNull(`${Table.NOTIFICATION}.organization_id`)
      })

    if (!isNil(isArchived)) {
      notificationsQuery = notificationsQuery.where('isArchived', isArchived)
    }

    if (decorate) {
      decorate(notificationsQuery);
    }

    const paginator = this.standardPaginationService.getPaginator(page, { limit, columns: ['createdAt', 'id'] });

    const queryResult = await paginator.execute<NotificationDbRow>(notificationsQuery)
    let result = []
    result = queryResult.results

    return { data: result, page: queryResult.nextPage }
  }

  async getFilteredNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    queryParams: UserOrganizationNotificationsResourceQueryParams,
  ): Promise<any> {
    return await this.userOrganizationNotificationsResource.getData(queryParams, { userId, organizationId })
  }

  async getInAppNotification(id: Id): Promise<GetNotifcationInAppResult> {
    const notificationResults = await this.connection.getQueryBuilder()
      .select()
      .from(Table.NOTIFICATION)
      .where('id', id)
      ;

    const inAppResults = await this.connection.getQueryBuilder()
      .select()
      .from(Table.NOTIFICATION_IN_APP)
      .where('notificationId', id)
      ;

    return {
      inAppNotification: first(inAppResults),
      notification: first(notificationResults)
    }
  }

  async getPushNotification(id: Id): Promise<GetPushNotifcationResult> {
    const notificationResults = await this.connection.getQueryBuilder()
      .select()
      .from(Table.NOTIFICATION)
      .where('id', id)
      .first()
      ;

    const pushResults = await this.connection.getQueryBuilder()
      .select()
      .from(Table.NOTIFICATION_PUSH)
      .where('notificationId', id)
      .first()
      ;

    return {
      pushNotification: pushResults,
      notification: notificationResults
    }
  }

  async getUnreadNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id
  ): Promise<Array<UnreadNotificationDbRow>> {
    return await this.notificationsProvider.getUserUnreadNotifications(userId, organizationId)
  }

  async getAllUnreadNotifications(
    userId: Id,
  ): Promise<Array<UnreadNotificationDbRow>> {
    const unreadNotificationsPromise = this.notificationsProvider.getUserUnreadNotifications(userId)

    const userProjectIdsPromise = this.projectProvider.getAllUserVisibleProjectIds(userId)

    const [
      unreadNotifications,
      userProjectIds,
    ] = await Promise.all([
      unreadNotificationsPromise,
      userProjectIdsPromise,
    ])

    const filteredNotifications = unreadNotifications
      .filter(notification => {
        const { data } = notification
        if (!data.projectId) {
          return true
        }

        return userProjectIds.includes(data.projectId)
      })
    return filteredNotifications;
  }

  async readUnreadNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    readAt: number,
    notificationTypes = [],
  ): Promise<void> {
    const connection = this.connection.getConnection()
    const queryParams = {
      userId: connection.raw('?', userId),
      organizationId: connection.raw('?', organizationId),
      readAt: connection.raw('?', this.timeService.getTimeFromEpoch(readAt)),
    }

    const notificationTypesRaw = notificationTypes.map(type => `'${type}'`).join(',')

    let query = `UPDATE ${Table.NOTIFICATION_IN_APP} `
      + 'SET read_at = :readAt: '
      + `FROM ${Table.NOTIFICATION} `
      + `where ${Table.NOTIFICATION}.id = ${Table.NOTIFICATION_IN_APP}.notification_id `

    if (notificationTypes.length > 0) {
      query += `and ${Table.NOTIFICATION}.notification_type in (${notificationTypesRaw}) `
    }

    query += `and ${Table.NOTIFICATION_IN_APP}.read_at is null `
      + `and ${Table.NOTIFICATION_IN_APP}.is_archived = false `
      + `and ${Table.NOTIFICATION}.recipient_id = :userId: `
      + `and (${Table.NOTIFICATION}.organization_id = :organizationId: `
      + `or ${Table.NOTIFICATION}.organization_id is null) `
      + ';'
    return await connection.raw(query, queryParams)
  }

  async readUserUnreadNotificationsForObjects(
    containerIds: Id[],
    userId?: Id,
    readAt?: number,
    trx?: Transaction,
  ): Promise<ReadNotificationsResult> {
    return this.readUnreadNotificationsForObjects(containerIds, notificationsRecipientModifier(userId), readAt, trx)
  }

  async readUnreadNotificationsForObjects(
    containerIds: string[],
    modifier: QueryModifier = (q: QueryBuilder) => q,
    readAt = this.timeService.getCurrentEpoch(),
    trx?: Transaction,
  ): Promise<ReadNotificationsResult> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .whereNull(`${Table.NOTIFICATION_IN_APP}.read_at`)
      .whereIn('notificationId', function () {
        this.select('id')
          .from(Table.NOTIFICATION)
          .whereIn(`${Table.NOTIFICATION}.containerId`, containerIds)
          .modify(modifier)
      })
      .update({
        readAt: this.timeService.getTimeFromEpoch(readAt),
      })
      .table(Table.NOTIFICATION_IN_APP)

    return {
      status: ReadNotificationResultStatus.OK
    }
  }

  async updateNotification(
    notificationId: Id,
    readAt: number,
    isArchived: boolean = false
  ): Promise<ReadNotificationsResult> {
    const unreadNotificationUpdateResult = await this.connection.getQueryBuilder()
      .from(Table.NOTIFICATION_IN_APP)
      .where('notificationId', notificationId)
      .update({
        readAt: this.timeService.getTimeFromEpoch(readAt),
        isArchived,
      })
    if (!unreadNotificationUpdateResult) {
      return { status: ReadNotificationResultStatus.RESOURCE_NOT_EXIST }
    }

    return { status: ReadNotificationResultStatus.OK };
  }

  async archiveUserInOrganizationNotifications(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): Promise<void> {
    await this.jobStatusService.startNewJobIteration(JobNamespace.ARCHIVE_NOTIFICATIONS, userId, organizationId)
    await this.publishArchiveUserInOrganizationNotificationsJob(userId, organizationId, notificationTypesToArchive)
  }

  // TODO: Consider putting this to separate job service for notifications
  async publishArchiveUserInOrganizationNotificationsJob(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): Promise<void> {
    const job = this.jobFactory.createArchiveNotificationsJob(userId, organizationId, notificationTypesToArchive)
    await this.mqPublisher.publish(job, this.queue)
    await this.jobStatusService.incrementSpawnedJobs(JobNamespace.ARCHIVE_NOTIFICATIONS, userId, organizationId)
  }

  async addPushNotificationDevice(userId: Id, deviceId: Id, deviceType: DeviceType): Promise<PushNotificationDeviceResult> {
    const connection = this.connection.getConnection()
    return connection.transaction(async (trx) => {

      const pushDevice = await connection
        .select()
        .from(Table.NOTIFICATION_PUSH_DEVICE)
        .where({
          deviceId,
          userId,
        })
        .transacting(trx)
        .first()


      if (pushDevice) {
        await connection
          .from(Table.NOTIFICATION_PUSH_DEVICE)
          .where({
            deviceId,
            userId,
          })
          .update({
            status: EntityStatus.EXISTS,
            deviceType,
          })
          .transacting(trx)
      } else {
        const params = {
          table: Table.NOTIFICATION_PUSH_DEVICE,

          deviceId: connection.raw('?', deviceId),
          userId: connection.raw('?', userId),
          status: connection.raw('?', EntityStatus.EXISTS),
          deviceType: connection.raw('?', deviceType),
        }
        await trx.raw(
          'INSERT INTO :table: (device_id, user_id, status, device_type)' +
          'VALUES (:deviceId:, :userId:, :status:, :deviceType:)' +
          'ON CONFLICT (device_id, user_id) DO UPDATE SET ' +
          'status = :status:, device_type = :deviceType:'
          ,
          params
        )
      }

      return { status: PushNotificationDeviceResultStatus.OK };
    })
  }

  async removePushNotificationDevice(userId: Id, deviceId: Id): Promise<PushNotificationDeviceResult> {
    const connection = this.connection.getConnection()
    return connection.transaction(async (trx) => {

      const pushDevice = await connection
        .select()
        .from(Table.NOTIFICATION_PUSH_DEVICE)
        .where({
          deviceId,
          userId,
        })
        .transacting(trx)
        .first()


      if (pushDevice) {
        await connection
          .from(Table.NOTIFICATION_PUSH_DEVICE)
          .where({
            deviceId,
            userId,
          })
          .update({
            status: EntityStatus.DELETED,
          })
          .transacting(trx)
      }

      return { status: PushNotificationDeviceResultStatus.OK };
    })
  }

  async getUserHasAccessToProjectNotifications(userId: Id, projectId: Id): Promise<boolean> {
    const project = await this.projectService.getProject(projectId)
    const projectPeople = await this.projectPeopleService.getProjectPeople(projectId)

    return this.hasUserAccessToProjectNotifications(userId, project, projectPeople)
  }

  async filterUsersWithoutAccessToProjectNotifications(userIds: Id[], projectId: Id): Promise<string[]> {
    const project = await this.projectService.getProject(projectId)
    const projectPeople = await this.projectPeopleService.getProjectPeople(projectId)

    return userIds.filter(userId => this.hasUserAccessToProjectNotifications(userId, project, projectPeople))
  }

  hasUserAccessToProjectNotifications(userId: Id, project: ProjectDbRow, projectPeople: UserInProjectDbRow[]): boolean {
    if (project.status === EntityStatus.ARCHIVED && project.isPrivate) {
      return false
    }

    if (project.projectType === ProjectType.PROJECT && !project.isPrivate) {
      return true
    }


    const userInProject = projectPeople.find(projectPerson => projectPerson.userId === userId)
    return Boolean(userInProject)
  }

  async getUserInOrganizationLatestNotificationsDisplay(userId: Id, organizationId: Id, notificationCenterTypes: NotificationCenterType[]): Promise<UserLatestNotificationsDisplayFullDbRow[]> {
    const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId)

    const notificationCenterTypeIds = await this.notificationCenterTypeDict.getItemIdsByValues(notificationCenterTypes)

    return await this
      .userDisplayedNotificationsProvider
      .getUserInOrganizationLatestNotificationsDisplay(userInOrganizationId, notificationCenterTypeIds)
  }

  async getUserLatestAllNotificationsDisplay(userId: Id, notificationCenterTypes: NotificationCenterType[]): Promise<Dict<UserLatestNotificationsDisplayFullDbRow[]>> {
    const notificationCenterTypeIds = await this.notificationCenterTypeDict.getItemIdsByValues(notificationCenterTypes)

    return await this
      .userDisplayedNotificationsProvider
      .getUserLatestAllNotificationsDisplay(userId, notificationCenterTypeIds)
  }

  async saveUserInOrganizationLatestNotificationDisplay(userId: Id, organizationId: Id, notificationCenterType: NotificationCenterType, lastDisplayTime?: number): Promise<void> {
    const displayedAt = lastDisplayTime
      ? this.timeService.getTimeFromEpoch(lastDisplayTime)
      : this.timeService.getCurrentTime()
    const [
      { id: userInOrganizationId },
      { id: notificationCenterTypeId },
    ] = await Promise.all([
      this.userInOrganizationProvider.getUserInOrganization(userId, organizationId),
      this.notificationCenterTypeDict.getItemByValue(notificationCenterType)
    ])

    const updatedRows = await this.userDisplayedNotificationsProvider.updateUserLatestNotificationsDisplayTimestamp(userInOrganizationId, notificationCenterTypeId, displayedAt)

    if (updatedRows === 0) {
      await this.userDisplayedNotificationsProvider.createUserLatestNotificationsDisplayTimestamp({
        userInOrganizationId,
        notificationCenterTypeId,
        displayedAt,
      })
    }

  }


}
