import { Id } from '../common/identifier'
import { OrganizationRole, ProjectRole } from '../db/schema'

import {
  InviteUserToOrganizationAndCreateConversationResult,
  InviteUserToOrganizationAndCreateConversationResultStatus,
  InviteUserToOrganizationResultStatus,
  ResendInvitationToOrganizationResult,
  ResendInvitationToOrganizationStatus,
  UserInvitationJson,
  PrepareAndSendInvitationMailSatus,
  InviteGuestToOrganizationResult,
  InviteGuestToOrganizationStatus,
} from './types'
import { CreateProjectStatus, UserInProjectJson } from '../projects/types';
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface';
import { inject, injectable } from 'inversify';
import { OrganizationsModule } from './OrganizationsModule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { InvitationServiceInterface } from './interfaces/InvitationServiceInterface';
import { UserInvitationProviderInterface } from './interfaces/UserInvitationProviderInterface';
import { CommonModule } from '../common/CommonModule';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';

import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

const TIME_OFFSET_BETWEEN_RESENT_INVITATION = 60 * 5
@injectable()
export class InvitationService implements InvitationServiceInterface {

  constructor(
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(OrganizationsModule.UserInvitationProviderInterface)
    private userInvitationProvider: UserInvitationProviderInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
  }

  /**
   * Creates user, if not exists. Adds to provided organization and creates a project that is a conversation
   * between invitee and inviter.
   *
   * @param {Id} organizationId
   * @param {Id} projectId
   * @param {Id} currentUserId
   * @param {string} email
   * @param {Id} userId
   * @param {OrganizationRole} role
   * @return {Promise<InviteUserToOrganizationAndCreateConversationResult>}
   */
  async inviteUserToOrganizationAndCreateConversation(
    organizationId: Id,
    projectId: Id,
    currentUserId: Id,
    email: string,
    userId?: Id,
    role?: OrganizationRole,
    trx?: Transaction,
  ): Promise<InviteUserToOrganizationAndCreateConversationResult> {
    const connection = trx || this.connection.getConnection()
    return connection.transaction(async (trx) => {
      const inviteUserToOrganizationResult = await this.organizationService.doInviteUserToOrganization(
        trx,
        currentUserId,
        organizationId,
        email,
        userId,
        role,
      )


      switch (inviteUserToOrganizationResult.status) {
        case InviteUserToOrganizationResultStatus.EMAIL_TAKEN:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.EMAIL_TAKEN
          }
        case InviteUserToOrganizationResultStatus.USER_ALREADY_IN_ORGANIZATION:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.USER_ALREADY_IN_ORGANIZATION
          }
        case InviteUserToOrganizationResultStatus.ORGANIZATION_NOT_FOUND:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.ORGANIZATION_NOT_FOUND
          }
        case InviteUserToOrganizationResultStatus.INVITER_NOT_FOUND:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.INVITER_NOT_FOUND
          }
        case InviteUserToOrganizationResultStatus.INVITED_USER_NOT_FOUND:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.INVITED_USER_NOT_FOUND
          }
        case InviteUserToOrganizationResultStatus.USER_IS_NOT_WORKSPACE_OWNER:
          return {
            userId,
            status: InviteUserToOrganizationAndCreateConversationResultStatus.USER_IS_NOT_WORKSPACE_OWNER
          }
        case InviteUserToOrganizationResultStatus.USER_REACTIVATED: {
          let conversation = await this.conversationService.getConversation(organizationId, [currentUserId, inviteUserToOrganizationResult.user.id], trx)
          if (!conversation) {
            const createConversationResult = await this.conversationService.doCreateConversation(
              trx,
              currentUserId,
              [currentUserId, inviteUserToOrganizationResult.user.id],
              organizationId
            );
            conversation = createConversationResult.project
          }
          return {
            status: InviteUserToOrganizationAndCreateConversationResultStatus.OK,
            userId,
            user: inviteUserToOrganizationResult.user,
            project: conversation
          }
        }
        default: break;
      }

      userId = inviteUserToOrganizationResult.user.id;
      const createProjectResult = await this.conversationService.doCreateConversation(
        trx,
        currentUserId,
        [currentUserId, userId],
        organizationId
      );

      if (createProjectResult.status === CreateProjectStatus.PROJECT_ALREADY_EXISTS) {
        return {
          userId,
          status: InviteUserToOrganizationAndCreateConversationResultStatus.PROJECT_ALREADY_EXISTS
        }
      }

      const createSelfConversationResult = await this.conversationService.doCreateConversation(
        trx,
        userId,
        [userId],
        organizationId
      );

      if (createSelfConversationResult.status === CreateProjectStatus.PROJECT_ALREADY_EXISTS) {
        return {
          userId,
          status: InviteUserToOrganizationAndCreateConversationResultStatus.PROJECT_ALREADY_EXISTS
        }
      }


      return {
        status: InviteUserToOrganizationAndCreateConversationResultStatus.OK,
        userId,
        user: inviteUserToOrganizationResult.user,
        project: createProjectResult.project,
      }
    })
  }

  async inviteGuestToOrganization(organizationId: Id, projectIds: Id[], currentUserId: Id, email: string): Promise<InviteGuestToOrganizationResult> {
    return this.connection.getConnection().transaction(async (trx) => {

      if (!projectIds || projectIds.length === 0) {
        return {
          status: InviteGuestToOrganizationStatus.UNSPECITIFED_PROJECTS,
          email,
        }
      }

      const inviteUserToOrganizationAndCreateConversationResult = await this.inviteUserToOrganizationAndCreateConversation(
        organizationId,
        null,
        currentUserId,
        email,
        null,
        OrganizationRole.GUEST,
        trx
      )

      switch (inviteUserToOrganizationAndCreateConversationResult.status) {
        case InviteUserToOrganizationAndCreateConversationResultStatus.EMAIL_TAKEN:
          return {
            status: InviteGuestToOrganizationStatus.EMAIL_TAKEN,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.USER_ALREADY_IN_ORGANIZATION:
          return {
            status: InviteGuestToOrganizationStatus.USER_ALREADY_IN_ORGANIZATION,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.ORGANIZATION_NOT_FOUND:
          return {
            status: InviteGuestToOrganizationStatus.ORGANIZATION_NOT_FOUND,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.INVITER_NOT_FOUND:
          return {
            status: InviteGuestToOrganizationStatus.INVITER_NOT_FOUND,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.INVITED_USER_NOT_FOUND:
          return {
            status: InviteGuestToOrganizationStatus.INVITED_USER_NOT_FOUND,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.PROJECT_ALREADY_EXISTS:
          return {
            status: InviteGuestToOrganizationStatus.PROJECT_ALREADY_EXISTS,
            email,
          }
        case InviteUserToOrganizationAndCreateConversationResultStatus.USER_IS_NOT_WORKSPACE_OWNER:
          return {
            status: InviteGuestToOrganizationStatus.USER_IS_NOT_WORKSPACE_OWNER,
            email,
          }
        default: break;
      }

      const userId = inviteUserToOrganizationAndCreateConversationResult.user.id

      const addProjectPersonPromises = projectIds.map(async projectId => {
        const projectPerson: UserInProjectJson = {
          projectId,
          role: ProjectRole.MEMBER,
          userId,
        }
        return await this.projectPeopleService.doAddProjectPerson(trx, projectPerson, currentUserId)
      })

      const addProjectPersonResults = await Promise.all(addProjectPersonPromises)

      return {
        status: InviteGuestToOrganizationStatus.OK,
        user: inviteUserToOrganizationAndCreateConversationResult.user,
        email,
        projectsPerson: addProjectPersonResults,
        project: inviteUserToOrganizationAndCreateConversationResult.project,
      }
    })
  }

  async resentInvitationToOrganization(organizationId: Id, inviterId: Id, invitedUserId: Id): Promise<ResendInvitationToOrganizationResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      const getOrganizationResult = await this.organizationService.getOrganization(organizationId, trx);
      if (!getOrganizationResult.organization) {
        return {
          status: ResendInvitationToOrganizationStatus.ORGANIZATION_NOT_FOUND,
        }
      }

      const existingInvitation = await this.userInvitationProvider.getUserInvitation(inviterId, invitedUserId, organizationId, trx)

      const invitation: UserInvitationJson = {
        invitedUserId,
        inviterId,
        organizationId,
      }

      if (existingInvitation) {
        const currentTime = this.timeService.getCurrentTime()
        const diff = this.timeService.getDifferenceInSeconds(currentTime, existingInvitation.resentAt);
        if (existingInvitation.resentAt && diff < TIME_OFFSET_BETWEEN_RESENT_INVITATION) {
          return {
            status: ResendInvitationToOrganizationStatus.TOO_MANY_REQUESTS
          }
        }
        await this.userInvitationProvider.updateInvitation({
          ...invitation,
          resentCount: existingInvitation.resentCount + 1,
          resentAt: this.timeService.getCurrentTime(),
        }, trx)
      } else {
        await this.userInvitationProvider.createInvitation(invitation, trx);
      }

      const result = await this.organizationService.prepareAndSendInvitationMail(inviterId, invitedUserId, organizationId, true, trx)

      switch (result.status) {
        case PrepareAndSendInvitationMailSatus.INVITED_USER_NOT_FOUND:
          return {
            status: ResendInvitationToOrganizationStatus.INVITED_USER_NOT_FOUND
          }
        case PrepareAndSendInvitationMailSatus.INVITER_NOT_FOUND:
          return {
            status: ResendInvitationToOrganizationStatus.INVITER_NOT_FOUND
          }
        default:
          break;
      }

      return {
        status: ResendInvitationToOrganizationStatus.OK,
      }
    })
  }
}
