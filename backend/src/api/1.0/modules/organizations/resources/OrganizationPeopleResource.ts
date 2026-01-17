import { inject, injectable } from 'inversify';
import { chain, isEmpty, values } from 'lodash';
import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource';
import { QueryModifier } from '../../../../../services/types';
import { ChatWithMeModule } from '../../chatWithMe/ChatWithMeModule';
import { ChatWithMeCustomFieldsProviderInterface } from '../../chatWithMe/interfaces/ChatWithMeCustomFieldsProviderInterface';
import { ChatWithMeServiceInterface } from '../../chatWithMe/interfaces/ChatWithMeServiceInterface';
import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';
import Table from '../../db/Table';
import { CustomFieldTargetType, OrganizationRole, PublicUserDbRow, UserInOrganizationDbRow } from '../../db/schema';
import { ExtensionsModule } from '../../extensions/ExtensionsModule';
import { CustomFieldServiceInterface } from '../../extensions/interfaces/CustomFieldServiceInterface';
import { PaginationModule } from '../../pagination/PaginationModule';
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface';
import { PageableQueryParams, PaginatorOptions } from '../../pagination/types';
import { ProjectsModule } from '../../projects/ProjectsModule';
import { UserInProjectProviderInterface } from '../../projects/interfaces/UserInProjectProviderInterface';
import {
  existingProjectsAndConversationsUserAssignedToModifier,
  projectsWithoutConversationsModifier,
} from '../../projects/queryDecorators';
import { UserServiceInterface } from '../../users/UserServiceInterface';
import { UsersModule } from '../../users/UsersModule';
import { OrganizationsModule } from '../OrganizationsModule';
import { OrganizationProjectsProviderInterface } from '../interfaces/OrganizationProjectsProviderInterface';
import { UserInOrganizationProviderInterface } from '../interfaces/UserInOrganizationProviderInterface';
import { onlyGuestUsersQueryModifier, onlyOwnerAndAdminsQueryModifier } from '../queryDecorators';
import {
  OrganizationPeopleMetadataType,
  OrganizationPeopleResourceContext,
  OrganizationPeopleResourceData,
  OrganizationPeopleResourceQueryParams,
  OrganizationProjectsQueryParams,
} from '../types';

@injectable()
export class OrganizationPeopleResource extends AbstractResource<
  OrganizationPeopleResourceQueryParams,
  OrganizationPeopleResourceContext,
  OrganizationPeopleResourceData
> {
  constructor(
    @inject(PaginationModule.PaginationServiceFactoryInterface)
    paginationServiceFactory: PaginationServiceFactoryInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    private customFieldService: CustomFieldServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(OrganizationsModule.OrganizationProjectsProviderInterface)
    private organizationProjectsProvider: OrganizationProjectsProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(ChatWithMeModule.ChatWithMeServiceInterface)
    private chatWithMeService: ChatWithMeServiceInterface,
    @inject(ChatWithMeModule.ChatWithMeCustomFieldsProviderInterface)
    private chatWithMeCustomFieldsProvider: ChatWithMeCustomFieldsProviderInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface
  ) {
    super(paginationServiceFactory);
  }

  async getData(
    queryParams: OrganizationPeopleResourceQueryParams,
    context: OrganizationPeopleResourceContext
  ): Promise<OrganizationPeopleResourceData> {
    const { userId, organizationId } = context;

    const currentUserRoles = await this.userInOrganizationProvider.getOrganizationRolesForUser(userId);
    const currentUserRole = currentUserRoles[organizationId];

    let allAccessibleOrganizationPeople = [];
    switch (currentUserRole) {
      case OrganizationRole.GUEST: {
        allAccessibleOrganizationPeople = await this.getDataForGuestUser(organizationId, userId);
        break;
      }
      case OrganizationRole.MEMBER: {
        allAccessibleOrganizationPeople = await this.getDataForRegularUser(organizationId, userId);
        break;
      }
      case OrganizationRole.ADMIN:
      case OrganizationRole.OWNER: {
        allAccessibleOrganizationPeople = await this.getDataForAdmin(organizationId, userId);
        break;
      }
      default: {
        throw new Error(`Organization role ${currentUserRole} not implemented`);
      }
    }

    const allAccessibleOrganizationPeopleIds = allAccessibleOrganizationPeople.map(
      (userInOrganization) => userInOrganization.userId
    );

    const columnNames = this.getColumnNames(queryParams) as Array<keyof PublicUserDbRow>;
    const organizationPeople = await this.userService.getUsersForQuery(
      (q) => q.whereIn('id', allAccessibleOrganizationPeopleIds),
      undefined,
      columnNames
    );

    const metadata = await this.getMetadata(queryParams, {
      ...context,
      filteredOrganizationPeople: allAccessibleOrganizationPeople,
    });

    return {
      organizationPeople,
      ...metadata,
    };
  }

  async getMetadata(
    resourceQueryParams: OrganizationPeopleResourceQueryParams,
    context: OrganizationPeopleResourceContext
  ): Promise<Partial<OrganizationPeopleResourceData>> {
    // include all metadata if none specified in order to maintain backwards compatibility
    const queryParamsCopy = { ...resourceQueryParams };
    if (!queryParamsCopy.metadata) {
      queryParamsCopy.metadata = Object.values(OrganizationPeopleMetadataType).join(',');
    }
    return super.getMetadata(queryParamsCopy, context);
  }

  protected async getMetadataPromiseForField(
    field: OrganizationPeopleMetadataType,
    context: OrganizationPeopleResourceContext
  ): Promise<AnyDict> {
    const { filteredOrganizationPeople } = context;

    switch (field) {
      case OrganizationPeopleMetadataType.ROLE: {
        return chain(filteredOrganizationPeople)
          .keyBy('userId')
          .mapValues((role: UserInOrganizationDbRow): any => role.role)
          .value();
      }
      case OrganizationPeopleMetadataType.STATUS: {
        return chain(filteredOrganizationPeople)
          .keyBy('userId')
          .mapValues((role: UserInOrganizationDbRow): any => role.entityStatus)
          .value();
      }
      case OrganizationPeopleMetadataType.ID: {
        return chain(filteredOrganizationPeople)
          .keyBy('userId')
          .mapValues((role: UserInOrganizationDbRow): any => role.id)
          .value();
      }
      case OrganizationPeopleMetadataType.CUSTOM_FIELDS: {
        const userInOrganizationIds = chain(filteredOrganizationPeople)
          .keyBy('userId')
          .mapValues((role: UserInOrganizationDbRow): any => role.id)
          .value();
        return this.customFieldService.getValuesForTargetIds(
          CustomFieldTargetType.USER_IN_ORGANIZATION,
          values(userInOrganizationIds),
          null
        );
      }
    }
  }

  protected getPaginatorOptions(queryParams: OrganizationProjectsQueryParams): PaginatorOptions {
    return undefined;
  }

  private async getDataForAdmin(organizationId: Id, userId: Id): Promise<UserInOrganizationDbRow[]> {
    const allUsersInOrganization = await this.userInOrganizationProvider.getOrganizationUsersByOrganizationId(
      organizationId
    );

    const chatWithMeInvites = await this.chatWithMeService.getCurrentOrganizationChatWithMeInvites(organizationId);

    const chatWithMeInvitedUsersInOrganizationIds = chatWithMeInvites
      .filter((invite) => invite.value !== userId)
      .map((invite) => invite.targetId);

    const chatWithMeInvitedUsersInOrganization = allUsersInOrganization.filter((userInOrganization) =>
      chatWithMeInvitedUsersInOrganizationIds.includes(userInOrganization.id)
    );

    const chatWithMeInvitedUserIds = chatWithMeInvitedUsersInOrganization.map(
      (userInOrganization) => userInOrganization.userId
    );

    const usersInProjects = await this.userInProjectProvider.getUsersInProjects(
      organizationId,
      chatWithMeInvitedUserIds,
      projectsWithoutConversationsModifier
    );

    const chatWithMeGuestIdsToFilterOut = chatWithMeInvitedUsersInOrganization
      .filter((userInOrganization) => {
        const userProjects = usersInProjects[userInOrganization.userId];
        return !userProjects || userProjects.length === 0;
      })
      .map((userInOrganization) => userInOrganization.id);

    const result = allUsersInOrganization.filter((user) => !chatWithMeGuestIdsToFilterOut.includes(user.id));

    return result;
  }

  private async getDataForRegularUser(organizationId: Id, userId: Id): Promise<UserInOrganizationDbRow[]> {
    const currentUserInOrganizationProjectIds = await this.getUserProjectsIds(
      userId,
      organizationId,
      existingProjectsAndConversationsUserAssignedToModifier(userId)
    );
    const chatWithMeInvites = await this.chatWithMeService.getCurrentOrganizationChatWithMeInvites(organizationId);

    const currentUserInvitedChatWithMeGuestIds = chatWithMeInvites
      .filter((invite) => invite.value === userId)
      .map((invite) => invite.targetId);

    const queryPromises: PromiseLike<UserInOrganizationDbRow[]>[] = [];

    const guestsInvitedByUserPromise = this.userInOrganizationProvider.getGuestsInvitedByUser(
      userId,
      organizationId,
      (q) => q.orWhereIn(`${Table.USER_IN_ORGANIZATION}.id`, currentUserInvitedChatWithMeGuestIds)
    );

    queryPromises.push(guestsInvitedByUserPromise);

    const regularOrganizationUsers = this.userInOrganizationProvider.getOrganizationUsersWithoutGuests(organizationId);

    queryPromises.push(regularOrganizationUsers);

    if (currentUserInOrganizationProjectIds.length !== 0) {
      const guestsInCommonProjectsWithUserPromise =
        this.userInOrganizationProvider.getOrganizationUsersInSpecifiedProjects(
          organizationId,
          currentUserInOrganizationProjectIds,
          onlyGuestUsersQueryModifier
        );

      queryPromises.push(guestsInCommonProjectsWithUserPromise);
    }

    const queriesResults = await Promise.all(queryPromises);

    return chain(queriesResults)
      .flatten()
      .uniqBy((guest) => guest.userId)
      .value();
  }

  private async getDataForGuestUser(organizationId: Id, userId: Id): Promise<UserInOrganizationDbRow[]> {
    const userInOrganizationPromises = [];

    const currentUserInOrganizationProjectIds = await this.getUserProjectsIds(
      userId,
      organizationId,
      existingProjectsAndConversationsUserAssignedToModifier(userId)
    );

    if (!isEmpty(currentUserInOrganizationProjectIds)) {
      userInOrganizationPromises.push(
        this.userInOrganizationProvider.getOrganizationUsersInSpecifiedProjects(
          organizationId,
          currentUserInOrganizationProjectIds
        )
      );
      const ownerAndAdminsInOrganizationPromise = this.userInOrganizationProvider.getOrganizationUsersByOrganizationId(
        organizationId,
        undefined,
        onlyOwnerAndAdminsQueryModifier
      );
      userInOrganizationPromises.push(ownerAndAdminsInOrganizationPromise);
    } else {
      userInOrganizationPromises.push(this.userInOrganizationProvider.getUserInOrganization(userId, organizationId));
    }

    const chatWithMeInviterId = await this.chatWithMeCustomFieldsProvider.getInviterId(userId, organizationId);
    if (chatWithMeInviterId) {
      userInOrganizationPromises.push(
        this.userInOrganizationProvider.getUserInOrganization(chatWithMeInviterId, organizationId)
      );
    } else {
      userInOrganizationPromises.push(
        this.userInOrganizationProvider.getUserInviterInOrganization(userId, organizationId)
      );
    }

    const queriesResults = await Promise.all(userInOrganizationPromises);

    return chain(queriesResults)
      .flatten()
      .uniqBy((user) => user.userId)
      .value();
  }

  private async getUserProjectsIds(
    userId: Id,
    organizationId: Id,
    projectsQueryDecorator: QueryModifier
  ): Promise<Id[]> {
    const currentUserInOrganizationProjects = await this.organizationProjectsProvider.getOrganizationUserProjects(
      organizationId,
      userId,
      [projectsQueryDecorator],
      ['id']
    );
    return currentUserInOrganizationProjects.map((project) => project.id);
  }

  public getQueryDecorators(
    queryParams: PageableQueryParams,
    context: OrganizationPeopleResourceContext
  ): QueryModifier[] {
    return null;
  }
}
