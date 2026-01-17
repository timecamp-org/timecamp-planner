import { Id } from '../common/identifier';

import { inject, injectable } from 'inversify';
import { ProjectsModule } from '../projects/ProjectsModule';
import { CreateProjectStatus } from '../projects/types';
import { OrganizationsModule } from './OrganizationsModule';
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface';
import { WorkspaceServiceInterface } from './interfaces/WorkspaceServiceInterface';
import {
  CreateOrganizationResult,
  CreateOrganizationResultStatus,
  CreateWorkspaceResult,
  CreateWorkspaceResultStatus,
  OrganizationJson,
} from './types';

import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

@injectable()
export class WorkspaceService implements WorkspaceServiceInterface {
  constructor(
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,

    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  /**
   * @param userId
   * @param {Id} organizationId
   * @param organizationJson
   * @return {Promise<CreateWorkspaceResult>}
   */
  async createWorkspace(
    userId: Id,
    organizationId: Id,
    organizationJson: OrganizationJson,
    userLanguage: string
  ): Promise<CreateWorkspaceResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doCreateWorkspace(trx, userId, organizationId, organizationJson, userLanguage);
    });
  }

  async doCreateWorkspace(
    trx: Transaction,
    userId: Id,
    organizationId: Id,
    organizationJson: OrganizationJson,
    userLanguage: string
  ): Promise<CreateWorkspaceResult> {
    const createOrganizationResult: CreateOrganizationResult = await this.organizationService.doCreateOrganization(
      trx,
      userId,
      organizationJson,
      organizationId
    );

    if (createOrganizationResult.status === CreateOrganizationResultStatus.ORGANIZATION_ALREADY_EXISTS) {
      return {
        status: CreateWorkspaceResultStatus.ORGANIZATION_ALREADY_EXISTS,
      };
    } else if (createOrganizationResult.status === CreateOrganizationResultStatus.USER_NOT_FOUND) {
      return {
        status: CreateWorkspaceResultStatus.USER_NOT_FOUND,
      };
    }

    const organization = createOrganizationResult.organization;
    const createConversationResult = await this.conversationService.doCreateConversation(
      trx,
      userId,
      [userId],
      organizationId
    );

    if (createConversationResult.status === CreateProjectStatus.PROJECT_ALREADY_EXISTS) {
      return {
        status: CreateWorkspaceResultStatus.PROJECT_ALREADY_EXISTS,
      };
    }

    return {
      status: CreateWorkspaceResultStatus.OK,
      organization,
      userInOrganization: createOrganizationResult.userInOrganization,
      projectId: createConversationResult.project.id,
      subscription: null,
    };
  }
}
