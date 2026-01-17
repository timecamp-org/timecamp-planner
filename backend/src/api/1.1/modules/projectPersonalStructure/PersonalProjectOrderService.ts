import { Id } from '../common/identifier';
import { PersonalProjectOrderServiceInterface } from './interfaces/PersonalProjectOrderServiceInterface';
import {
  DeleteProjectGroupEventData,
  PersonalProjectOrderJson,
  ProjectOrderMap,
  ProjectPersonalContainerType,
  UpdateOrganizationProjectOrderResult,
  UpdateOrganizationProjectOrderResultStatus,
} from './types';
import { inject, injectable } from 'inversify';

import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ProjectPersonalStructureModule } from './ProjectPersonalStructureModule';
import { PersonalProjectOrderProviderInterface } from './interfaces/PersonalProjectOrderProviderInterface';
import { ProjectInGroupProviderInterface } from './interfaces/ProjectInGroupProviderInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { OrderServiceInterface } from '../order/OrderServiceInterface';
import { OrderModule } from '../order/OrderModule';
import { OrderServiceFactoryInterface } from '../order/OrderServiceFactoryInterface';
import {
  ChatNotificationSettingsType,
  ProjectDbRow,
  ProjectInGroupDbRow,
  ProjectType,
  UserProjectOrderDbRow,
} from '../db/schema';
import Table from '../db/Table';
import { chain, isEmpty, keyBy } from 'lodash';
import { EntityStatus } from '../common/enum';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { defaultOrderInterval } from '../order/OrderService';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { AddProjectMemberEventData, RemoveProjectMemberEventData, UpdateProjectEventData } from '../projects/types';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { PersonalProjectGroupServiceInterface } from './interfaces/PersonalProjectGroupServiceInterface';
import { PersonalProjectGroupProviderInterface } from './interfaces/PersonalProjectGroupProviderInterface';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { MessageQueuePublisherInterface } from '../messageQueue/interfaces/MessageQueuePublisherInterface';
import { JobStatusServiceInterface } from '../messageQueue/interfaces/JobStatusServiceInterface';
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface';
import { JobNamespace } from '../messageQueue/types';
import { ProjectsJobFactoryInterface } from '../projects/interfaces/ProjectsJobFactoryInterface';
import { OrganizationProjectsProviderInterface } from '../organizations/interfaces/OrganizationProjectsProviderInterface';
import { existingProjectsUserAssignedToModifier } from '../projects/queryDecorators';
import { NotificationsModule } from '../notifications/NotificationsModule';
import { NotificationSettingsServiceInterface } from '../notifications/interfaces/NotificationSettingsServiceInterface';

@injectable()
export class PersonalProjectOrderService implements PersonalProjectOrderServiceInterface {
  private orderServiceForLooseProjectOrder: OrderServiceInterface;
  private orderServiceForGroupedProjectOrder: OrderServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    private orderFactoryService: OrderServiceFactoryInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectOrderProviderInterface)
    private personalProjectOrderProvider: PersonalProjectOrderProviderInterface,
    @inject(ProjectPersonalStructureModule.ProjectInGroupProviderInterface)
    private projectInGroupProvider: ProjectInGroupProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupServiceInterface)
    private personalProjectGroupService: PersonalProjectGroupServiceInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface)
    private personalProjectGroupProvider: PersonalProjectGroupProviderInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    private jobStatusService: JobStatusServiceInterface,
    @inject(ProjectsModule.ProjectsQueue)
    private queue: QueueDescriptorInterface,
    @inject(ProjectsModule.ProjectsJobFactoryInterface)
    private jobFactory: ProjectsJobFactoryInterface,
    @inject(OrganizationsModule.OrganizationProjectsProviderInterface)
    private organizationProjectsProvider: OrganizationProjectsProviderInterface,
    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private notificationSettingsService: NotificationSettingsServiceInterface
  ) {
    this.attachToEntityEvents();

    this.orderServiceForLooseProjectOrder = this.orderFactoryService.create<UserProjectOrderDbRow>(
      Table.USER_PROJECT_ORDER,
      'userInOrganizationId',
      'order'
    );

    this.orderServiceForGroupedProjectOrder = this.orderFactoryService.create<ProjectInGroupDbRow>(
      Table.PROJECT_IN_GROUP,
      'groupId',
      'order'
    );
  }

  protected attachToEntityEvents() {
    this.logger.info('Attached to entity events');
    this.projectPeopleService.addProjectMemberEvent.attach(this.onAddProjectMember.bind(this));
    this.projectPeopleService.removeProjectMemberEvent.attach(this.onRemoveProjectMember.bind(this));
    this.personalProjectGroupService.deletePersonalProjectGroupEvent.attach(this.onDeleteProjectGroup.bind(this));
    this.projectService.updateProjectEvent.attach(this.onUpdateProject.bind(this));
  }

  async getPersonalProjectStructure(userInOrganizationId: Id, trx?: Transaction): Promise<ProjectOrderMap> {
    const looseProjectOrders = await this.getLooseProjectsMap(userInOrganizationId, trx);
    const groupedProjectOrders = await this.getGroupedProjectsMap(userInOrganizationId, trx);

    return {
      ...looseProjectOrders,
      ...groupedProjectOrders,
    };
  }

  private async getLooseProjectsMap(userInOrganizationId: Id, trx?: Transaction): Promise<ProjectOrderMap> {
    const allLooseProjectOrders = await this.personalProjectOrderProvider.getProjectsOrderForUserInOrganization(
      userInOrganizationId,
      trx
    );

    return chain(allLooseProjectOrders)
      .keyBy('projectId')
      .mapValues((orderedProject: UserProjectOrderDbRow) => ({
        order: orderedProject.order,
        containerType: ProjectPersonalContainerType.LOOSE,
      }))
      .value();
  }

  private async getGroupedProjectsMap(userInOrganizationId: Id, trx?: Transaction): Promise<ProjectOrderMap> {
    const allGroupedProjectOrders = await this.projectInGroupProvider.getProjectsInGroupsForUserInOrganization(
      userInOrganizationId,
      trx
    );

    return chain(allGroupedProjectOrders)
      .keyBy('projectId')
      .mapValues((orderedProject: ProjectInGroupDbRow) => ({
        order: orderedProject.order,
        containerType: ProjectPersonalContainerType.GROUP,
        containerId: orderedProject.groupId,
      }))
      .value();
  }

  async updatePersonalProjectOrder(
    personalProjectOrder: PersonalProjectOrderJson
  ): Promise<UpdateOrganizationProjectOrderResult> {
    const connection = this.connection.getConnection();
    return connection.transaction(async (trx) => {
      const { userId, organizationId, projectId, order, targetContainerType, targetContainerId } = personalProjectOrder;

      const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        organizationId,
        trx
      );

      if (!targetContainerType || !order) {
        return {
          status: UpdateOrganizationProjectOrderResultStatus.MISSING_PARAMETER,
        };
      }

      const projectOrder = await this.getPersonalProjectStructure(userInOrganizationId, trx);
      if (isEmpty(projectOrder)) {
        await this.establishInitialOrder(organizationId, userId, userInOrganizationId, trx);
      }

      const projectInGroup = await this.projectInGroupProvider.getProjectInGroup(projectId, userInOrganizationId, trx);
      const projectOrderEntity = await this.personalProjectOrderProvider.getProjectOrderEntity(
        userInOrganizationId,
        projectId,
        trx
      );

      if (projectInGroup && projectOrderEntity) {
        await this.personalProjectOrderProvider.deleteProjectOrderEntity(userInOrganizationId, projectId, trx);
      }

      const currentContainerType = projectInGroup
        ? ProjectPersonalContainerType.GROUP
        : ProjectPersonalContainerType.LOOSE;

      if (
        currentContainerType === ProjectPersonalContainerType.GROUP &&
        targetContainerType === ProjectPersonalContainerType.GROUP
      ) {
        return await this.moveProjectBetweenGroups(
          projectId,
          projectInGroup.id,
          projectInGroup.groupId,
          targetContainerId,
          order,
          trx
        );
      }

      if (
        currentContainerType === ProjectPersonalContainerType.GROUP &&
        targetContainerType === ProjectPersonalContainerType.LOOSE
      ) {
        return await this.moveProjectFromGroupToLoose(
          userInOrganizationId,
          projectId,
          order,
          projectInGroup.groupId,
          trx
        );
      }

      if (
        currentContainerType === ProjectPersonalContainerType.LOOSE &&
        targetContainerType === ProjectPersonalContainerType.LOOSE
      ) {
        return await this.moveLooseProject(userInOrganizationId, projectId, order, trx);
      }

      if (
        currentContainerType === ProjectPersonalContainerType.LOOSE &&
        targetContainerType === ProjectPersonalContainerType.GROUP
      ) {
        return await this.moveLooseProjectToGroup(
          userId,
          userInOrganizationId,
          projectId,
          order,
          targetContainerId,
          trx
        );
      }
    });
  }

  private async establishInitialOrder(
    organizationId: Id,
    userId: Id,
    userInOrganizationId: Id,
    trx: Transaction,
    projectIdToExclude?: Id
  ): Promise<UserProjectOrderDbRow[]> {
    const organization = await this.organizationProvider.getOrganization(organizationId, trx);

    const projectsToOrder = await this.organizationProjectsProvider.getOrganizationUserProjects(
      organization.id,
      userId,
      [existingProjectsUserAssignedToModifier(userId)],
      ['id', 'name'],
      trx
    );

    const notificationSettings = await this.notificationSettingsService.getUserChatNotificationSettingsTypes(
      userId,
      trx
    );
    const notificationSettingsMapped = keyBy(notificationSettings, 'projectId');

    const projectsMapped = chain(projectsToOrder)
      .filter((project) => project.id !== projectIdToExclude)
      .map((project: ProjectDbRow) => {
        const notificationSetting = notificationSettingsMapped[project.id]?.chatNotificationSettingsType;
        const isMuted = notificationSetting === ChatNotificationSettingsType.NOTHING;
        return {
          ...project,
          isMuted,
        };
      })
      .value();

    const projectsSorted = projectsMapped.sort((projectA, projectB) => {
      if (projectA.isMuted && !projectB.isMuted) {
        return 1;
      }

      if (!projectA.isMuted && projectB.isMuted) {
        return -1;
      }

      const projectNameA = projectA.name.toUpperCase() || '';
      const projectNameB = projectB.name.toUpperCase() || '';
      return projectNameA < projectNameB ? -1 : projectNameA > projectNameB ? 1 : 0;
    });

    const personalProjectOrder = projectsSorted.map((project: ProjectDbRow, index: number) => ({
      projectId: project.id,
      userInOrganizationId,
      order: (index + 1) * defaultOrderInterval,
    }));

    if (!personalProjectOrder.length) {
      return [];
    }

    return await this.personalProjectOrderProvider.insertPersonalProjectOrderEntries(personalProjectOrder, trx);
  }

  private async moveLooseProject(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    trx: Transaction
  ): Promise<UpdateOrganizationProjectOrderResult> {
    const projectOrderEntity = await this.personalProjectOrderProvider.getProjectOrderEntity(
      userInOrganizationId,
      projectId,
      trx
    );

    if (projectOrderEntity) {
      await this.personalProjectOrderProvider.updatePersonalProjectOrderEntry(
        userInOrganizationId,
        projectId,
        order,
        trx
      );
      await this.orderServiceForLooseProjectOrder.moveItemsToMakeRoomInTheList(
        trx,
        projectOrderEntity.id,
        userInOrganizationId,
        order
      );
    } else {
      const { id: newProjectOrderId } = await this.personalProjectOrderProvider.insertPersonalProjectOrderEntry(
        userInOrganizationId,
        projectId,
        order,
        trx
      );
      await this.orderServiceForLooseProjectOrder.moveItemsToMakeRoomInTheList(
        trx,
        newProjectOrderId,
        userInOrganizationId,
        order
      );
    }

    return {
      status: UpdateOrganizationProjectOrderResultStatus.OK,
    };
  }

  private async moveLooseProjectToGroup(
    userId: Id,
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    targetGroupId: Id,
    trx: Transaction
  ): Promise<UpdateOrganizationProjectOrderResult> {
    if (!targetGroupId) {
      return {
        status: UpdateOrganizationProjectOrderResultStatus.MISSING_PARAMETER,
      };
    }

    await this.personalProjectOrderProvider.deleteProjectOrderEntity(userInOrganizationId, projectId, trx);

    const { id: projectInGroupId } = await this.projectInGroupProvider.insertProjectInGroup(
      {
        userId,
        projectId,
        groupId: targetGroupId,
        order,
      },
      trx
    );

    await this.orderServiceForGroupedProjectOrder.moveItemsToMakeRoomInTheList(
      trx,
      projectInGroupId,
      targetGroupId,
      order
    );

    return {
      status: UpdateOrganizationProjectOrderResultStatus.OK,
    };
  }

  private async moveProjectFromGroupToLoose(
    userInOrganizationId: Id,
    projectId: Id,
    order: number,
    currentGroupId: Id,
    trx: Transaction
  ): Promise<UpdateOrganizationProjectOrderResult> {
    await this.projectInGroupProvider.deleteProjectFromGroup(projectId, currentGroupId, trx);

    const { id: projectOrderId } = await this.personalProjectOrderProvider.insertPersonalProjectOrderEntry(
      userInOrganizationId,
      projectId,
      order,
      trx
    );

    await this.orderServiceForLooseProjectOrder.moveItemsToMakeRoomInTheList(
      trx,
      projectOrderId,
      userInOrganizationId,
      order
    );
    return {
      status: UpdateOrganizationProjectOrderResultStatus.OK,
    };
  }

  private async moveProjectBetweenGroups(
    projectId: Id,
    projectInGroupId: Id,
    currentGroupId: Id,
    targetGroupId: Id,
    order: number,
    trx: Transaction
  ): Promise<UpdateOrganizationProjectOrderResult> {
    if (!targetGroupId) {
      return {
        status: UpdateOrganizationProjectOrderResultStatus.MISSING_PARAMETER,
      };
    }
    await this.projectInGroupProvider.updateProjectInGroup(
      projectId,
      currentGroupId,
      { groupId: targetGroupId, order },
      trx
    );

    await this.orderServiceForGroupedProjectOrder.moveItemsToMakeRoomInTheList(
      trx,
      projectInGroupId,
      targetGroupId,
      order
    );

    return {
      status: UpdateOrganizationProjectOrderResultStatus.OK,
    };
  }

  async onAddProjectMember(params: AddProjectMemberEventData) {
    const { projectId, userId, trx } = params;

    const { organizationId, projectType } = await this.projectProvider.getProject(projectId, trx);

    if (projectType !== ProjectType.PROJECT) {
      return;
    }

    await this.placeProjectOnTop(userId, organizationId, projectId, trx);
  }

  async placeProjectOnTop(userId: Id, organizationId: Id, projectId: Id, trx?: Transaction) {
    const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(
      userId,
      organizationId,
      trx
    );

    const projectInGroup = await this.projectInGroupProvider.getProjectInGroup(projectId, userInOrganizationId, trx);
    if (projectInGroup) {
      throw new Error('Cannot place already grouped project on top of loose spaces');
    }

    let order;
    const currentLooseOrder = await this.getLooseProjectsMap(userInOrganizationId, trx);
    if (isEmpty(currentLooseOrder)) {
      order = defaultOrderInterval;

      const groupedOrder = await this.getGroupedProjectsMap(userInOrganizationId, trx);
      if (isEmpty(groupedOrder)) {
        await this.establishInitialOrder(organizationId, userId, userInOrganizationId, trx, projectId);
      }
    } else {
      const firstProject = chain(currentLooseOrder).sortBy('order').first().value();

      order = firstProject.order;
    }

    await this.moveLooseProject(userInOrganizationId, projectId, order, trx);
  }

  private async getLowestOrderForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): Promise<number> {
    const [firstProject] = await this.personalProjectOrderProvider.getProjectsOrderForUserInOrganization(
      userInOrganizationId,
      trx
    );

    return firstProject ? firstProject.order : defaultOrderInterval;
  }

  async onDeleteProjectGroup(params: DeleteProjectGroupEventData): Promise<void> {
    const { groupId, trx } = params;

    const { userInOrganizationId } = await this.personalProjectGroupProvider.getPersonalProjectGroup(groupId, trx);
    const projectsInGroup = await this.projectInGroupProvider.getOrderedProjectsInAGroup(groupId, trx);

    await this.orderServiceForLooseProjectOrder.moveItemsToMakeRoomForMultipleEntries(
      trx,
      projectsInGroup.length,
      userInOrganizationId
    );

    const lowestOrder = await this.getLowestOrderForUserInOrganization(userInOrganizationId, trx);
    const projectOrderItems = projectsInGroup.reverse().map((projectInGroup: ProjectInGroupDbRow, index) => ({
      projectId: projectInGroup.projectId,
      userInOrganizationId,
      order: lowestOrder - (index + 1) * defaultOrderInterval,
    }));

    if (projectOrderItems.length) {
      await this.personalProjectOrderProvider.insertPersonalProjectOrderEntries(projectOrderItems, trx);
    }
  }

  async onUpdateProject(params: UpdateProjectEventData): Promise<void> {
    const { projectJson, projectId, projectBeforeUpdate, trx } = params;
    const { organizationId } = await this.projectService.getProject(projectId, trx);

    const isProjectBeingArchived =
      projectJson.status === EntityStatus.ARCHIVED && projectBeforeUpdate?.status !== EntityStatus.ARCHIVED;
    if (isProjectBeingArchived) {
      await this.removeProjectFromOrderTables(trx, projectId);
    }
    const isProjectBeingUnarchived =
      projectJson.status !== EntityStatus.ARCHIVED && projectBeforeUpdate?.status === EntityStatus.ARCHIVED;
    if (isProjectBeingUnarchived) {
      await this.jobStatusService.startNewJobIteration(
        JobNamespace.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE,
        null,
        organizationId,
        trx
      );
      await this.publishDetermineOrderForUnarchivedSpaceJob(projectId, organizationId, null, trx);
    }
  }

  async publishDetermineOrderForUnarchivedSpaceJob(
    projectId: Id,
    organizationId: Id,
    lastUserId?: Id,
    trx?: Transaction
  ): Promise<void> {
    const job = this.jobFactory.createDetermineOrderForUnarchivedSpaceJob(projectId, organizationId, lastUserId);
    await this.mqPublisher.publish(job, this.queue);
    await this.jobStatusService.incrementSpawnedJobs(
      JobNamespace.DETERMINE_ORDER_FOR_UNARCHIVED_SPACE,
      null,
      organizationId,
      1,
      trx
    );
  }

  async onRemoveProjectMember(params: RemoveProjectMemberEventData): Promise<void> {
    const { userId, projectId, trx } = params;
    const { organizationId } = await this.projectService.getProject(projectId, trx);
    const { id: userInOrganizationId } = await this.userInOrganizationProvider.getUserInOrganization(
      userId,
      organizationId,
      trx
    );

    const projectInGroup = await this.projectInGroupProvider.getProjectInGroup(projectId, userInOrganizationId, trx);
    if (projectInGroup) {
      await this.projectInGroupProvider.deleteProjectFromGroup(projectId, projectInGroup.groupId, trx);
    }

    const projectOrder = await this.personalProjectOrderProvider.getProjectOrderEntity(
      userInOrganizationId,
      projectId,
      trx
    );
    if (projectOrder) {
      await this.personalProjectOrderProvider.deleteProjectOrderEntity(userInOrganizationId, projectId, trx);
    }
  }

  private async removeProjectFromOrderTables(trx: Transaction, projectId) {
    await this.personalProjectOrderProvider.deleteProjectOrderByProjectId(projectId, trx);
    await this.projectInGroupProvider.deleteProjectsFromGroupsByProjectId(projectId, trx);
  }
}
