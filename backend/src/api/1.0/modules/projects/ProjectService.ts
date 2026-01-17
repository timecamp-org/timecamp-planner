import Table, { UniqueKey } from '../db/Table';

import { MessageDbRow, ProjectDbRow, ProjectRole, ProjectType, ListDbRow } from '../db/schema';
import { violatesUniqueKey } from '../../../../utils';
import { ProjectServiceInterface } from './interfaces/ProjectServiceInterface';
import {
  CreateProjectResult,
  CreateProjectStatus,
  GetUserArchivedProjectsViewDataResult,
  GetUserArchivedProjectsViewDataStatus,
  GetUserProjectsResult,
  GetUserProjectsStatus,
  OrganizationIdByProjectId,
  ProjectJson,
  ProjectsHaveUnreadMessagesResult,
  ProjectsHaveUnreadMessagesResultStatus,
  UpdateProjectResult,
  UpdateProjectStatus,
  CopySpaceOptions,
  CopySpaceResult,
  CopySpaceStatus,
  ProjectRelatedSourceData,
  UpdateProjectEventData,
  ProjectQueryParams,
  ProjectResourceContext,
  ProjectResourceData,
  GetProjectWithMetadataResult,
  GetProjectWithMetadataStatus,
  UserInProjectJson,
} from './types';
import { inject, injectable } from 'inversify';
import { CommonModule } from '../common/CommonModule';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { QueryModifier } from '../../../../services/types';

import { UsersModule } from '../users/UsersModule';
import { UserServiceInterface } from '../users/UserServiceInterface';

import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { archivedProjectsQueryModifier } from './queryDecorators';
import { GetOrganizationProjectsResultStatus } from '../organizations/types';
import { EntityStatus } from '../common/enum';
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface';
import { ProjectsModule } from './ProjectsModule';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { ListServiceInterface } from '../lists/interfaces/ListServiceInterface';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { EventDelegate } from '../../../../utils/EventDelegate';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { unarchivedListModifier } from '../lists/queryDecorators';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface';
import { UserInProjectProviderInterface } from './interfaces/UserInProjectProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface';
import { SetProjectLatestVisitStatus, SetProjectLatestVisitResult } from './types';
import { ProjectLatestVisitProviderInterface } from './interfaces/ProjectLatestVisitProviderInterface';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { isEmpty } from 'lodash';

const defaultCopySpaceOptions: CopySpaceOptions = {
  shouldCopyListFollowers: false,
  shouldCopyTaskFollowers: false,
  shouldCopyTaskPeople: false,
};

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public updateProjectEvent: EventDelegate<UpdateProjectEventData>;

  constructor(
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ListsModule.ListServiceInterface)
    private listService: ListServiceInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(ActivitiesModule.ActivityServiceInterface)
    private activityService: ActivityServiceInterface,
    @inject(ProjectsModule.ProjectResource)
    private projectResource: ResourceInterface<ProjectQueryParams, ProjectResourceContext, ProjectResourceData>,
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ProjectsModule.LastViewedProjectProvider)
    private lastViewedProjectProvider: ProjectLatestVisitProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface
  ) {
    this.updateProjectEvent = new EventDelegate<UpdateProjectEventData>(logger);
  }

  async getProject(id: Id, trx?: Transaction): Promise<ProjectDbRow> {
    return await this.projectProvider.getProject(id, trx);
  }

  async getProjectWithMetadata(id: Id, queryParams: ProjectQueryParams): Promise<GetProjectWithMetadataResult> {
    const data = await this.projectResource.getData(queryParams, {
      projectId: id,
    });

    if (!data.project) {
      return {
        status: GetProjectWithMetadataStatus.PROJECT_NOT_FOUND,
      };
    }

    return {
      status: GetProjectWithMetadataStatus.OK,
      data,
    };
  }

  async createProject(id: Id, userId: Id, projectJson: ProjectJson, trx?: Transaction): Promise<CreateProjectResult> {
    try {
      if (!projectJson.organizationId) {
        return { status: CreateProjectStatus.ORGANIZATION_NOT_FOUND };
      }
      const projectRow: ProjectDbRow = {
        ...projectJson,
        id,
        creatorId: userId,
        startDate: projectJson.startDate ? this.timeService.getTimeFromEpoch(projectJson.startDate) : undefined,
        dueDate: projectJson.dueDate ? this.timeService.getTimeFromEpoch(projectJson.dueDate) : undefined,
        status: EntityStatus.EXISTS,
      };

      const project = await this.projectProvider.createProject(projectRow, trx);

      return { status: CreateProjectStatus.OK, project };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.PROJECT_ID)) {
        return { status: CreateProjectStatus.PROJECT_ALREADY_EXISTS };
      }
      throw error;
    }
  }

  async createProjects(projects: ProjectDbRow[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query.insert(projects).into(Table.PROJECT);
  }

  async createProjectWithPeople(
    id: Id,
    userId: Id,
    projectJson: ProjectJson,
    projectPersons?: UserInProjectJson[]
  ): Promise<CreateProjectResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      const result = await this.createProject(id, userId, projectJson, trx);

      // Backwards compatibility
      if (!projectPersons) {
        projectPersons = [
          {
            projectId: id,
            role: ProjectRole.OWNER,
            userId: userId,
          },
        ];
      }
      await this.projectPeopleService.doAddProjectPersons(trx, projectPersons);
      return result;
    });
  }

  async getProjectRelatedSourceData(projectId: Id): Promise<ProjectRelatedSourceData> {
    const project = await this.getProject(projectId);
    const projectLists = await this.listProvider.getProjectLists(projectId, null, unarchivedListModifier);

    return {
      project,
      projectLists,
    };
  }

  async copySpaceWithChildren(
    projectId: Id,
    userId: Id,
    name: string,
    options?: CopySpaceOptions
  ): Promise<CopySpaceResult> {
    const copySpaceOptions = Object.assign({}, defaultCopySpaceOptions, options);

    const projectRelatedSourceData = await this.getProjectRelatedSourceData(projectId);

    const newProjectId = this.idGenerator.generateId();
    if (!projectRelatedSourceData.project) {
      return { status: CopySpaceStatus.PROJECT_NOT_FOUND };
    }

    const newProject: ProjectDbRow = {
      ...projectRelatedSourceData.project,
      id: newProjectId,
      name: name || projectRelatedSourceData.project.name,
    };

    await this.insertProjectRelatedObjects(newProject, projectRelatedSourceData.projectLists, userId, copySpaceOptions);

    return { status: CopySpaceStatus.OK };
  }

  async insertProjectRelatedObjects(
    newProject: ProjectDbRow,
    projectLists: ListDbRow[],
    userId: Id,
    options: CopySpaceOptions
  ) {
    await this.connection.getConnection().transaction(async (trx) => {
      await this.projectProvider.createProject(newProject, trx);

      await this.projectPeopleService.doAddProjectPerson(
        trx,
        {
          userId,
          projectId: newProject.id,
          role: ProjectRole.OWNER,
        },
        userId
      );

      const copyListPromises = projectLists.map((list) => {
        return this.listService.copyListWithTasks(list.id, userId, newProject.id, null, null, null, options, trx);
      });

      await Promise.all(copyListPromises);
    });
  }

  async updateProject(id: Id, projectJson, actorId?: Id): Promise<UpdateProjectResult> {
    let status = null;

    await this.connection.getConnection().transaction(async (trx) => {
      const old = await this.projectProvider.getProject(id, trx);

      if (!old) {
        status = UpdateProjectStatus.PROJECT_NOT_FOUND;
        return;
      }

      if (projectJson.startDate) {
        projectJson.startDate = this.timeService.getTimeFromEpoch(projectJson.startDate);
      }
      if (projectJson.dueDate) {
        projectJson.dueDate = this.timeService.getTimeFromEpoch(projectJson.dueDate);
      }

      await this.updateProjectEvent.triggerEvent({
        projectId: id,
        projectJson,
        projectBeforeUpdate: old,
        trx,
      });

      await this.projectProvider.updateProject(id, projectJson, trx);

      await this.activityService.createActivityProjectUpdated(id, actorId, { new: projectJson, old }, trx);

      status = UpdateProjectStatus.OK;
    });

    return { status };
  }

  static isProjectConversation(project: ProjectDbRow): boolean {
    return [ProjectType.DIRECT_CHAT, ProjectType.GROUP_CHAT].includes(project.projectType);
  }

  async getUserProjectsUnreadMessages(userId: Id): Promise<ProjectsHaveUnreadMessagesResult> {
    const connection = this.connection.getConnection();
    const query = connection
      .select(`${Table.MESSAGE}.organization_id`, `${Table.MESSAGE}.container_id`)
      .from(`${Table.MESSAGE}`)
      .join(Table.PROJECT_MESSAGE_READ, function () {
        this.on(`${Table.PROJECT_MESSAGE_READ}.project_id`, '=', `${Table.MESSAGE}.container_id`)
          .andOnIn(`${Table.PROJECT_MESSAGE_READ}.user_id`, [userId])
          .andOn(
            connection.raw(
              `(${Table.PROJECT_MESSAGE_READ}.timestamp < ${Table.MESSAGE}.created_at OR ${Table.PROJECT_MESSAGE_READ}.timestamp IS NULL)`
            )
          );
      })
      .join(Table.USER_IN_PROJECT, function () {
        this.on(`${Table.PROJECT_MESSAGE_READ}.project_id`, '=', `${Table.USER_IN_PROJECT}.projectId`).andOn(
          `${Table.USER_IN_PROJECT}.userId`,
          '=',
          connection.raw('?', userId)
        );
      })
      .groupBy(`${Table.MESSAGE}.organization_id`, `${Table.MESSAGE}.container_id`);
    const unreadContainerIdsRows: MessageDbRow[] = await query;
    const projectsHaveUnreadMessages = {};
    const organizationIdByProjectId: OrganizationIdByProjectId = {};

    unreadContainerIdsRows.forEach((msg) => {
      projectsHaveUnreadMessages[msg.containerId] = true;
      organizationIdByProjectId[msg.containerId] = msg.organizationId;
    });

    return {
      status: ProjectsHaveUnreadMessagesResultStatus.OK,
      projectsHaveUnreadMessages,
      organizationIdByProjectId,
    };
  }

  async getProjectIdsInOrganizationWithUnreadMessages(organizationId: Id, userId: Id): Promise<Id[]> {
    return await this.projectProvider.getProjectIdsInOrganizationWithUnreadMessages(organizationId, userId);
  }

  /**
   * Get all accessible projects for user
   * @param {Id} organizationId
   * @param {Id} userId
   * @param decorate
   * @return {Promise<GetUserProjectsResult>}
   */
  async getUserProjects(
    organizationId: Id,
    userId: Id,
    decorate?: QueryModifier,
    withConversations: boolean = true
  ): Promise<GetUserProjectsResult> {
    const organization = await this.organizationProvider.getOrganization(organizationId);

    if (!organization) {
      return {
        status: GetUserProjectsStatus.ORGANIZATION_NOT_FOUND,
      };
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      return {
        status: GetUserProjectsStatus.USER_NOT_FOUND,
      };
    }

    const connection = this.connection.getConnection();
    const query = connection
      .select(`${Table.PROJECT}.*`)
      .table(Table.PROJECT)
      .leftJoin(Table.USER_IN_PROJECT, function () {
        this.on(`${Table.PROJECT}.id`, '=', `${Table.USER_IN_PROJECT}.projectId`).andOn(
          `${Table.USER_IN_PROJECT}.userId`,
          '=',
          connection.raw('?', userId)
        );
      })
      .where({ organization_id: organizationId })
      .andWhere(function () {
        this.andWhere('projectType', ProjectType.PROJECT).andWhere(function () {
          this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`).orWhere('isPrivate', false);
        });

        if (withConversations) {
          this.orWhere(function () {
            this.whereNotNull(`${Table.USER_IN_PROJECT}.userId`).andWhere('projectType', 'in', [
              ProjectType.GROUP_CHAT,
              ProjectType.DIRECT_CHAT,
            ]);
          });
        }
      });

    if (decorate) {
      decorate(query);
    }

    const projects = await query;

    return {
      status: GetUserProjectsStatus.OK,
      projects,
    };
  }

  async getUserArchivedProjectsViewData(
    organizationId: Id,
    userId: Id
  ): Promise<GetUserArchivedProjectsViewDataResult> {
    const getProjectsResult = await this.getUserProjects(organizationId, userId, archivedProjectsQueryModifier, false);

    switch (getProjectsResult.status) {
      case GetUserProjectsStatus.USER_NOT_FOUND:
        return {
          status: GetUserArchivedProjectsViewDataStatus.USER_NOT_FOUND,
        };

      case GetUserProjectsStatus.ORGANIZATION_NOT_FOUND:
        return {
          status: GetUserArchivedProjectsViewDataStatus.ORGANIZATION_NOT_FOUND,
        };

      default:
        break;
    }

    const projectIds = getProjectsResult.projects.map((project) => project.id);
    const projectsPeopleQueryModifier: QueryModifier = (q) => q.andWhere(`${Table.PROJECT}.id`, 'in', projectIds);

    const projectsPeopleResult = await this.projectPeopleService.getOrganizationProjectsPeople(
      organizationId,
      projectsPeopleQueryModifier
    );

    switch (projectsPeopleResult.status) {
      case GetOrganizationProjectsResultStatus.ORGANIZATION_NOT_FOUND:
        return {
          status: GetUserArchivedProjectsViewDataStatus.ORGANIZATION_NOT_FOUND,
        };

      default:
        break;
    }

    return {
      status: GetUserArchivedProjectsViewDataStatus.OK,
      projects: getProjectsResult.projects,
      projectsPeople: projectsPeopleResult.organizationProjectsPeople,
    };
  }

  async hasUserAccessToProject(userId: Id, projectId: Id, projectDbRow?: ProjectDbRow): Promise<boolean> {
    const userInProject = await this.userInProjectProvider.getUserInProject(userId, projectId);
    const project = projectDbRow || (await this.projectProvider.getProject(projectId));
    if (!project) {
      return true;
    }

    const isUserInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(
      project.organizationId,
      userId
    );
    return isUserInOrganization && (!project.isPrivate || !!userInProject);
  }

  async getInitialProjectId(userId: Id, organizationId: Id): Promise<Id> {
    const lastViewedProjectEntity = await this.lastViewedProjectProvider.getProjectLatestVisit(userId, organizationId);
    if (isEmpty(lastViewedProjectEntity)) {
      return await this.projectProvider.getFirstUserVisibleProjectId(userId, organizationId);
    } else {
      return lastViewedProjectEntity.projectId;
    }
  }

  async setProjectLatestVisit(userId: Id, projectId: Id): Promise<SetProjectLatestVisitResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      const project = await this.projectProvider.getProject(projectId, trx);
      if (!project) {
        return {
          status: SetProjectLatestVisitStatus.PROJECT_NOT_FOUND,
        };
      }

      const organization = await this.organizationProvider.getOrganization(project.organizationId, trx);

      if (!organization) {
        return {
          status: SetProjectLatestVisitStatus.ORGANIZATION_NOT_FOUND,
        };
      }

      const userInProject = await this.userInProjectProvider.getUserInProject(userId, projectId, trx);

      if (!userInProject) {
        return {
          status: SetProjectLatestVisitStatus.USER_NOT_IN_PROJECT,
        };
      }

      const userInProjectId = userInProject.id;

      await this.lastViewedProjectProvider.insertOrUpdateProjectLatestVisit(
        userId,
        project.organizationId,
        projectId,
        userInProjectId,
        trx
      );

      return {
        status: SetProjectLatestVisitStatus.OK,
      };
    });
  }
}
