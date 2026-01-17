import { injectable, inject } from 'inversify';
import { ConversationServiceInterface } from './interfaces/ConversationServiceInterface';
import {
  TaskDbRow,
  ConversationSettingsDbRow,
  ProjectDbRow,
  ProjectType,
  UserInProjectDbRow,
  ProjectRole,
} from '../db/schema';
import { TasksModule } from '../tasks/TasksModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface';
import { ProjectsModule } from './ProjectsModule';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { QueryModifier, ConversationSettingsJson } from '../../../../services/types';

import { ConversationSettingsProviderInterface } from './interfaces/ConversationSettingsProviderInterface';
import {
  UpdateConversationSettingsResult,
  UpdateConversationSettingsResultStatus,
  CreateProjectResult,
  CreateProjectStatus,
  UserInProjectJson,
} from './types';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils';
import Table, { ForeignKey, UniqueKey } from '../db/Table';
import { pick, uniq, isEqual, sortBy } from 'lodash';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { Dict } from '../common/types';
import { CommonModule } from '../common/CommonModule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { OrganizationProjectsProviderInterface } from '../organizations/interfaces/OrganizationProjectsProviderInterface';
import { conversationsModifier } from './queryDecorators';

@injectable()
export class ConversationService implements ConversationServiceInterface {
  constructor(
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationSettingsProviderInterface)
    private conversationSettingsProvider: ConversationSettingsProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(OrganizationsModule.OrganizationProjectsProviderInterface)
    private organizationProjectsProvider: OrganizationProjectsProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  async getConversationTasks(
    projectId: Id,
    trx?: Transaction,
    queryDecorators?: QueryModifier[]
  ): Promise<TaskDbRow[]> {
    const projectPeople = await this.projectPeopleService.getProjectPeople(
      projectId
    );
    const projectPeopleIds = projectPeople.map(
      (projectPerson) => projectPerson.userId
    );
    const tasksIds = await this.taskProvider.getTasksIdsWhereAsignees(
      projectPeopleIds
    );
    return await this.taskProvider.getTasksByIds(
      tasksIds,
      trx,
      queryDecorators
    );
  }

  async getConversation(
    organizationId: Id,
    memberIds: Id[],
    trx?: Transaction
  ): Promise<ProjectDbRow> {
    memberIds = uniq(memberIds);
    const projectId = await this.generateConversationId(
      organizationId,
      memberIds,
      trx
    );
    return await this.projectProvider.getProject(projectId, trx);
  }

  async updateConversationSettings(
    userId: Id,
    conversationHash: string,
    organizationId: Id,
    settings: ConversationSettingsJson
  ): Promise<UpdateConversationSettingsResult> {
    settings = pick(settings, ['isVisible']);
    try {
      await this.connection.getConnection().transaction(async (trx) => {
        const old =
          await this.conversationSettingsProvider.getConversationSettings(
            userId,
            conversationHash,
            organizationId,
            trx
          );

        if (old) {
          await this.conversationSettingsProvider.updateConversationSettings(
            userId,
            conversationHash,
            organizationId,
            settings,
            trx
          );
        } else {
          await this.conversationSettingsProvider.createConversationSettings(
            userId,
            conversationHash,
            organizationId,
            settings,
            trx
          );
        }
      });
    } catch (error) {
      if (
        violatesForeignKey(error, ForeignKey.CONVERSATION_SETTINGS_USER_ID_FK)
      ) {
        return {
          status: UpdateConversationSettingsResultStatus.USER_NOT_FOUND,
        };
      } else if (
        violatesForeignKey(
          error,
          ForeignKey.CONVERSATION_SETTINGS_ORGANIZATION_ID_FK
        )
      ) {
        return {
          status: UpdateConversationSettingsResultStatus.ORGANIZATION_NOT_FOUND,
        };
      } else {
        throw error;
      }
    }

    return { status: UpdateConversationSettingsResultStatus.OK };
  }

  async getUserConversationsSettings(
    userId: Id,
    organizationId: Id,
    decorate?: QueryModifier,
    trx?: Transaction
  ): Promise<Partial<ConversationSettingsDbRow>[]> {
    const query = this.connection
      .getQueryWithTransaction(trx)
      .select(`${Table.CONVERSATION_SETTINGS}.*`)
      .from(Table.CONVERSATION_SETTINGS)
      .where({ userId, organizationId });

    if (decorate) {
      decorate(query);
    }

    return await query;
  }

  async getConversationsSettingsByHash(
    conversationHash: Id
  ): Promise<ConversationSettingsDbRow[]> {
    const query = this.connection
      .getQueryBuilder()
      .select()
      .from(Table.CONVERSATION_SETTINGS)
      .where({ conversationHash });

    return await query;
  }

  async getUserConversations(
    userId: Id,
    organizationId: Id
  ): Promise<ProjectDbRow[]> {
    return await this.organizationProjectsProvider.getOrganizationUserProjects(
      organizationId,
      userId,
      [conversationsModifier]
    );
  }

  async generateConversationId(
    organizationId: Id,
    memberIds: Id[],
    trx?: Transaction
  ): Promise<Id> {
    memberIds = uniq(memberIds);

    const projectType =
      memberIds.length > 2 ? ProjectType.GROUP_CHAT : ProjectType.DIRECT_CHAT;
    const usersInProjects = await this.connection
      .getQueryWithTransaction(trx)
      .select('projectId', 'userId')
      .from(Table.USER_IN_PROJECT)
      .join(
        Table.PROJECT,
        (join) =>
          join
            .on(`${Table.PROJECT}.id`, `${Table.USER_IN_PROJECT}.projectId`)
            .andOnIn(`${Table.PROJECT}.projectType`, [projectType]) // TODO: why .andOn is not working here?
      )
      .where(`${Table.PROJECT}.organizationId`, organizationId);
    const userIdsByProjectId: Dict<Id[]> = usersInProjects.reduce(
      (acc: Dict<Id[]>, row: UserInProjectDbRow) => {
        const { projectId, userId } = row;
        if (!acc[projectId]) {
          acc[projectId] = [];
        }
        acc[projectId].push(userId);
        return acc;
      },
      {}
    );

    let conversationId: Id = null;

    // TODO: maybe refactor to more obvious code
    for (let [projectId, userIds] of Object.entries(userIdsByProjectId)) {
      if (isEqual(sortBy(userIds), sortBy(memberIds))) {
        conversationId = projectId;
        break;
      }
    }

    if (!conversationId) {
      return this.idGenerator.generateId();
    }
    return conversationId;
  }

  generateConversationHash(organizationId: Id, memberIds: Id[]): Id {
    const usersArray = uniq(memberIds).sort();
    const usersString = `${usersArray.join('')}::${organizationId}`;
    return this.idGenerator.generateIdByString(usersString);
  }

  async getConversationSettings(
    userId: Id,
    conversationHash: string,
    organizationId: Id
  ): Promise<ConversationSettingsDbRow> {
    return await this.connection
      .getQueryBuilder()
      .first()
      .from(Table.CONVERSATION_SETTINGS)
      .where({ userId, conversationHash, organizationId });
  }

  async createConversation(
    creatorId: Id,
    memberIds: Id[],
    organizationId: Id
  ): Promise<CreateProjectResult> {
    return await this.connection.getConnection().transaction((trx) => {
      return this.doCreateConversation(
        trx,
        creatorId,
        memberIds,
        organizationId
      );
    });
  }

  async doCreateConversation(
    trx: Transaction,
    creatorId: Id,
    memberIds: Id[],
    organizationId: Id
  ): Promise<CreateProjectResult> {
    memberIds.push(creatorId);
    memberIds = uniq(memberIds);

    try {
      const projectId = await this.generateConversationId(
        organizationId,
        memberIds,
        trx
      );
      const project = await this.projectProvider.createProject(
        {
          id: projectId,
          creatorId,
          name: '',
          organizationId,
          isPrivate: true,
          projectType:
            memberIds.length > 2
              ? ProjectType.GROUP_CHAT
              : ProjectType.DIRECT_CHAT,
        },
        trx
      );

      const projectPeople: UserInProjectJson[] = memberIds.map(
        (memberId: Id): UserInProjectJson => ({
          userId: memberId,
          projectId: projectId,
          role: memberId === creatorId ? ProjectRole.OWNER : ProjectRole.MEMBER,
        })
      );

      await this.projectPeopleService.doAddProjectPersons(trx, projectPeople);

      return {
        status: CreateProjectStatus.OK,
        project,
      };
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.PROJECT_ID)) {
        return { status: CreateProjectStatus.PROJECT_ALREADY_EXISTS };
      }
      throw error;
    }
  }
}
