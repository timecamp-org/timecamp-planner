import { ChatWithMeServiceInterface } from './interfaces/ChatWithMeServiceInterface';
import { inject, injectable } from 'inversify';
import {
  GetBasicInvitationDataResult,
  GetBasicInvitationDataStatus,
  JoinOrganizationAsGuestAndCreateSpaceResult,
  JoinOrganizationAsGuestAndCreateSpaceStatus,
} from './types';
import { CreateWorkspaceResultStatus } from '../organizations/types';
import {
  CustomFieldTargetType,
  CustomFieldValueDbRow,
  OrganizationRole,
  UserDbRow,
  UserInOrganizationDbRow
} from '../db/schema';
import { CreateProjectStatus } from '../projects/types';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { WorkspaceServiceInterface } from '../organizations/interfaces/WorkspaceServiceInterface';
import { CustomFieldServiceInterface } from '../extensions/interfaces/CustomFieldServiceInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { UsersModule } from '../users/UsersModule';
import { CommonModule } from '../common/CommonModule';
import { ExtensionsModule } from '../extensions/ExtensionsModule';


import { ExtensionNamespace, SetCustomFieldValueStatus } from '../extensions/types';
import { EntityStatus } from '../common/enum';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { NotificationFactoryInterface } from '../notifications/interfaces/NotificationFactoryInterface';
import { NotificationsModule } from '../notifications/NotificationsModule';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { ChatWithMeModule } from './ChatWithMeModule';
import { ChatWithMeCustomFieldsProviderInterface } from './interfaces/ChatWithMeCustomFieldsProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';
import { CustomFieldProviderInterface } from '../extensions/interfaces/CustomFieldProviderInterface';
import { ExtensionProviderInterface } from '../extensions/interfaces/ExtensionProviderInterface';

@injectable()
export class ChatWithMeService implements ChatWithMeServiceInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    protected organizationProvider: OrganizationProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    protected userService: UserServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    protected userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
    protected idGenerator: IdGeneratorInterface<Id>,
    @inject(OrganizationsModule.WorkspaceServiceInterface)
    protected workspaceService: WorkspaceServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    protected customFieldService: CustomFieldServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    protected projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    protected conversationService: ConversationServiceInterface,
    @inject(NotificationsModule.NotificationFactoryInterface)
    protected notificationFactory: NotificationFactoryInterface,
    @inject(ChatWithMeModule.ChatWithMeCustomFieldsProviderInterface)
    protected chatWithMeCustomFieldsProvider: ChatWithMeCustomFieldsProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(ExtensionsModule.CustomFieldProviderInterface)
    private customFieldProvider: CustomFieldProviderInterface,
    @inject(ExtensionsModule.ExtensionProviderInterface)
    private extensionProvider: ExtensionProviderInterface,
  ) {
  }

  async joinOrganizationAsGuestAndCreateSpace(
    invitedUserId: Id,
    token: string,
    userLanguage: string,
  ): Promise<JoinOrganizationAsGuestAndCreateSpaceResult> {
    return this.connection.getConnection().transaction(async (trx) => {

      const inviterUserInOrganization = await this.getUserInOrganizationFromToken(token, trx)
      if (!inviterUserInOrganization) {
        return {
          status: JoinOrganizationAsGuestAndCreateSpaceStatus.NOT_PERMITTED
        }
      }

      const { userId: inviterId, role: inviterRole, organizationId } = inviterUserInOrganization


      if (invitedUserId === inviterId || inviterRole === OrganizationRole.GUEST) {
        return {
          status: JoinOrganizationAsGuestAndCreateSpaceStatus.INVALID_INVITER_ROLE
        }
      }

      const organization = organizationId ? await this.organizationProvider.getOrganization(organizationId, trx) : null
      if (!organization) {
        return {
          status: JoinOrganizationAsGuestAndCreateSpaceStatus.ORGANIZATION_NOT_FOUND,
        }
      }

      const inviter = inviterId ? await this.userService.getUserById(inviterId, trx) : null
      if (!inviter) {
        return {
          status: JoinOrganizationAsGuestAndCreateSpaceStatus.USER_NOT_FOUND,
        }
      }

      let invitedUser: Partial<UserDbRow>;

      if (invitedUserId) {
        invitedUser = await this.userService.getUserById(invitedUserId, trx);
      }

      if (!invitedUser) {
        return {
          status: JoinOrganizationAsGuestAndCreateSpaceStatus.USER_NOT_FOUND,
        }
      }

      let userOrganizations = await this.organizationProvider.getOrganizationsForUser(invitedUser.id, trx)
      let userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(invitedUser.id, organizationId, trx);

      if (!userInOrganization) {
        userInOrganization = await this.userInOrganizationProvider.createUserInOrganization({
          userId: invitedUser.id,
          organizationId,
          role: OrganizationRole.GUEST
        }, trx)
      }

      if (userInOrganization.entityStatus === EntityStatus.DELETED) {
        await this.handleDeletedOrganizationUser(userInOrganization, trx)
      }

      const conversationMembers = [inviter.id, invitedUser.id]

      let conversation = await this.conversationService.getConversation(organizationId, conversationMembers, trx)

      if (!conversation) {
        const createConversationResult = await this.conversationService.doCreateConversation(trx, inviterId, conversationMembers, organizationId)
        switch (createConversationResult.status) {
          case CreateProjectStatus.OK: {
            conversation = createConversationResult.project
            break;
          }
          case CreateProjectStatus.ORGANIZATION_NOT_FOUND:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.ORGANIZATION_NOT_FOUND,
            }
          case CreateProjectStatus.PROJECT_ALREADY_EXISTS:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.PROJECT_ALREADY_EXISTS,
            }
          default:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.CONVERSATION_NOT_CREATED,
            }
        }
      }

      const selfConversation = await this.conversationService.getConversation(organizationId, [invitedUserId], trx)

      if (!selfConversation) {
        const createSelfConversationResult = await this.conversationService.doCreateConversation(
          trx,
          invitedUserId,
          [invitedUserId],
          organizationId
        );

        if (createSelfConversationResult.status === CreateProjectStatus.PROJECT_ALREADY_EXISTS) {
          return {
            status: JoinOrganizationAsGuestAndCreateSpaceStatus.PROJECT_ALREADY_EXISTS
          }
        }
      }

      const { status } = await this.customFieldService.doSetValue(
        trx,
        CustomFieldTargetType.USER_IN_ORGANIZATION,
        userInOrganization.id,
        `${ExtensionNamespace.CHAT_WITH_ME}.inviterId`,
        inviterId,
        inviterId,
      )

      switch (status) {
        case SetCustomFieldValueStatus.OK:
          break;
        case SetCustomFieldValueStatus.CUSTOM_FIELD_DOES_NOT_EXIST:
          return {
            status: JoinOrganizationAsGuestAndCreateSpaceStatus.CUSTOM_FIELD_DOES_NOT_EXIST,
          }
        case SetCustomFieldValueStatus.CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED:
          return {
            status: JoinOrganizationAsGuestAndCreateSpaceStatus.CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED,
          }
        case SetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST:
          return {
            status: JoinOrganizationAsGuestAndCreateSpaceStatus.NAMESPACE_DOES_NOT_EXIST,
          }
        case SetCustomFieldValueStatus.UNKNOWN_TARGET_TYPE:
          return {
            status: JoinOrganizationAsGuestAndCreateSpaceStatus.UNKNOWN_TARGET_TYPE,
          }
      }

      if (userOrganizations.length === 0) {
        const newOrganizationId = this.idGenerator.generateId()
        const createWorkspaceResult = await this.workspaceService.doCreateWorkspace(trx, invitedUser.id, newOrganizationId, {
          name: 'My Company'
        }, userLanguage)

        switch (createWorkspaceResult.status) {
          case CreateWorkspaceResultStatus.OK: {
            break;
          }
          case CreateWorkspaceResultStatus.ORGANIZATION_ALREADY_EXISTS:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.ORGANIZATION_ALREADY_EXISTS,
            }
          case CreateWorkspaceResultStatus.USER_NOT_FOUND:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.USER_NOT_FOUND,
            }
          case CreateWorkspaceResultStatus.BOT_NOT_CREATED:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.BOT_NOT_CREATED,
            }
          case CreateWorkspaceResultStatus.PROJECT_ALREADY_EXISTS:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.PROJECT_ALREADY_EXISTS,
            }
          case CreateWorkspaceResultStatus.SPACE_NOT_CREATED:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.SPACE_NOT_CREATED,
            }
          case CreateWorkspaceResultStatus.USER_ALREADY_IN_PROJECT:
            return {
              status: JoinOrganizationAsGuestAndCreateSpaceStatus.USER_ALREADY_IN_PROJECT,
            }
        }
      }

      userOrganizations = await this.organizationProvider.getOrganizationsForUser(invitedUser.id, trx)

      await this.notificationFactory.createJoinedInvitationNotification(inviterId, invitedUser, organizationId, trx);

      return {
        status: JoinOrganizationAsGuestAndCreateSpaceStatus.OK,
        invitedUser,
        conversation,
        userOrganizations
      }
    })
  }

  private async handleDeletedOrganizationUser(userInOrganization: UserInOrganizationDbRow, trx: Transaction): Promise<void> {
    this.logger.debug('User deleted from workspace. Enabling and converting to a guest');
    userInOrganization.entityStatus = EntityStatus.EXISTS
    userInOrganization.role = OrganizationRole.GUEST

    await this.projectPeopleService.deleteUserFromOrganizationSpaces(userInOrganization.userId, userInOrganization.organizationId, userInOrganization.userId, trx)

    await this.userInOrganizationProvider.updateUserInOrganization(userInOrganization.organizationId, userInOrganization.userId, userInOrganization, trx)
  }

  async getBasicInvitationData(token: string): Promise<GetBasicInvitationDataResult> {
    const userInOrganization = await this.getUserInOrganizationFromToken(token)

    if (!userInOrganization) {
      return {
        status: GetBasicInvitationDataStatus.NOT_PERMITTED,
      }
    }
    const organization = await this.organizationProvider.getOrganization(userInOrganization.organizationId);

    if (!organization) {
      return {
        status: GetBasicInvitationDataStatus.ORGANIZATION_NOT_FOUND,
      }
    }

    const user = await this.userService.getUserById(userInOrganization.userId)
    if (!user) {
      return {
        status: GetBasicInvitationDataStatus.USER_NOT_FOUND,
      }
    }

    return {
      status: GetBasicInvitationDataStatus.OK,
      user: this.userService.getPublicUserData(user),
      userInOrganization,
      organization,
    }
  }

  private async getUserInOrganizationFromToken(token: string, trx?: Transaction): Promise<UserInOrganizationDbRow> {
    const invitationToken = await this.chatWithMeCustomFieldsProvider.getInvitationTokenDbRow(token, trx)

    if (!invitationToken) {
      return null
    }
    
    return await this.userInOrganizationProvider.getUserInOrganizationById(invitationToken.userInOrganizationId, trx)
  }

  async getCurrentOrganizationChatWithMeInvites(organizationId: Id, trx?: Transaction): Promise<CustomFieldValueDbRow[]> {
    const allUsersInOrganization =
      await this.userInOrganizationProvider.getOrganizationUsersByOrganizationId(organizationId)

    const allUsersInOrganizationIds = allUsersInOrganization.map(user => user.id)

    const chatWithMeExtension = await this.extensionProvider.getExtensionByNamespace(ExtensionNamespace.CHAT_WITH_ME)
    const inviterIdCustomField = await this.customFieldProvider.getCustomFieldByName(
      chatWithMeExtension.id,
      CustomFieldTargetType.USER_IN_ORGANIZATION,
      'inviterId',
      trx,
    )

    const currentOrganizationChatWithMeInvites = await this.customFieldProvider.getCustomFieldValues(
      inviterIdCustomField.id,
      CustomFieldTargetType.USER_IN_ORGANIZATION,
      q => q.whereIn('target_id', allUsersInOrganizationIds),
      trx,
    )

    return currentOrganizationChatWithMeInvites
  }


}
