import { UserStatusServiceInterface } from "./interfaces/UserStatusServiceInterface";
import { Id } from "../common/identifier";
import { GetOrganizationUserStatusesResult, UserStatusJson, SetUserStatusResult, DeleteUserStatusResult, GetOrganizationUserStatusesStatus, SetUserStatusStatus, DeleteUserStatusStatus } from "./types";
import { injectable, inject } from "inversify";
import { UserStatusModule } from "./UserStatusModule";
import { UserStatusProviderInterface } from "./interfaces/UserStatusProviderInterface";
import { UsersModule } from "../users/UsersModule";
import { UserProviderInterface } from "../users/UserProviderInterface";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { OrganizationServiceInterface } from "../organizations/interfaces/OrganizationServiceInterface";
import { UserStatusDbRow } from "../db/schema";


import { ConnectionInterface } from "../db/ConnectionInterface";
import { DbModule } from "../db/DbModule";

@injectable()
export class UserStatusService implements UserStatusServiceInterface {

  private userStatusProvider: UserStatusProviderInterface
  private userProvider: UserProviderInterface
  private organizationService: OrganizationServiceInterface

  constructor(
    @inject(UserStatusModule.UserStatusProviderInterface)
    userStatusProvider: UserStatusProviderInterface,
    @inject(UsersModule.UserProviderInterface)
    userProvider: UserProviderInterface,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    organizationService: OrganizationServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
    this.userStatusProvider = userStatusProvider
    this.userProvider = userProvider
    this.organizationService = organizationService
  }

  async getOrganizationUserStatuses(userId: Id, organizationId: Id): Promise<GetOrganizationUserStatusesResult> {
    const user = await this.userProvider.getUserById(userId);

    if (!user) {
      return {
        status: GetOrganizationUserStatusesStatus.USER_NOT_FOUND,
      }
    }

    const { organization } = await this.organizationService.getOrganization(organizationId);

    if (!organization) {
      return {
        status: GetOrganizationUserStatusesStatus.ORGANIZATION_NOT_FOUND,
      }
    }

    let userStatuses = await this.userStatusProvider.getOrganizationUserStatuses(organizationId);

    return {
      status: GetOrganizationUserStatusesStatus.OK,
      userStatuses,
    }
  }

  async setUserStatus(userStatusJson: UserStatusJson): Promise<SetUserStatusResult> {
    return this.connection.getConnection().transaction(async trx => {
      return await this.doSetUserStatus(trx, userStatusJson)
    })
  }

  async doSetUserStatus(trx: Transaction, userStatusJson: UserStatusJson): Promise<SetUserStatusResult> {
    const { organizationId, userId } = userStatusJson
    const user = await this.userProvider.getUserById(userId, trx);
    if (!user) {
      return {
        status: SetUserStatusStatus.USER_NOT_FOUND,
      }
    }

    const { organization } = await this.organizationService.getOrganization(organizationId, trx);

    if (!organization) {
      return {
        status: SetUserStatusStatus.ORGANIZATION_NOT_FOUND,
      }
    }

    let userStatus: UserStatusDbRow;

    const existingUserStatus = await this.userStatusProvider.getUserStatus(userId, organizationId, trx);
    if (existingUserStatus) {
      userStatus = await this.userStatusProvider.updateUserStatus(userStatusJson, trx)
    } else {
      userStatus = await this.userStatusProvider.setUserStatus(userStatusJson, trx)
    }

    return {
      status: SetUserStatusStatus.OK,
      userStatus,
    }
  }

  async deleteUserStatus(userId: Id, organizationId: Id): Promise<DeleteUserStatusResult> {
    const user = await this.userProvider.getUserById(userId);
    if (!user) {
      return {
        status: DeleteUserStatusStatus.USER_NOT_FOUND,
      }
    }

    const { organization } = await this.organizationService.getOrganization(organizationId);

    if (!organization) {
      return {
        status: DeleteUserStatusStatus.ORGANIZATION_NOT_FOUND,
      }
    }

    const existingUserStatus = await this.userStatusProvider.getUserStatus(userId, organizationId);

    if(!existingUserStatus) {
      return {
        status: DeleteUserStatusStatus.STATUS_NOT_FOUND,
      }
    }

    await this.userStatusProvider.deleteUserStatus(userId, organizationId);

    return {
      status: DeleteUserStatusStatus.OK,
    }
  }
}
