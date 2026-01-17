import { inject, injectable } from 'inversify';
import { Id } from '../common/identifier';
import { GroupDbRow } from '../db/schema';
import { OrganizationGroupsProviderInterface } from './interfaces/OrganizationGroupsProviderInterface';
import { OrganizationGroupsServiceInterface } from './interfaces/OrganizationGroupsServiceInterface';
import {
  AddUserToGroupResult,
  AddUserToGroupStatus,
  CreateGroupResult,
  CreateGroupStatus,
  DeleteGroupResult,
  DeleteGroupStatus,
  RemoveUserFromGroupResult,
  RemoveUserFromGroupStatus,
  UpdateGroupResult,
  UpdateGroupStatus,
} from './types';
import { GroupsModule } from './GroupsModule';
import { UserInGroupProviderInterface } from './interfaces/UserInGroupProviderInterface';
import { Dict } from '../common/types';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';

@injectable()
export class OrganizationGroupsService
  implements OrganizationGroupsServiceInterface
{
  constructor(
    @inject(GroupsModule.OrganizationGroupsProviderInterface)
    private organizationGroupsProvider: OrganizationGroupsProviderInterface,
    @inject(GroupsModule.UserInGroupProviderInterface)
    private userInGroupProvider: UserInGroupProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface
  ) {}

  async createGroup(
    organizationId: Id,
    name: string,
    slug: string
  ): Promise<CreateGroupResult> {
    const group = await this.organizationGroupsProvider.createGroup(
      organizationId,
      name,
      slug
    );

    return {
      status: CreateGroupStatus.OK,
      group,
    };
  }

  async updateGroup(
    id: Id,
    name: string,
    slug: string
  ): Promise<UpdateGroupResult> {
    const group = await this.organizationGroupsProvider.updateGroup(
      id,
      name,
      slug
    );

    return {
      status: UpdateGroupStatus.OK,
      group,
    };
  }

  async deleteGroup(id: Id): Promise<DeleteGroupResult> {
    await this.organizationGroupsProvider.deleteGroup(id);

    return { status: DeleteGroupStatus.OK };
  }

  async getGroups(organizationId: Id): Promise<GroupDbRow[]> {
    return await this.organizationGroupsProvider.getGroups(organizationId);
  }

  async getGroupsPeople(organizationId: Id): Promise<Dict<Id>> {
    return await this.userInGroupProvider.getGroupsPeople(organizationId);
  }

  async addUserToGroup(groupId: Id, userId: Id): Promise<AddUserToGroupResult> {
    const group = await this.organizationGroupsProvider.getGroup(groupId);
    const userInOrganization =
      await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        group.organizationId
      );

    const currentUserInGroup = await this.userInGroupProvider.getUserInGroup(
      userInOrganization.id
    );
    if (currentUserInGroup) {
      await this.userInGroupProvider.updateUserInGroup(
        groupId,
        userInOrganization.id
      );
    } else {
      await this.userInGroupProvider.addUserToGroup(
        groupId,
        userInOrganization.id
      );
    }

    return { status: AddUserToGroupStatus.OK };
  }

  async removeUserFromGroup(
    groupId: Id,
    userId: Id
  ): Promise<RemoveUserFromGroupResult> {
    const group = await this.organizationGroupsProvider.getGroup(groupId);
    const userInOrganization =
      await this.userInOrganizationProvider.getUserInOrganization(
        userId,
        group.organizationId
      );
    await this.userInGroupProvider.removeUserFromGroup(
      groupId,
      userInOrganization.id
    );

    return { status: RemoveUserFromGroupStatus.OK };
  }

  async getGroupUserIds(groupId: Id): Promise<Id[]> {
    return await this.userInGroupProvider.getGroupUserIds(groupId);
  }
}
