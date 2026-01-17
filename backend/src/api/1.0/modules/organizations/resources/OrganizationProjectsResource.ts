import { injectable, inject } from 'inversify';
import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource';
import {
  OrganizationProjectsMetadataType,
  OrganizationProjectsQueryParams,
  OrganizationProjectsResourceContext,
  OrganizationProjectsResourceData,
} from '../types';
import { PaginatorOptions } from '../../pagination/types';
import { QueryModifier } from '../../../../../services/types';
import { AnyDict } from '../../common/types';
import { getOrganizationProjectsQueryDecorator } from '../../projects/queryDecorators';
import { PaginationModule } from '../../pagination/PaginationModule';
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface';
import { OrganizationsModule } from '../OrganizationsModule';
import { OrganizationProjectsProviderInterface } from '../interfaces/OrganizationProjectsProviderInterface';
import { ProjectsModule } from '../../projects/ProjectsModule';
import { UserInProjectProviderInterface } from '../../projects/interfaces/UserInProjectProviderInterface';
import { ProjectFollowersServiceInterface } from '../../projects/interfaces/ProjectFollowersServiceInterface';
import { ExtensionsModule } from '../../extensions/ExtensionsModule';
import { CustomFieldServiceInterface } from '../../extensions/interfaces/CustomFieldServiceInterface';
import {
  CustomFieldTargetType,
  ProjectType,
  ProjectDbRow,
  UserInProjectDbRow,
  ProjectRole,
} from '../../db/schema';
import { ProjectProviderInterface } from '../../projects/interfaces/ProjectProviderInterface';
import { BaseQueryFieldValue } from '../../../../../infrastructure/resources/types';
import { parseCommaSeparatedQueryField } from '../../../../../utils';
import { conversationSettingsQueryModifier } from '../../internal/queryDecorators';
import { ProjectService } from '../../projects/ProjectService';
import { chain, first, uniq } from 'lodash';
import { Id } from '../../common/identifier';
import { ConversationServiceInterface } from '../../projects/interfaces/ConversationServiceInterface';
import { UserInOrganizationServiceInterface } from '../interfaces/UserInOrganizationServiceInterface';
import { GuestInProjectProvider } from '../../projects/providers/GuestInProjectProvider';
import { UsersModule } from '../../users/UsersModule';
import { UserProviderInterface } from '../../users/UserProviderInterface';

@injectable()
export class OrganizationProjectsResource extends AbstractResource<
  OrganizationProjectsQueryParams,
  OrganizationProjectsResourceContext,
  OrganizationProjectsResourceData
> {
  constructor(
    @inject(OrganizationsModule.OrganizationProjectsProviderInterface)
    private organizationProjectsProvider: OrganizationProjectsProviderInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    private projectFollowersService: ProjectFollowersServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface)
    private customFieldService: CustomFieldServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(PaginationModule.PaginationServiceFactoryInterface)
    paginationServiceFactory: PaginationServiceFactoryInterface,
    @inject(ProjectsModule.GuestInProjectProviderInterface)
    private guestInProjectProvider: GuestInProjectProvider,
    @inject(UsersModule.UserProviderInterface)
    private userProvider: UserProviderInterface
  ) {
    super(paginationServiceFactory);
  }

  async getData(
    queryParams: OrganizationProjectsQueryParams,
    context: OrganizationProjectsResourceContext
  ): Promise<OrganizationProjectsResourceData> {
    const { organization, userId } = context;

    const { userIsOrganizationAdmin } =
      await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(
        userId,
        organization.id
      );

    const queryDecorators = this.getQueryDecorators(queryParams, {
      ...context,
      userIsOrganizationAdmin,
    });
    const columnNames = this.getColumnNames(queryParams);

    let projects =
      await this.organizationProjectsProvider.getOrganizationUserProjects(
        organization.id,
        userId,
        queryDecorators,
        columnNames
      );

    const projectTypes = Array.isArray(queryParams.projectType)
      ? queryParams.projectType
      : parseCommaSeparatedQueryField<ProjectType | BaseQueryFieldValue>(
          queryParams,
          'projectType',
          BaseQueryFieldValue.ALL
        );

    const { isVisible } = queryParams;
    const isQueryingConversations = projectTypes.some((projectType) =>
      [
        ProjectType.DIRECT_CHAT,
        ProjectType.GROUP_CHAT,
        BaseQueryFieldValue.ALL,
      ].includes(projectType)
    );

    if (isVisible && isQueryingConversations) {
      projects = await this.filterOutInvisibleConversations(
        projects,
        userId,
        organization.id
      );
    }

    const metadata = await this.getMetadata(queryParams, {
      ...context,
      projectIds: projects.map((project) => project.id),
    });

    if (isQueryingConversations) {
      const guestsInProjects =
        await this.guestInProjectProvider.getOrganizationProjectsGuestInProject(
          organization.id
        );

      if (guestsInProjects.length) {
        const usersInProjects: UserInProjectDbRow[] = guestsInProjects.map(
          (guestInProject) => ({
            id: guestInProject.id,
            projectId: guestInProject.projectId,
            userId: guestInProject.userId,
            role: ProjectRole.MEMBER,
          })
        );
        metadata.projectPeople = [
          ...(metadata.projectPeople || []),
          ...usersInProjects,
        ];
      }
    }

    if (metadata.projectPeople) {
      const userIds = uniq(metadata.projectPeople.map(({ userId }) => userId));
      const userEmails = await this.userProvider.getUsersEmails(userIds);
      metadata.projectPeople.forEach((user) => {
        user.email = userEmails[user.userId];
      });
    }

    return {
      projects,
      ...metadata,
    };
  }

  private async filterOutInvisibleConversations(
    projects: ProjectDbRow[],
    userId: Id,
    organizationId: Id
  ): Promise<ProjectDbRow[]> {
    const projectIds = projects.map((project) => project.id);
    const conversationSettings =
      await this.conversationService.getUserConversationsSettings(
        userId,
        organizationId,
        conversationSettingsQueryModifier
      );
    const conversationSettingsMap = chain(conversationSettings)
      .groupBy('conversationHash')
      .mapValues(first)
      .value();
    const projectsPeople = await this.userInProjectProvider.getProjectsPeople(
      projectIds
    );
    const projectsPeopleMap = chain(projectsPeople)
      .groupBy('projectId')
      .value();

    return projects.filter((project) => {
      if (ProjectService.isProjectConversation(project)) {
        const roles = projectsPeopleMap[project.id];
        if (!roles) {
          return false;
        }
        const projectPeopleIds = roles.map((role) => role.userId);
        const conversationHash =
          this.conversationService.generateConversationHash(
            organizationId,
            projectPeopleIds
          );
        const conversationSettings = conversationSettingsMap[conversationHash];
        return !conversationSettings || conversationSettings.isVisible;
      }
      return true;
    });
  }

  protected async getMetadataPromiseForField(
    field: OrganizationProjectsMetadataType,
    context: OrganizationProjectsResourceContext
  ): Promise<AnyDict> {
    const { projectIds, userId } = context;

    switch (field) {
      case OrganizationProjectsMetadataType.PEOPLE: {
        return this.userInProjectProvider.getProjectsPeople(projectIds);
      }
      case OrganizationProjectsMetadataType.FOLLOWERS: {
        return this.projectFollowersService.getProjectsFollowerIds(projectIds);
      }
      case OrganizationProjectsMetadataType.UNREAD_MESSAGES: {
        return this.projectProvider.getHaveProjectsUnreadMessages(
          projectIds,
          userId
        );
      }
      case OrganizationProjectsMetadataType.CUSTOM_FIELDS: {
        const { values } = await this.customFieldService.getValuesForTargetIds(
          CustomFieldTargetType.PROJECT,
          projectIds,
          null
        );
        return values;
      }
    }
  }

  protected getPaginatorOptions(
    queryParams: OrganizationProjectsQueryParams
  ): PaginatorOptions {
    return undefined;
  }

  public getQueryDecorators(
    queryParams: OrganizationProjectsQueryParams,
    context: OrganizationProjectsResourceContext
  ): QueryModifier[] {
    const organizationProjectsQueryDecorator =
      getOrganizationProjectsQueryDecorator(
        queryParams,
        context.userIsOrganizationAdmin
      );
    return [organizationProjectsQueryDecorator];
  }
}
