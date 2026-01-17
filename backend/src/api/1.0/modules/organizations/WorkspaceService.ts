import { Id } from '../common/identifier'

import {
  CreateOrganizationResult,
  CreateOrganizationResultStatus,
  OrganizationJson,
  CreateWorkspaceResult,
  CreateWorkspaceResultStatus,
} from './types';
import { CreateBotStatus, CreateSampleSpaceResult, CreateSampleSpaceStatus } from '../bot/types'
import { CreateProjectStatus } from '../projects/types';
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface';
import { injectable, inject } from 'inversify';
import { OrganizationsModule } from './OrganizationsModule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { BotModule } from '../bot/BotModule';
import { WorkspaceServiceInterface } from './interfaces/WorkspaceServiceInterface';
import { BotProviderInterface } from '../bot/BotProviderInterface'

import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

@injectable()
export class WorkspaceService
implements WorkspaceServiceInterface {

  constructor(
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(BotModule.BotProviderInterface)
    private botProvider: BotProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {

  }

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
    userLanguage: string,
  ): Promise<CreateWorkspaceResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doCreateWorkspace(trx, userId, organizationId, organizationJson, userLanguage)
    })
  }

  async doCreateWorkspace(
    trx: Transaction,
    userId: Id,
    organizationId: Id,
    organizationJson: OrganizationJson,
    userLanguage: string,
  ): Promise<CreateWorkspaceResult> {
    const createOrganizationResult: CreateOrganizationResult = await this.organizationService.doCreateOrganization(
      trx,
      userId,
      organizationJson,
      organizationId,
    )

    if (createOrganizationResult.status === CreateOrganizationResultStatus.ORGANIZATION_ALREADY_EXISTS) {
      return {
        status: CreateWorkspaceResultStatus.ORGANIZATION_ALREADY_EXISTS,
      }
    } else if (createOrganizationResult.status === CreateOrganizationResultStatus.USER_NOT_FOUND) {
      return {
        status: CreateWorkspaceResultStatus.USER_NOT_FOUND,
      }
    }

    const botResult = await this.botProvider.createBotForOrganization(trx, organizationId);
    if (botResult.status !== CreateBotStatus.OK) {
      return { status: CreateWorkspaceResultStatus.BOT_NOT_CREATED }
    }
    const sampleProjectResult: CreateSampleSpaceResult = await this.botProvider.createSampleProject(trx, organizationId, botResult.botId, userLanguage);

    if (sampleProjectResult.status === CreateSampleSpaceStatus.SPACE_NOT_CREATED) {
      return { status: CreateWorkspaceResultStatus.SPACE_NOT_CREATED }
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
      }
    }


    return {
      status: CreateWorkspaceResultStatus.OK,
      organization,
      userInOrganization: createOrganizationResult.userInOrganization,
      projectId: createConversationResult.project.id,
      sampleProject: sampleProjectResult.project,
      subscription: null,
    }
  }


}
