import { UserInOrganizationServiceInterface } from "./interfaces/UserInOrganizationServiceInterface";
import { OrganizationRole, PublicUserDbRow, UserInOrganizationDbRow } from "../db/schema";
import { OrganizationsModule } from "./OrganizationsModule";
import { UserInOrganizationProviderInterface } from "./interfaces/UserInOrganizationProviderInterface";
import { TokenServiceInterface } from "../token/TokenServiceInterface";
import { inject, injectable } from "inversify";
import { TokenModule } from "../token/TokenModule";
import {
  CheckIfUserIsOrganizationAdminStatus,
  CheckIfUserIsOrganizationAdminStatusResult,
  CheckIfUserIsOrganizationGuestStatus,
  CheckIfUserIsOrganizationGuestStatusResult,
  CheckIfUserIsOrganizationOwnerStatus,
  CheckIfUserIsOrganizationOwnerStatusResult,
  DeactivateUserFromWorkspaceResult,
  DeactivateUserFromWorkspaceStatus,
  GetOrganizationOwnerIdResult,
  GetOrganizationOwnerIdStatus,
  ReactivateUserFromWorkspaceResult,
  ReactivateUserFromWorkspaceStatus,
  UpdateUserRoleResult,
  UpdateUserRoleStatus,
  CheckIfUserIsOrganizationMemberStatusResult,
  CheckIfUserIsOrganizationMemberStatus,
} from './types'
import { Id } from '../common/identifier'
import { ChatWithMeModule } from '../chatWithMe/ChatWithMeModule'

import { EntityStatus } from '../common/enum'

import { ChatWithMeCustomFieldsProviderInterface } from "../chatWithMe/interfaces/ChatWithMeCustomFieldsProviderInterface";
import { ConnectionInterface } from "../db/ConnectionInterface";
import { DbModule } from "../db/DbModule";
import Table from "../db/Table";
import { UsersModule } from "../users/UsersModule";
import { UserServiceInterface } from "../users/UserServiceInterface";
import { ProjectsModule } from '../projects/ProjectsModule'
import { UserInProjectProviderInterface } from '../projects/interfaces/UserInProjectProviderInterface'
import { GuestInProjectServiceInterface } from '../projects/interfaces/GuestInProjectServiceInterface'
import { existingProjectsWithoutConversationsModifier } from '../projects/queryDecorators'

@injectable()
export class UserInOrganizationService implements UserInOrganizationServiceInterface {

  constructor(
    @inject(TokenModule.TokenServiceInterface)
    protected tokenService: TokenServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    protected provider: UserInOrganizationProviderInterface,
    @inject(ChatWithMeModule.ChatWithMeCustomFieldsProviderInterface)
    protected chatWithMeCustomFieldsProvider: ChatWithMeCustomFieldsProviderInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(ProjectsModule.GuestInProjectServiceInterface)
    private guestInProjectService: GuestInProjectServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(UsersModule.UserServiceInterface)
    protected userService: UserServiceInterface,
  ) { }

  async getOrganizationOwnerId(organizationId: Id, trx?: Transaction): Promise<GetOrganizationOwnerIdResult> {
    const userId = await this.provider.getOrganizationOwner(organizationId, trx)

    if (!userId) {
      return {
        status: GetOrganizationOwnerIdStatus.USER_IN_ORGANIZATION_NOT_FOUND,
      }
    }

    return {
      status: GetOrganizationOwnerIdStatus.OK,
      userId,
    }
  }

  async checkIfUserIsOrganizationOwner(userId: Id, organizationId: Id, trx?: Transaction): Promise<CheckIfUserIsOrganizationOwnerStatusResult> {
    const { status, userId: organizationOwnerId } = await this.getOrganizationOwnerId(organizationId, trx)

    if (status === GetOrganizationOwnerIdStatus.USER_IN_ORGANIZATION_NOT_FOUND) {
      return {
        status: CheckIfUserIsOrganizationOwnerStatus.USER_IN_ORGANIZATION_NOT_FOUND
      }
    }

    return {
      status: CheckIfUserIsOrganizationOwnerStatus.OK,
      userIsOrganizationOwner: userId === organizationOwnerId
    }
  }

  async checkIfUserIsOrganizationAdmin(userId: Id, organizationId: Id, trx?: Transaction): Promise<CheckIfUserIsOrganizationAdminStatusResult> {
    const userInOrganization = await this.provider.getUserInOrganization(userId, organizationId, trx)
    if (!userInOrganization) {
      return {
        status: CheckIfUserIsOrganizationAdminStatus.USER_IN_ORGANIZATION_NOT_FOUND,
      }
    }

    const isUserOrganizationOwnerResult = await this.checkIfUserIsOrganizationOwner(userId, organizationId, trx)

    return {
      status: CheckIfUserIsOrganizationAdminStatus.OK,
      userIsOrganizationAdmin: userInOrganization.entityStatus === EntityStatus.EXISTS && (userInOrganization.role === OrganizationRole.ADMIN || isUserOrganizationOwnerResult.userIsOrganizationOwner)
    }
  }

  async checkIfUserIsOrganizationMember(userId: Id, organizationId: Id, trx?: Transaction): Promise<CheckIfUserIsOrganizationMemberStatusResult> {
    const userInOrganization = await this.provider.getUserInOrganization(userId, organizationId, trx)

    if (!userInOrganization) {
      return {
        status: CheckIfUserIsOrganizationMemberStatus.USER_IN_ORGANIZATION_NOT_FOUND,
      }
    }

    return {
      status: CheckIfUserIsOrganizationMemberStatus.OK,
      userIsOrganizationMember: userInOrganization.entityStatus === EntityStatus.EXISTS && userInOrganization.role === OrganizationRole.MEMBER
    }
  }

  async checkIfUserIsOrganizationGuest(userId: Id, organizationId: Id, trx?: Transaction): Promise<CheckIfUserIsOrganizationGuestStatusResult> {
    const userInOrganization = await this.provider.getUserInOrganization(userId, organizationId, trx)

    if (!userInOrganization) {
      return {
        status: CheckIfUserIsOrganizationGuestStatus.USER_IN_ORGANIZATION_NOT_FOUND,
      }
    }

    return {
      status: CheckIfUserIsOrganizationGuestStatus.OK,
      userIsOrganizationGuest: userInOrganization.entityStatus === EntityStatus.EXISTS && userInOrganization.role === OrganizationRole.GUEST
    }
  }

  async getUserInOrganization(userId: Id, organizationId: Id, trx?: Transaction): Promise<UserInOrganizationDbRow> {
    return await this.provider.getUserInOrganization(userId, organizationId, trx);
  }

  async hasUserPermissionToDeactivate(currentUserId: Id, userId: Id, organizationId: Id, trx?: Transaction): Promise<boolean> {
    const { userIsOrganizationAdmin } = await this.checkIfUserIsOrganizationAdmin(currentUserId, organizationId, trx);

    const inviterId = await this.chatWithMeCustomFieldsProvider.getInviterId(userId, organizationId, trx)

    return userIsOrganizationAdmin || (currentUserId === userId) || (inviterId === currentUserId)
  }

  async checkIfUserIsInOrganization(organizationId: Id, userId: Id, trx?: Transaction): Promise<boolean> {
    return await this.provider.checkIfUserIsInOrganization(organizationId, userId, trx)
  }

  async deactivateUserFromWorkspace(currentUserId: Id, userId: Id, organizationId: Id, trx?: Transaction): Promise<DeactivateUserFromWorkspaceResult> {
    const hasPermissionToDeactivate = await this.hasUserPermissionToDeactivate(currentUserId, userId, organizationId, trx)


    if (!hasPermissionToDeactivate) {
      return {
        status: DeactivateUserFromWorkspaceStatus.FORBIDDEN,
      }
    }

    return await this.doDeactivateUserFromWorkspace(userId, organizationId, trx)
  }

  async doDeactivateUserFromWorkspace(userId: Id, organizationId: Id, trx?: Transaction): Promise<DeactivateUserFromWorkspaceResult> {
    const userInOrganization = await this.provider.updateUserInOrganization(
      organizationId,
      userId,
      { entityStatus: EntityStatus.DELETED },
      trx,
    )

    if (userInOrganization.role === OrganizationRole.GUEST) {
      const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx)
      await this.guestInProjectService.removeGuestInProjects(userId, userProjectIds, trx)
    }

    if (!userInOrganization) {
      return {
        status: DeactivateUserFromWorkspaceStatus.USER_NOT_FOUND,
      }
    } else {
      return {
        status: DeactivateUserFromWorkspaceStatus.OK,
      }
    }
  }

  async reactivateUserFromWorkspace(
    currentUserId: Id,
    userId: Id,
    organizationId: Id,
    role?: OrganizationRole,
    trx?: Transaction
  ): Promise<ReactivateUserFromWorkspaceResult> {
    const { userIsOrganizationAdmin } = await this.checkIfUserIsOrganizationAdmin(currentUserId, organizationId, trx);

    if (!userIsOrganizationAdmin) {
      return {
        status: ReactivateUserFromWorkspaceStatus.FORBIDDEN,
      }
    }

    const userInOrganization = await this.provider.updateUserInOrganization(
      organizationId,
      userId,
      { entityStatus: EntityStatus.EXISTS },
      trx
    )

    if (userInOrganization.role === OrganizationRole.GUEST) {
      const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx)
      await this.guestInProjectService.addGuestInProjects(userId, userProjectIds, trx)
    } else if (role === OrganizationRole.GUEST) {
      const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx)
      await this.userInProjectProvider.removeUserFromProjects(userId, userProjectIds, trx)
      await this.provider.updateUserInOrganization(
        organizationId,
        userId,
        { role },
        trx
      )
    }

    if (!userInOrganization) {
      return {
        status: ReactivateUserFromWorkspaceStatus.USER_NOT_FOUND,
      }
    } else {
      return {
        status: ReactivateUserFromWorkspaceStatus.OK,
      }
    }
  }

  async updateUserRole(userId: Id, organizationId: Id, role: OrganizationRole): Promise<UpdateUserRoleResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      const isAccountDeleted = await this.userService.isUserAccountDeleted(userId, trx)

      if (isAccountDeleted) {
        return {
          status: UpdateUserRoleStatus.ACCOUNT_DELETED
        }
      }

      if (role === OrganizationRole.OWNER) {
        const ownerId = await this.provider.getOrganizationOwner(organizationId, trx)

        await this.provider.updateUserInOrganization(
          organizationId,
          ownerId,
          { role: OrganizationRole.MEMBER },
          trx,
        )
      }

      if (role === OrganizationRole.GUEST) {
        const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx)
        await this.guestInProjectService.addGuestInProjects(userId, userProjectIds, trx)
      }

      if (role === OrganizationRole.MEMBER) {
        const { userIsOrganizationGuest } = await this.checkIfUserIsOrganizationGuest(userId, organizationId, trx)
        if (userIsOrganizationGuest) {
          const userProjectIds = await this.userInProjectProvider.getUserProjectIds(organizationId, userId, existingProjectsWithoutConversationsModifier, trx)
          await this.guestInProjectService.removeGuestInProjects(userId, userProjectIds, trx)
        }
      }

      const userInOrganization = await this.provider.updateUserInOrganization(
        organizationId,
        userId,
        { role },
        trx,
      )

      if (!userInOrganization) {
        return { status: UpdateUserRoleStatus.USER_IN_ORGANIZATION_NOT_FOUND }
      }

      return { status: UpdateUserRoleStatus.OK }
    })
  }

  /**
   * @param {Id} organizationId
   * @param trx
   * @return {Promise<GetOrganizationPeopleResult>}
   */
  async getOrganizationPeople(organizationId: Id, trx?: Transaction): Promise<PublicUserDbRow[]> {

    const query = this.connection.getQueryWithTransaction(trx)

    const subQuery = query
      .select('user_id')
      .from(Table.USER_IN_ORGANIZATION)
      .where({ 'organization_id': organizationId })
      ;
    if (trx) {
      subQuery.transacting(trx);
    }
    return await this.userService.getUsersForQuery(
      innerQuery => {
        innerQuery.whereIn('id', subQuery);
        if (trx) innerQuery.transacting(trx);
        return innerQuery
      },
      trx
    );
  }

}
