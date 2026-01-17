import { inject, injectable } from 'inversify';
import { OrganizationProjectsServiceInterface } from './interfaces/OrganizationProjectsServiceInterface';
import { Id } from '../common/identifier';
import {
  ClearInactiveConversationsResult,
  ClearInactiveConversationsStatus,
  GetOrganizationUserProjectsWithMetadataResult,
  GetOrganizationUserProjectsWithMetadataStatus,
  OrganizationProjectsMetadataType,
  OrganizationProjectsQueryParams,
} from './types';
import { OrganizationsModule } from './OrganizationsModule';
import { OrganizationProjectsResource } from './resources/OrganizationProjectsResource';
import { OrganizationProviderInterface } from './interfaces/OrganizationProviderInterface';
import { UsersModule } from '../users/UsersModule';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { EntityStatus } from '../common/enum';
import {
  ProjectType,
  UserInOrganizationSettingsType,
  UserInProjectDbRow,
} from '../db/schema';
import { InternalModule } from '../internal/InternalModule';
import { InternalServiceInterface } from '../internal/InternalServiceInterface';
import { groupBy } from 'lodash';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';
import { UserInProjectProviderInterface } from '../projects/interfaces/UserInProjectProviderInterface';
import { ProjectsHaveUnreadMessages } from '../projects/types';
import { ConversationSettingsProviderInterface } from '../projects/interfaces/ConversationSettingsProviderInterface';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { subDays } from 'date-fns';
import { SettingsModule } from '../settings/SettingsModule';
import { UserInOrganizationSettingsProviderInterface } from '../settings/interfaces/UserInOrganizationSettingsProviderInterface';
import { ChatsRetentionSettings } from '../settings/types';
import { BaseQueryFieldValue } from '../../../../infrastructure/resources/types';

const DEFAULT_CHATS_RETENTION_SETTINGS: ChatsRetentionSettings = {
  visibleChatsCount: 20,
  chatsExpirationPeriod: 7,
};

@injectable()
export class OrganizationProjectsService
  implements OrganizationProjectsServiceInterface
{
  constructor(
    @inject(OrganizationsModule.OrganizationProjectsResource)
    private organizationProjectsResource: OrganizationProjectsResource,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(InternalModule.InternalServiceInterface)
    private internalService: InternalServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(ProjectsModule.ConversationSettingsProviderInterface)
    private conversationSettingsProvider: ConversationSettingsProviderInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(SettingsModule.UserInOrganizationSettingsProviderInterface)
    private userInOrganizationSettingsProvider: UserInOrganizationSettingsProviderInterface
  ) {}

  async getUserOrganizationProjectsWithMetadata(
    organizationId: Id,
    userId: Id,
    queryParams: OrganizationProjectsQueryParams
  ): Promise<GetOrganizationUserProjectsWithMetadataResult> {
    const organization = await this.organizationProvider.getOrganization(
      organizationId
    );
    if (!organizationId) {
      return {
        status:
          GetOrganizationUserProjectsWithMetadataStatus.ORGANIZATION_NOT_FOUND,
      };
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      return {
        status: GetOrganizationUserProjectsWithMetadataStatus.USER_NOT_FOUND,
      };
    }

    return {
      status: GetOrganizationUserProjectsWithMetadataStatus.OK,
      data: await this.organizationProjectsResource.getData(queryParams, {
        organization,
        userId,
      }),
    };
  }

  private getConversationIdsFromProjectPeople(
    organizationId: Id,
    people: UserInProjectDbRow[],
    unreadMessagesMap: ProjectsHaveUnreadMessages,
    searchActive: boolean = false
  ): Id[] {
    const projectPeopleMap = groupBy(people, 'projectId');

    return Object.entries(projectPeopleMap)
      .map(([projectId, usersInProject]) => {
        if (unreadMessagesMap[projectId] && !searchActive) {
          return;
        }
        const peopleIds = usersInProject.map(
          (userInProject) => userInProject.userId
        );

        if (peopleIds.length < 2) {
          return;
        }

        const conversationId =
          this.conversationService.generateConversationHash(
            organizationId,
            peopleIds
          );

        return conversationId;
      })
      .filter(Boolean);
  }

  async clearInactiveConversations(
    organizationId: Id,
    userId: Id
  ): Promise<ClearInactiveConversationsResult> {
    const { data } = await this.getUserOrganizationProjectsWithMetadata(
      organizationId,
      userId,
      {
        status: EntityStatus.EXISTS,
        projectType: [ProjectType.DIRECT_CHAT, ProjectType.GROUP_CHAT],
        isMember: true,
        isVisible: true,
        isPrivate: BaseQueryFieldValue.ALL,
        metadata: [
          OrganizationProjectsMetadataType.PEOPLE,
          OrganizationProjectsMetadataType.UNREAD_MESSAGES,
        ],
      }
    );

    let retentionSettings = DEFAULT_CHATS_RETENTION_SETTINGS;
    const settings =
      await this.userInOrganizationSettingsProvider.getSettngsByTypeAndContainer<ChatsRetentionSettings>(
        UserInOrganizationSettingsType.CHATS_RETENTION,
        organizationId,
        userId
      );
    if (settings?.value) {
      retentionSettings = {
        visibleChatsCount:
          settings.value.visibleChatsCount ||
          retentionSettings.visibleChatsCount,
        chatsExpirationPeriod:
          settings.value.chatsExpirationPeriod ||
          retentionSettings.chatsExpirationPeriod,
      };
    }

    const { chatsExpirationPeriod, visibleChatsCount } = retentionSettings;

    const unreadMessagesMap = data.projectsHaveUnreadMessages;

    const allConversationIds = this.getConversationIdsFromProjectPeople(
      organizationId,
      data.projectPeople,
      unreadMessagesMap
    );

    const now = this.timeService.getCurrentTime();

    let { latestActiveConversationsData } =
      await this.internalService.getLatestActiveUserConversations(
        organizationId,
        userId,
        40,
        [ProjectType.DIRECT_CHAT, ProjectType.GROUP_CHAT]
      );

    if (latestActiveConversationsData.length > visibleChatsCount) {
      const activeInThreshold = latestActiveConversationsData.slice(
        0,
        visibleChatsCount
      );
      const rest = latestActiveConversationsData.slice(
        visibleChatsCount,
        latestActiveConversationsData.length
      );
      const restMatchingDateThreshold = rest.filter((conversation) => {
        const dateInPast = subDays(now, chatsExpirationPeriod);
        const createdAt = new Date(conversation.createdAt);
        const isAfter = this.timeService.isDate1AfterDate2(
          createdAt,
          dateInPast
        );
        return isAfter;
      });
      latestActiveConversationsData = [
        ...activeInThreshold,
        ...restMatchingDateThreshold,
      ];
    } else {
      latestActiveConversationsData = latestActiveConversationsData.slice(
        0,
        visibleChatsCount
      );
    }

    const activeProjectIds = latestActiveConversationsData.map(
      ({ containerId }) => containerId
    );

    const activeProjectsPeople =
      await this.userInProjectProvider.getProjectsPeople(activeProjectIds);

    const activeConversationIds = this.getConversationIdsFromProjectPeople(
      organizationId,
      activeProjectsPeople,
      unreadMessagesMap,
      true
    );

    const inactiveConversationIds = allConversationIds.filter(
      (conversationId) => !activeConversationIds.includes(conversationId)
    );

    if (inactiveConversationIds.length) {
      await this.conversationSettingsProvider.hideConversations(
        userId,
        organizationId,
        inactiveConversationIds
      );
    }

    return {
      status: ClearInactiveConversationsStatus.OK,
      hiddenConversationIds: inactiveConversationIds,
      activeConversationIds,
    };
  }
}
