import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { generateConversationId } from '../../../../utils/generateCombinedId';
import generateSelectorName from '../../../../utils/generateSelectorName';
import getRecordsByIds from '../../../../utils/getRecordsByIds';
import { ExtensionNamespace, FieldType } from '../../ExtensionsModel/types';
import {
  selectCurrentOrganizationActivePeople,
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectCurrentOrganizationAllGuestUserIds,
  selectCurrentOrganizationUserIds,
  selectIsCurrentUserOrganizationAdmin,
  selectIsCurrentUserOrganizationGuest,
} from '../../OrganizationsModel/selectors';
import {
  selectCurrentOrganizationActivePeopleRole,
  selectCurrentOrganizationId,
  selectUserInOrganizationIdsDomain,
  selectUsersStatusInCurrentOrganization,
} from '../../OrganizationsModel/selectors/domain';
import { selectAllUserIds } from '../../UsersModel/selectors';
import {
  selectCurrentUserId,
  selectUsersData,
  selectUsersName,
  selectUsersSearchName,
} from '../../UsersModel/selectors/domain';
import {
  isProjectDirectChat,
  isProjectGroupChat,
  isProjectGroupOrDirectChat,
  isProjectGroupOrDirectChatByType,
  managerRoles,
  sortProjectMembers,
  sortSpaces,
} from '../helpers';

import { isImage } from '../../FilesModel/helpers';
import { selectFilesData } from '../../FilesModel/selectors';
import { selectMessagesCreatedAt, selectObjectMessages } from '../../MessagesModel/selectors/domain';
import { filterImmutableObjectByKeys } from '../../PermissionsModel/utils';
import { selectTaskAssigneeIds } from '../../TasksModel/selectors/domain';
import { FIRST_PROJECT_NAME } from '../constants';
import {
  ConversationDescriptorRecordInterface,
  ProjectInterface,
  ProjectRecordInterface,
  ProjectRole,
  ProjectType,
  ProjectsData,
  QuickSwitcherChatDescriptorRecordInterface,
} from '../types';
import { selectCurrentUserAccessibleProjectIds } from './accessSelectors';
import {
  selectIsConversationVisibleDomain,
  selectKanbanScrollLeftDomain,
  selectProjectNames,
  selectProjectOrganizationIds,
  selectProjectPeople,
  selectProjectTypes,
  selectProjectsDataDomain,
  selectProjectsFileIds,
  selectProjectsFollowerIds,
  selectProjectsHaveUnreadMessages,
  selectProjectsPeople,
  selectProjectsPeopleRoleDomain,
  selectSectionsScrollTopDomain,
} from './domain';

import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import { User } from 'models/domain/UsersModel/models';
import { createSelector } from 'reselect';
import { i18n } from '../../../../i18n';
import { AnyDict } from '../../../../types';
import { Id } from '../../../../utils/identifier';
import { mergeLists } from '../../../../utils/immutableUtils';
import { EntityStatus } from '../../EntityModel/types';
import { selectCustomFieldsDomain, selectExtensionIdsByNamespaces } from '../../ExtensionsModel/selectors/domain';
import { TargetType } from '../../ExtensionsModel/types';
import { generateExtensionCustomFieldId } from '../../ExtensionsModel/utils';
import { selectChatNotificationSettingsTypeMap } from '../../NotificationsModel/selectors/domain';
import { ChatNotificationSettingsType } from '../../NotificationsModel/types';
import { OrganizationPeopleRole } from '../../OrganizationsModel/types';
import { sortTaskAssignees } from '../../TasksModel/helpers';
import { sortUserIdsByNames } from '../../UsersModel/utils';
import { ConversationDescriptor, QuickSwitcherChatDescriptor } from '../models';
import {
  getConversationName,
  injectLatestMessageCreatedAtToDescriptors,
  sortConversationDescriptorsByLatestMessage,
} from './utils';

const emptyList = List();
const emptyMap = Map();

export const selectProjectsData = createImmutableEqualSelector(
  selectProjectsDataDomain,
  selectCurrentUserAccessibleProjectIds,
  (projectsData, projectIds): ProjectsData =>
    filterImmutableObjectByKeys<ProjectRecordInterface>(projectsData, projectIds),
);

export const selectProjectsPeopleRole = createImmutableEqualSelector(
  selectProjectsPeopleRoleDomain,
  selectCurrentUserAccessibleProjectIds,
  (projectsPeopleRole, projectIds) => filterImmutableObjectByKeys<ProjectRole>(projectsPeopleRole, projectIds),
);

export const selectConversationsPeople = createImmutableEqualSelector(
  selectProjectsPeople,
  selectProjectsData,
  (projectsPeople, projectsData: ProjectsData) => {
    let result = emptyMap;
    projectsData.forEach((projectData, projectId) => {
      if (projectData.projectType === ProjectType.GROUP_CHAT || projectData.projectType === ProjectType.DIRECT_CHAT) {
        result = result.set(projectId, projectsPeople.get(projectId));
      }
    });

    return result;
  },
);

export const selectProjectsTypes = createImmutableEqualSelector(
  selectProjectsData,
  (projectsData: ProjectsData) => projectsData.map((project) => project.projectType) as Map<Id, ProjectType>,
);

export const selectProjectIds = createImmutableEqualSelector(
  selectProjectsData,
  (projectsData: ProjectsData) =>
    projectsData
      .valueSeq()
      .toList()
      .map((project) => project.id) as List<Id>,
);

export const selectGroupConversationsPeople = createImmutableEqualSelector(
  selectProjectsPeople,
  selectProjectsTypes,
  (projectsPeople, projectsTypes) => {
    const projectIds = projectsPeople.keySeq().toList();
    const groupConversationIds = projectIds.filter(
      (projectId) => projectsTypes.get(projectId) === ProjectType.GROUP_CHAT,
    );
    return projectsPeople.filter((people, projectId) => groupConversationIds.contains(projectId));
  },
);

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectHasAccessToProject = createCachedSelector(
  selectCurrentUserAccessibleProjectIds,
  (_, args) => args.projectId,
  (projectIds, projectId) => projectIds.indexOf(projectId) !== -1,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {object | null}
 */
export const selectProject = createCachedSelector(
  selectProjectsDataDomain,
  (_, args) => args.projectId,
  (projectsData, projectId) => projectsData.get(projectId),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectProjectMembers = createCachedSelector(
  selectProjectPeople,
  selectCurrentOrganizationAllGuestUserIds,
  (projectPeople, organizationGuestUserIds) =>
    projectPeople.filter((userId) => !organizationGuestUserIds.includes(userId)) as List<Id>,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectProjectGuests = createCachedSelector(
  selectProjectPeople,
  selectCurrentOrganizationAllGuestUserIds,
  (projectPeople, organizationGuestUserIds) =>
    projectPeople.filter((userId) => organizationGuestUserIds.includes(userId)),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {Map}
 */
export const selectProjectPeopleRole = createCachedSelector(
  selectProjectsPeopleRole,
  (_, args) => args.projectId,
  (projectsPeopleRole, projectId) => projectsPeopleRole.get(projectId) || (emptyMap as ProjectRole),
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId, userId,
export const selectProjectUserRole = createCachedSelector(
  selectProjectPeopleRole,
  (_, args) => args.userId,
  (projectPeopleRole, userId) => projectPeopleRole.get(userId),
)((_, args) => generateSelectorName(args, ['projectId', 'userId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectSortedProjectMembers = createCachedSelector(
  selectProjectMembers,
  selectProjectPeopleRole,
  selectUsersName,
  (projectMembers, projectPeopleRole, usersName) => sortProjectMembers(projectMembers, projectPeopleRole, usersName),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectSortedProjectMembersWithGuests = createCachedSelector(
  selectProjectPeople,
  selectProjectPeopleRole,
  selectUsersName,
  (projectMembers, projectPeopleRole, usersName) => sortProjectMembers(projectMembers, projectPeopleRole, usersName),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectProjectFollowerIds = createCachedSelector(
  selectProjectsFollowerIds,
  (_, args) => args.projectId,
  (projectsFollowerIds, projectId) => projectsFollowerIds.get(projectId) || emptyList,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectIsCurrentUserProjectFollower = createCachedSelector(
  selectProjectFollowerIds,
  selectCurrentUserId,
  (projectFollowerIds, currentUserId) => projectFollowerIds.includes(currentUserId),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string}
 */
export const selectCurrentUserRole = createCachedSelector(
  selectProjectPeopleRole,
  selectCurrentUserId,
  (peopleRole, currentUserId) => (peopleRole ? peopleRole.get(currentUserId) : null),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string}
 */
export const selectProjectName = createCachedSelector(selectProject, (project: ProjectInterface) =>
  project ? project.name : '',
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string}
 */
export const selectChatMessagePlaceholder = createCachedSelector(
  selectProject,
  selectProjectPeople,
  selectCurrentUserId,
  selectUsersData,
  (projectData: ProjectInterface, projectPeople, currentUserId, usersData) => {
    if (projectData) {
      if (isProjectDirectChat(projectData)) {
        // user own chat
        if (projectPeople.size === 1 && projectPeople.includes(currentUserId)) {
          return i18n.t('Jot something down.');
        } else {
          // 1-1 chat
          const userId = projectPeople.filterNot((projectMemberId) => projectMemberId === currentUserId).first();
          const userData = usersData.get(userId);
          if (userData) {
            const firstName = userData.get('firstName');
            const lastName = userData.get('lastName');
            if (firstName && lastName) {
              return i18n.t(`Message {{target}}`, {
                target: `${firstName} ${lastName}`,
              });
            } else {
              return i18n.t(`Message {{target}}`, { target: userData.email });
            }
          } else {
            return i18n.t('newMessagePlaceholder');
          }
        }
      } else if (isProjectGroupChat(projectData)) {
        const projectName = projectData.name;
        if (projectName) {
          return i18n.t(`Message {{target}}`, { target: projectData.name });
        } else {
          const chatMembersNames = projectPeople
            .filterNot((projectMemberId) => projectMemberId === currentUserId)
            .map((userId) => {
              const userData = usersData.get(userId);
              if (userData) {
                const firstName = userData.get('firstName');
                const lastName = userData.get('lastName');
                if (firstName && lastName) {
                  return `${firstName} ${lastName}`;
                } else {
                  return userData.get('email');
                }
              } else {
                return '';
              }
            })
            .join(', ');
          return i18n.t(`Message {{target}}`, { target: chatMembersNames });
        }
      } else {
        return i18n.t(`Message {{target}}`, { target: projectData.name });
      }
    } else {
      return i18n.t('newMessagePlaceholder');
    }
  },
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string}
 */
export const selectProjectColor = createCachedSelector(selectProject, (project: ProjectInterface) =>
  project && !isProjectGroupOrDirectChat(project) ? project.color : 'var(--color-primary-500)',
)((_, args) => generateSelectorName(args, ['projectId']));

export const selectProjectBackground = createCachedSelector(
  selectProject,
  (project: ProjectInterface) => project?.backgroundImageUrl,
)((_, args) => generateSelectorName(args, ['projectId']));

export const selectProjectIconType = createCachedSelector(
  selectProject,
  (project: ProjectInterface): ProjectIconTypes =>
    (!isProjectGroupOrDirectChat(project) && (project?.iconType as ProjectIconTypes)) || ProjectIconTypes.Trophy,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string | null}
 */
export const selectProjectStatus = createCachedSelector(selectProject, (project: ProjectInterface) =>
  project ? project.status : null,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string}
 */
export const selectProjectDescription = createCachedSelector(selectProject, (project: ProjectInterface) =>
  project ? project.description || '' : '',
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectProjectIsGroupOrDirectChat = createCachedSelector(selectProject, (project) =>
  isProjectGroupOrDirectChat(project),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectProjectIsGroupChat = createCachedSelector(selectProject, (project) => isProjectGroupChat(project))(
  (_, args) => generateSelectorName(args, ['projectId']),
);

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectProjectIsDirectChat = createCachedSelector(selectProject, (project) => isProjectDirectChat(project))(
  (_, args) => generateSelectorName(args, ['projectId']),
);

export const selectAllOneToOneConversationSpacesIds = createImmutableEqualSelector(
  selectAllUserIds,
  selectCurrentUserId,
  selectCurrentOrganizationId,
  (allUserIds, currentUserId, organizationId) =>
    allUserIds.map((userId) => generateConversationId([currentUserId, userId], organizationId)),
);

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectProjectIsOneToOneConversation = createCachedSelector(
  selectProject,
  selectProjectPeople,
  (project: ProjectInterface, projectPeople) => {
    if (!project || !projectPeople) {
      return false;
    }

    return project.projectType === ProjectType.DIRECT_CHAT && projectPeople.size <= 2;
  },
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectProjectIsPrivate = createCachedSelector(selectProject, (project: ProjectInterface) =>
  project ? project.isPrivate : false,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @returns {Map}
 */
export const selectProjectsColor = createImmutableEqualSelector(selectProjectsData, (projectsData: ProjectsData) => {
  let result = emptyMap as Map<Id, string>;

  projectsData.forEach((project) => {
    const projectId = project.id;
    const color = project.color;

    result = result.set(projectId, color);
  });

  return result;
});

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectIsCurrentUserInProject = createCachedSelector(
  selectCurrentUserId,
  selectProjectPeople,
  (_, args) => args.projectId,
  (currentUserId, projectPeople, projectId) =>
    (projectPeople && projectPeople.indexOf(currentUserId) !== -1) || !projectId || projectId === FIRST_PROJECT_NAME,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectIsProjectExist = createCachedSelector(
  selectProjectsData,
  (_, args) => args.projectId,
  (projectsData, projectId) => (projectsData.get(projectId) ? true : false),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @return {Map}
 */
export const selectProjectIdsByConversationIds = createImmutableEqualSelector(
  selectProjectsData,
  selectProjectsPeople,
  selectCurrentOrganizationId,
  (projectsData, projectsPeople, organizationId) => {
    let result = emptyMap as Map<Id, Id>;
    projectsData
      .valueSeq()
      .filter(
        (project) =>
          [ProjectType.DIRECT_CHAT, ProjectType.GROUP_CHAT].includes(project.projectType) &&
          project.organizationId === organizationId,
      )
      .forEach((project) => {
        const projectId = project.id;
        const projectPeople = projectsPeople.get(projectId);

        if (projectPeople && project) {
          const conversationId = generateConversationId(projectPeople, organizationId);
          result = result.set(conversationId, projectId);
        }
      });
    return result;
  },
);

/**
 * @param {string} conversationId
 * @returns {boolean}
 */
export const selectIsConversationExist = createCachedSelector(
  selectProjectsData,
  selectProjectIdsByConversationIds,
  (_, args: AnyDict) => args.conversationId,
  (projectsData: ProjectsData, projectIdByConversationId: Map<Id, Id>, conversationId: Id) => {
    const projectId = projectIdByConversationId.get(conversationId);
    return projectsData.get(projectId) ? true : false;
  },
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectIsProjectWithIdExist = createCachedSelector(selectProject, (project) => (project ? true : false))(
  (_, args) => generateSelectorName(args, ['projectId']),
);

/**
 * @returns {List}
 */
export const selectCurrentOrganizationProjectsData = createImmutableEqualSelector(
  selectProjectsData,
  selectCurrentOrganizationId,
  selectProjectOrganizationIds,
  (projectsData, currentOrganizationId, projectOrganizationIds) =>
    projectsData.filter((project) => projectOrganizationIds.get(project.id) === currentOrganizationId),
);

/**
 * @returns {List}
 */
export const selectCurrentOrganizationNonDirectProjectsData = createImmutableEqualSelector(
  selectCurrentOrganizationProjectsData,
  (projectsData) => projectsData.filter((project) => project.projectType !== ProjectType.DIRECT_CHAT),
);

/**
 * @returns {boolean}
 */
export const selectHasCurrentOrganizationNonDirectProjectsData = createImmutableEqualSelector(
  selectCurrentOrganizationNonDirectProjectsData,
  (projectsData) => projectsData.size > 0,
);

/**
 * @returns {boolean}
 */
export const selectHasCurrentOrganizationNonDirectNotArchivedProjectsData = createImmutableEqualSelector(
  selectCurrentOrganizationNonDirectProjectsData,
  (projectsData) => projectsData.filter((project) => project.status !== EntityStatus.ARCHIVED).size > 0,
);

/**
 * @returns {List}
 */
export const selectAvailableSpacesIds = createImmutableEqualSelector(
  selectCurrentOrganizationProjectsData,
  selectProjectsPeople,
  selectCurrentUserId,
  selectCurrentOrganizationId,
  (currentOrganizationProjectsData, projectsPeople, currentUserId, currentOrganizationId) => {
    let availableSpacesIds = emptyList as List<Id>;
    currentOrganizationProjectsData.forEach((project) => {
      const projectPeople = projectsPeople.get(project.id) || emptyList;

      if (
        !isProjectGroupOrDirectChat(project) &&
        project.status !== EntityStatus.ARCHIVED &&
        projectPeople &&
        (!project.isPrivate || projectPeople.indexOf(currentUserId) > -1) &&
        project.organizationId === currentOrganizationId
      ) {
        availableSpacesIds = availableSpacesIds.push(project.id);
      }
    });

    return availableSpacesIds;
  },
);

/**
 * @returns {List}
 */
export const selectAvailableVisibleSpacesIds = createImmutableEqualSelector(
  selectAvailableSpacesIds,
  selectProjectsPeople,
  selectCurrentUserId,
  (availableSpacesIds, projectsPeople, currentUserId) => {
    let availableVisibleSpacesIds = emptyList as List<Id>;
    availableSpacesIds.forEach((spaceId) => {
      const projectPeople = projectsPeople.get(spaceId);

      if (projectPeople && projectPeople.indexOf(currentUserId) > -1) {
        availableVisibleSpacesIds = availableVisibleSpacesIds.push(spaceId);
      }
    });

    return availableVisibleSpacesIds;
  },
);

/**
 * @returns {List}
 */
export const selectAvailableVisibleSpaces = createImmutableEqualSelector(
  selectProjectsData,
  selectAvailableVisibleSpacesIds,
  (projectsData, availableVisibleSpacesIds) =>
    getRecordsByIds<ProjectInterface>(availableVisibleSpacesIds, projectsData),
);

/**
 * @returns {List}
 */
export const selectAvailableInvisibleSpacesIds = createImmutableEqualSelector(
  selectAvailableSpacesIds,
  selectProjectsPeople,
  selectCurrentUserId,
  (availableSpacesIds, projectsPeople, currentUserId) => {
    let availableVisibleSpacesIds = emptyList as List<Id>;

    availableSpacesIds.forEach((spaceId) => {
      const projectPeople = projectsPeople.get(spaceId) || emptyList;

      if (projectPeople && projectPeople.indexOf(currentUserId) === -1) {
        availableVisibleSpacesIds = availableVisibleSpacesIds.push(spaceId);
      }
    });

    return availableVisibleSpacesIds;
  },
);

/**
 * @returns {List}
 */
export const selectAvailableInvisibleSpaces = createImmutableEqualSelector(
  selectProjectsData,
  selectAvailableInvisibleSpacesIds,
  (projectsData, availableInvisibleSpacesIds) =>
    getRecordsByIds<ProjectInterface>(availableInvisibleSpacesIds, projectsData),
);

/**
 * @returns {List}
 */
export const selectUserArchivedSpaceIds = createImmutableEqualSelector(
  selectCurrentOrganizationProjectsData,
  selectProjectsPeople,
  selectCurrentUserId,
  (currentOrganizationProjectsData, projectsPeople, currentUserId) => {
    let archivedSpaceIds = emptyList as List<Id>;
    currentOrganizationProjectsData.forEach((project) => {
      const projectPeople = projectsPeople.get(project.id);
      if (
        !isProjectGroupOrDirectChat(project) &&
        project.status === EntityStatus.ARCHIVED &&
        projectPeople &&
        projectPeople.indexOf(currentUserId) > -1
      ) {
        archivedSpaceIds = archivedSpaceIds.push(project.id);
      }
    });

    return archivedSpaceIds;
  },
);

/**
 * @returns {List}
 */
export const selectUserArchivedSpaces = createImmutableEqualSelector(
  selectProjectsData,
  selectUserArchivedSpaceIds,
  selectProjectsPeopleRole,
  selectCurrentUserId,
  selectIsCurrentUserOrganizationAdmin,
  (projectsData, archivedSpaceIds, projectsPeopleRole, currentUserId, isCurrentUserOrganizationAdmin) => {
    const projects = getRecordsByIds<ProjectInterface>(archivedSpaceIds, projectsData);
    if (isCurrentUserOrganizationAdmin) {
      return projects;
    }
    return projects.filter((project) => {
      const projectPeople = projectsPeopleRole.get(project.id);
      const currentUserRole = projectPeople.get(currentUserId);
      return managerRoles.includes(currentUserRole);
    }) as List<ProjectInterface>;
  },
);

/**
 * @param {string} userId
 * @returns {List}
 */
export const selectUserSharedSpaceIdsWithCurrentUser = createCachedSelector(
  selectProjectsData,
  selectCurrentOrganizationId,
  selectProjectOrganizationIds,
  selectProjectsPeople,
  selectCurrentUserId,
  selectChatNotificationSettingsTypeMap,
  (_, args) => args.userId,
  (
    projectsData,
    currentOrganizationId,
    projectOrganizationIds,
    projectsPeople,
    currentUserId,
    chatNotificationSettingsTypeMap,
    userId,
  ) => {
    let availableSpacesIds = emptyList as List<Id>;
    const currentOrganizationProjectsData = projectsData.filter(
      (project) => projectOrganizationIds.get(project.id) === currentOrganizationId,
    );

    currentOrganizationProjectsData.forEach((project) => {
      const projectPeople = projectsPeople.get(project.id);

      if (
        !isProjectGroupOrDirectChat(project) &&
        project.status !== EntityStatus.ARCHIVED &&
        projectPeople &&
        projectPeople.includes(currentUserId) &&
        projectPeople.includes(userId)
      ) {
        availableSpacesIds = availableSpacesIds.push(project.id);
      }
    });

    return sortSpaces(availableSpacesIds, projectsData, chatNotificationSettingsTypeMap);
  },
)((_, args) => generateSelectorName(args, ['userId']));

/**
 * @returns {Map}
 */
export const selectConversationsName = createImmutableEqualSelector(
  selectProjectsData,
  selectProjectsPeople,
  selectCurrentUserId,
  selectUsersData,
  selectCurrentOrganizationId,
  (projectsData, projectsPeople, currentUserId, usersData, organizationId): Map<Id, string> => {
    let result = emptyMap as Map<Id, string>;

    if (!projectsData) {
      return result;
    }
    projectsData.valueSeq().forEach((project) => {
      const projectId = project.id;
      if (isProjectGroupOrDirectChat(project)) {
        const projectPeople = projectsPeople.get(projectId);
        const conversationPeople = usersData
          .filter((user) => projectPeople && projectPeople.includes(user.id))
          .valueSeq()
          .toList();
        const userIds = conversationPeople.map((user) => user.id);
        const conversationId = generateConversationId(userIds as List<Id>, organizationId);
        const people = conversationPeople.filter((person) => person.id !== currentUserId);
        // @ts-ignore
        const name =
          project.name || getConversationName(people as List<User>) || getConversationName(conversationPeople);
        result = result.set(conversationId, name);
      }
    });

    return result;
  },
);

/**
 * @returns {Map}
 */
export const selectProjectsName = createImmutableEqualSelector(selectProjectsData, (projectsData) => {
  let result = emptyMap as Map<Id, string>;

  if (!projectsData) {
    return result;
  }

  projectsData.forEach((project, projectId) => {
    result = result.set(projectId, project.name);
  });

  return result;
});

/**
 * @param {string} conversationId
 * @returns {string | null}
 */
export const selectConversationName = createCachedSelector(
  selectConversationsName,
  (_, args) => args.conversationId,
  (conversationsName, conversationId) => {
    if (conversationsName) {
      return conversationsName.get(conversationId);
    } else {
      return null;
    }
  },
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {string} projectId
 * @returns {string | null}
 */
export const selectConversationIdByProjectId = createCachedSelector(
  selectProjectPeople,
  selectCurrentOrganizationId,
  (people, organizationId) => generateConversationId(people, organizationId),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} projectId
 * @returns {string | null}
 */
export const selectConversationNameByProjectId = createCachedSelector(
  selectConversationIdByProjectId,
  selectConversationsName,
  (_, args) => args.projectId,
  (conversationId, conversationsName) => {
    if (conversationsName) {
      return conversationsName.get(conversationId);
    } else {
      return null;
    }
  },
)((_, args) => generateSelectorName(args, ['projectId']));

export const selectMyselfConversationId = createSelector(
  selectCurrentUserId,
  selectCurrentOrganizationId,
  (userId, organizationId) => generateConversationId([userId], organizationId),
);

/**
 * @param {string} sectionId
 * @returns {number | undefined}
 */
export const selectSectionScrollTop = createCachedSelector(
  selectSectionsScrollTopDomain,
  (_, args) => args.sectionId,
  (sectionsScrollTop, sectionId) => sectionsScrollTop.get(sectionId),
)((_, args) => generateSelectorName(args, ['sectionId']));

/**
 * @param {string} projectId
 * @returns {number | undefined}
 */
export const selectKanbanScrollLeft = createCachedSelector(
  selectKanbanScrollLeftDomain,
  (_, args) => args.projectId,
  (kanbanScrollLeft, projectId) => kanbanScrollLeft.get(projectId),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} conversationId
 * @returns {boolean}
 */
export const selectIsConversationVisible = createCachedSelector(
  selectIsConversationVisibleDomain,
  (_, args) => args.conversationId,
  (isConversationVisibleDomain, conversationId) => isConversationVisibleDomain.get(conversationId),
)((_, args) => generateSelectorName(args, ['conversationId']));

export const selectCurrentUserSharedProjectsPeople = createSelector(
  selectProjectsPeople,
  selectCurrentUserId,
  selectProjectTypes,
  (projectsPeople, currentUserId, projectsTypes) =>
    projectsPeople
      .reduce((userProjectsPeople: List<Id>, projectPeople: List<Id>, projectId: Id) => {
        const projectType = projectsTypes.get(projectId);
        if (projectType === ProjectType.PROJECT && projectPeople.includes(currentUserId)) {
          userProjectsPeople = mergeLists<Id>(userProjectsPeople, projectPeople);
        }
        return userProjectsPeople;
      }, emptyList)
      .filter((userId) => userId !== currentUserId) as List<Id>,
);

/**
 * @returns {List}
 */
export const selectCurrentUserConversationsProjectIds = createImmutableEqualSelector(
  selectProjectIds,
  selectProjectsTypes,
  selectCurrentOrganizationId,
  selectProjectOrganizationIds,
  selectProjectsPeople,
  selectCurrentUserId,
  selectIsCurrentUserOrganizationGuest,
  selectCurrentUserSharedProjectsPeople,
  selectCurrentOrganizationActivePeopleRole,
  selectCustomFieldsDomain,
  selectExtensionIdsByNamespaces,
  selectUserInOrganizationIdsDomain,
  (
    projectIds,
    projectsTypes,
    currentOrganizationId,
    projectOrganizationIds,
    projectsPeople,
    currentUserId,
    isCurrentUserOrganizationGuest,
    currentUserSharedProjectPeople,
    organizationPeopleRole,
    customFields,
    extensionIdsByNamespaces,
    userInOrganizationIdsDomain,
  ) => {
    let conversationsIds = emptyList as List<Id>;
    projectIds.forEach((projectId) => {
      const projectPeople = projectsPeople.get(projectId);
      const projectType = projectsTypes.get(projectId);
      const isProjectInCurrentOrganization = projectOrganizationIds.get(projectId) === currentOrganizationId;
      const isConversation = isProjectGroupOrDirectChatByType(projectType);
      const isDirectChat = projectType === ProjectType.DIRECT_CHAT;
      if (isConversation && projectPeople && projectPeople.includes(currentUserId) && isProjectInCurrentOrganization) {
        if (isDirectChat) {
          const otherUserId = projectPeople.filter((userId) => userId !== currentUserId).first();

          if (otherUserId) {
            const isOtherUserGuest = organizationPeopleRole.get(otherUserId) === OrganizationPeopleRole.GUEST;
            const extensionId = extensionIdsByNamespaces.get(ExtensionNamespace.CHAT_WITH_ME);
            const userInOrganizationId = userInOrganizationIdsDomain.getIn([currentOrganizationId, otherUserId]);
            let inviterId = customFields.get(
              generateExtensionCustomFieldId(
                extensionId,
                TargetType.USER_IN_ORGANIZATION,
                userInOrganizationId,
                FieldType.INVITER_ID,
              ),
            );

            if (!inviterId) {
              const currentUserInOrganizationId = userInOrganizationIdsDomain.getIn([
                currentOrganizationId,
                currentUserId,
              ]);
              inviterId = customFields.get(
                generateExtensionCustomFieldId(
                  extensionId,
                  TargetType.USER_IN_ORGANIZATION,
                  currentUserInOrganizationId,
                  FieldType.INVITER_ID,
                ),
              );
            }

            const isFromInvitation = inviterId && [otherUserId, currentUserId].includes(inviterId);
            const includedInSharedProject = currentUserSharedProjectPeople.includes(otherUserId);
            if (!isFromInvitation && (isCurrentUserOrganizationGuest || isOtherUserGuest) && !includedInSharedProject) {
              return;
            }
          }
        }

        conversationsIds = conversationsIds.push(projectId);
      }
    });

    return conversationsIds;
  },
);

/**
 * @param {string} conversationId
 * @return {string}
 */
export const selectProjectIdByConversationId = createCachedSelector(
  selectProjectIdsByConversationIds,
  (_, args) => args.conversationId,
  (projectIdsByConversationIds, conversationId) => projectIdsByConversationIds.get(conversationId),
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {boolean} shouldIncludeInvisibleConversations
 * @return {Map}
 */
export const selectConversationDescriptors = createImmutableEqualSelector(
  selectCurrentOrganizationId,
  selectCurrentUserConversationsProjectIds,
  selectProjectsPeople,
  selectIsConversationVisibleDomain,
  selectConversationsName,
  selectProjectsHaveUnreadMessages,
  selectCurrentOrganizationActivePeopleRole,
  selectCurrentUserId,
  selectCurrentOrganizationUserIds,
  (_, args) => args?.shouldIncludeInvisibleConversations,
  (
    organizationId: Id,
    projectIds: List<Id>,
    projectsPeople: Map<Id, List<Id>>,
    visibilityDomain: Map<Id, boolean>,
    conversationsNames: Map<Id, string>,
    projectsHaveUnreadMessages: Map<Id, boolean>,
    organizationPeopleRole: Map<Id, OrganizationPeopleRole>,
    currentUserId: Id,
    currentOrganizationUserIds: List<Id>,
    shouldIncludeInvisibleConversations,
  ): Map<Id, ConversationDescriptorRecordInterface> => {
    let conversationDescriptors = emptyMap as Map<Id, ConversationDescriptorRecordInterface>;
    const filteredProjectIds = projectIds.filter((projectId) => {
      const conversationPeopleIds = projectsPeople.get(projectId);
      return conversationPeopleIds.every((conversationPersonId) =>
        currentOrganizationUserIds.includes(conversationPersonId),
      );
    });
    filteredProjectIds.forEach((projectId) => {
      const conversationPeople = projectsPeople.get(projectId);
      const conversationId = generateConversationId(conversationPeople, organizationId);
      const name = conversationsNames.get(conversationId) || '';
      const hasUnreadMessages = projectsHaveUnreadMessages.get(projectId);
      const isSetVisible = visibilityDomain.get(conversationId);
      const isVisible = Boolean(isSetVisible || isSetVisible === undefined || hasUnreadMessages);

      if (!shouldIncludeInvisibleConversations && !isVisible) {
        return;
      }
      conversationDescriptors = conversationDescriptors.set(
        conversationId,
        ConversationDescriptor({
          conversationId,
          projectId,
          type: conversationPeople.size <= 2 ? ProjectType.DIRECT_CHAT : ProjectType.GROUP_CHAT,
          people: conversationPeople,
          name,
          isGuestConversation: isGuestConversation(conversationPeople, organizationPeopleRole, currentUserId),
        }),
      );
    });

    return conversationDescriptors;
  },
);

function isGuestConversation(
  people: List<Id>,
  organizationPeopleRole: Map<Id, OrganizationPeopleRole>,
  currentUserId: Id,
): boolean {
  const isDirectChat = people.size <= 2;
  if (!isDirectChat || !organizationPeopleRole) {
    return false;
  }

  const secondUserId = people.filter((userId) => userId !== currentUserId).first();

  if (!secondUserId) {
    return false;
  }

  const secondUserRole = organizationPeopleRole.get(secondUserId);
  return secondUserRole === OrganizationPeopleRole.GUEST;
}

/**
 * @return {Map}
 */
export const selectSortedConversationDescriptors = createImmutableEqualSelector(
  selectConversationDescriptors,
  (conversationDescriptors): List<ConversationDescriptorRecordInterface> => {
    if (conversationDescriptors.isEmpty()) {
      return emptyList as List<ConversationDescriptorRecordInterface>;
    }

    let descriptors = conversationDescriptors.valueSeq().toList();
    const selfConversationDescriptor = descriptors.find((descriptor) => descriptor.people.size === 1);
    descriptors = descriptors.filter(
      (descriptor) => descriptor.people.size > 1,
    ) as List<ConversationDescriptorRecordInterface>;

    descriptors = descriptors.sort((descriptorA, descriptorB) => {
      return descriptorA.name.toLowerCase() < descriptorB.name.toLowerCase() ? -1 : 1;
    }) as List<ConversationDescriptorRecordInterface>;

    if (selfConversationDescriptor) {
      descriptors = descriptors.insert(0, selfConversationDescriptor);
    }

    return descriptors;
  },
);

export const selectFirstConversationId = createImmutableEqualSelector(
  selectSortedConversationDescriptors,
  (descriptors) =>
    descriptors.size
      ? // @ts-ignore
        descriptors.first().conversationId
      : null,
);

/**
 * @param {string} projectId
 * @return {string | null}
 */
export const selectProjectType = createCachedSelector(selectProject, (project) =>
  project ? project.projectType : null,
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {List<Ids>} people
 * @return {string}
 */
export const selectConversationId = createCachedSelector(
  selectProjectsData,
  selectProjectsPeople,
  (_, args) => args.people,
  selectCurrentOrganizationId,
  selectProjectOrganizationIds,
  (projectsData, projectsPeople, peopleIds, currentOrganizationId, projectOrganizationIds) => {
    let result = null;
    const projectIds = projectsData
      .filter((project) => project.projectType !== ProjectType.PROJECT)
      .map((project) => project.id)
      .toList();

    peopleIds = peopleIds.toSet().toList(); // remove duplicated user ids

    for (let i = 0; i < projectIds.size; i++) {
      const projectId = projectIds.get(i);
      const projectPeople = projectsPeople.get(projectId);
      const projectData = projectsData.get(projectId);
      if (projectPeople && peopleIds) {
        const projectOrganizationId = projectOrganizationIds.get(projectId);
        if (
          projectData &&
          projectPeople.sort().equals(peopleIds.sort()) &&
          projectOrganizationId === currentOrganizationId
        ) {
          result = projectId;
          break;
        }
      }
    }

    return result;
  },
)((_, args) => generateSelectorName(args, ['people']));

/**
 * @param {string} projectId
 * @return {boolean}
 */
export const selectProjectHasUnreadMessages = createCachedSelector(
  selectProjectsHaveUnreadMessages,
  (_, args) => args.projectId,
  (projectsHaveUnreadMessages, projectId) => projectsHaveUnreadMessages.get(projectId),
)((_, args) => generateSelectorName(args, ['projectId']));

export const selectHasCurrentUserUnreadMessages = createImmutableEqualSelector(
  selectProjectsHaveUnreadMessages,
  (projectsHaveUnreadMessages) => projectsHaveUnreadMessages.filter(Boolean).size > 0,
);

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectProjectFileIds = createCachedSelector(
  selectProjectsFileIds,
  selectFilesData,
  (_, args) => args.projectId,
  (projectsFileIds, filesData, projectId) => {
    const filesIds = projectsFileIds.get(projectId) || (emptyList as List<Id>);
    return filesIds
      .filter((fileId) => {
        const file = filesData.get(fileId);
        return file && isImage(file.contentType);
      })
      .sort((fileIdA, fileIdB) => filesData.get(fileIdB).timestamp - filesData.get(fileIdA).timestamp);
  },
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} objectId
 * @return {string}
 */
export const selectProjectIdByObjectId = createCachedSelector(
  selectProjectIdsByConversationIds,
  (_, args) => args.objectId,
  (projectIdsByConversationIds, objectId) => {
    const projectIds = projectIdsByConversationIds.valueSeq();
    if (projectIds.includes(objectId)) {
      return objectId;
    } else if (projectIdsByConversationIds.has(objectId)) {
      return projectIdsByConversationIds.get(objectId);
    }
    return objectId;
  },
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} conversationId
 * @return {List}
 */
export const selectConversationPeople = createCachedSelector(
  selectConversationDescriptors,
  (_, args) => args.conversationId,
  (conversationDescriptors, conversationId) => {
    const descriptor = conversationDescriptors.get(conversationId);
    return descriptor ? (descriptor.get('people') as List<Id>) : (emptyList as List<Id>);
  },
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {string} conversationId
 * @return {List}
 */
export const selectConversationType = createCachedSelector(
  selectConversationDescriptors,
  (_, args) => args.conversationId,
  (conversationDescriptors, conversationId) => {
    const descriptor = conversationDescriptors.get(conversationId);
    return descriptor ? descriptor.get('type') : undefined;
  },
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {string} conversationId
 * @return {string}
 */
export const selectDirectChatPartner = createCachedSelector(
  selectConversationPeople,
  selectCurrentUserId,
  (conversationPeople, currentUserId) => {
    const peopleWithoutCurrentUser = conversationPeople.filter((id) => id !== currentUserId);
    if (peopleWithoutCurrentUser.size > 0) {
      return peopleWithoutCurrentUser.first();
    } else {
      return currentUserId;
    }
  },
)((_, args) => generateSelectorName(args, ['conversationId']));

/**
 * @param {string} projectId
 * @return {List}
 */
export const selectInvitableOrganizationMembers = createCachedSelector(
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectProjectPeople,
  (userIds, memberIds) => userIds.filterNot((userId) => memberIds.includes(userId)),
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} userId
 * @return {List}
 */
export const selectUserAssignedProjectIds = createCachedSelector(
  selectProjectsPeopleRoleDomain,
  selectProjectTypes,
  (_, args) => args.userId,
  (projectsPeopleRole, projectTypes, userId) =>
    projectsPeopleRole
      .filter(
        (projectPeopleRoles, projectId) =>
          projectTypes.get(projectId) === ProjectType.PROJECT && projectPeopleRoles.keySeq().includes(userId),
      )
      .keySeq()
      .toList(),
)((_, args) => generateSelectorName(args, ['userId']));

export const selectCurrentUserAssignedProjectIds = createSelector(
  selectProjectsPeopleRoleDomain,
  selectProjectTypes,
  selectCurrentUserId,
  (projectsPeopleRole, projectTypes, userId) =>
    projectsPeopleRole
      .filter(
        (projectPeopleRoles, projectId) =>
          projectTypes.get(projectId) === ProjectType.PROJECT && projectPeopleRoles.keySeq().includes(userId),
      )
      .keySeq()
      .toList(),
);

/**
 * @param {string} userId
 * @return {List}
 */
export const selectUserAssignedProjectNames = createCachedSelector(
  selectUserAssignedProjectIds,
  selectProjectNames,
  (projectIds, projectNames) => projectIds.map((projectId) => projectNames.get(projectId)),
)((_, args) => generateSelectorName(args, ['userId']));

/**
 * @param {string} projectId
 * @return {bool}
 */
export const selectIsCurrentUserProjectMember = createCachedSelector(
  selectCurrentUserId,
  selectProjectPeople,
  (currentUserId, projectPeople) => projectPeople.includes(currentUserId),
)((_, args) => generateSelectorName(args, ['projectId']));

// args: organizationId
export const selectProjectsHaveUnreadMessagesInWorkspace = createCachedSelector(
  selectProjectsHaveUnreadMessages,
  selectProjectOrganizationIds,
  (_, args) => args.organizationId,
  (projectsHaveUnreadMessages, projectOrganizationIds, organizationId) =>
    projectsHaveUnreadMessages.filter((_, projectId) => projectOrganizationIds.get(projectId) === organizationId),
)((_, args) => generateSelectorName(args, ['organizationId']));

/**
 * @returns {List}
 */
export const selectAvailableVisibleSpacesSearchDescriptors = createImmutableEqualSelector(
  selectAvailableVisibleSpacesIds,
  selectProjectsName,
  (visibleProjectIds, projectNames) =>
    visibleProjectIds.map((projectId) =>
      QuickSwitcherChatDescriptor({
        projectId,
        name: projectNames.get(projectId) || '',
        type: ProjectType.PROJECT,
        isCurrentUserSpaceMember: true,
      }),
    ) as List<QuickSwitcherChatDescriptorRecordInterface>,
);

/**
 * @returns {List}
 */
export const selectAvailableInvisibleSpacesSearchDescriptors = createImmutableEqualSelector(
  selectAvailableInvisibleSpacesIds,
  selectProjectsName,
  (invisibleProjectIds, projectNames) =>
    invisibleProjectIds.map((projectId) =>
      QuickSwitcherChatDescriptor({
        projectId,
        name: projectNames.get(projectId) || '',
        type: ProjectType.PROJECT,
        isCurrentUserSpaceMember: false,
      }),
    ) as List<QuickSwitcherChatDescriptorRecordInterface>,
);

export const selectExistingConversationQuickSwitcherDescriptorsList = createImmutableEqualSelector(
  selectConversationDescriptors,
  (conversationDescriptors) =>
    conversationDescriptors
      .valueSeq()
      .toList()
      .map(({ projectId, conversationId, name, type }) =>
        QuickSwitcherChatDescriptor({
          projectId,
          conversationId,
          name,
          type,
          isCurrentUserSpaceMember: false,
        }),
      ) as List<QuickSwitcherChatDescriptorRecordInterface>,
);

export const selectQuickSwitcherConversationSearchDescriptorsSortedByLatestActive = createImmutableEqualSelector(
  selectExistingConversationQuickSwitcherDescriptorsList,
  selectAvailableVisibleSpacesSearchDescriptors,
  selectAvailableInvisibleSpacesSearchDescriptors,
  selectMessagesCreatedAt,
  selectObjectMessages,
  selectChatNotificationSettingsTypeMap,
  (
    conversationDescriptors,
    visibleSpacesDescriptors,
    invisibleSpacesDescriptors,
    messagesCreatedAt,
    objectMessages,
    objectNotificationSettings,
  ): List<QuickSwitcherChatDescriptorRecordInterface> => {
    let unmutedVisibleSpaceDescriptors = emptyList as List<QuickSwitcherChatDescriptorRecordInterface>;
    let mutedVisibleSpaceDescriptors = emptyList as List<QuickSwitcherChatDescriptorRecordInterface>;

    visibleSpacesDescriptors.forEach((descriptor) => {
      const projectId = descriptor.projectId;
      const isMuted = objectNotificationSettings.get(projectId) === ChatNotificationSettingsType.NOTHING;

      if (isMuted) {
        mutedVisibleSpaceDescriptors = mutedVisibleSpaceDescriptors.push(descriptor);
      } else {
        unmutedVisibleSpaceDescriptors = unmutedVisibleSpaceDescriptors.push(descriptor);
      }
    });

    const spacesAndConversationsSearchDescriptors = mergeLists<QuickSwitcherChatDescriptorRecordInterface>(
      conversationDescriptors,
      unmutedVisibleSpaceDescriptors,
    ) as List<QuickSwitcherChatDescriptorRecordInterface>;

    const sortedVisibleSpacesWithConversationsDescriptors = sortConversationDescriptorsByLatestMessage(
      injectLatestMessageCreatedAtToDescriptors(
        spacesAndConversationsSearchDescriptors,
        objectMessages,
        messagesCreatedAt,
      ),
    );

    const sortedInvisibleSpaces = sortConversationDescriptorsByLatestMessage(
      injectLatestMessageCreatedAtToDescriptors(invisibleSpacesDescriptors, objectMessages, messagesCreatedAt),
    ) as List<QuickSwitcherChatDescriptorRecordInterface>;

    const sortedMutedVisibleSpaceDescriptors = sortConversationDescriptorsByLatestMessage(
      injectLatestMessageCreatedAtToDescriptors(mutedVisibleSpaceDescriptors, objectMessages, messagesCreatedAt),
    ) as List<QuickSwitcherChatDescriptorRecordInterface>;

    return sortedVisibleSpacesWithConversationsDescriptors
      .concat(sortedInvisibleSpaces)
      .concat(sortedMutedVisibleSpaceDescriptors) as List<QuickSwitcherChatDescriptorRecordInterface>;
  },
);

// args: projectId
export const selectProjectAvailableAssignees = createCachedSelector(
  selectCurrentOrganizationActivePeople,
  selectCurrentOrganizationActivePeopleRole,
  selectProjectPeople,
  (usersIds, organizationPeopleRole, projectPeople) =>
    usersIds.filter((userId) => {
      const isUserGuest = organizationPeopleRole.get(userId) === OrganizationPeopleRole.GUEST;
      return !isUserGuest || projectPeople.includes(userId);
    }),
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectAlphabeticallySortedProjectAvailableAssignees = createCachedSelector(
  selectProjectAvailableAssignees,
  selectUsersSearchName,
  selectCurrentUserId,
  (usersIds, usersSearchNames, currentUserId) =>
    sortTaskAssignees(usersIds.toIndexedSeq().toList(), usersSearchNames, currentUserId),
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId, taskId
export const selectAlphabeticallySortedTaskAvailableAssignees = createCachedSelector(
  selectProjectAvailableAssignees,
  selectUsersSearchName,
  selectTaskAssigneeIds,
  selectCurrentUserId,
  (usersIds, usersSearchNames, taskAssigneeIds: List<Id>, currentUserId) =>
    sortTaskAssignees(
      usersIds.filter((userId) => !taskAssigneeIds.includes(userId)) as List<Id>,
      usersSearchNames,
      currentUserId,
    ),
)((_, args) => generateSelectorName(args, ['projectId', 'taskId']));

export const selectAllDirectConversationUserIds = createSelector(
  selectCurrentOrganizationUserIds,
  selectCurrentUserId,
  selectUsersName,
  (userIds, currentUserId, usersName) => {
    let filteredUserIds = userIds;
    if (!filteredUserIds.includes(currentUserId)) {
      filteredUserIds = filteredUserIds.push(currentUserId);
    }
    return sortUserIdsByNames(filteredUserIds, usersName);
  },
);

export const selectAvailableDirectConversationUserIds = createSelector(
  selectCurrentOrganizationUserIds,
  selectCurrentUserId,
  selectUsersName,
  selectUsersStatusInCurrentOrganization,
  (userIds, currentUserId, usersName, usersStatusMap) => {
    let filteredUserIds = userIds.filter(
      (userID: Id) => usersStatusMap.get(userID) === EntityStatus.EXISTS,
    ) as List<Id>;
    if (!filteredUserIds.includes(currentUserId)) {
      filteredUserIds = filteredUserIds.push(currentUserId);
    }
    return sortUserIdsByNames(filteredUserIds, usersName);
  },
);

/**
 * @param {string} projectId
 * @returns {boolean}
 */
export const selectIsProjectOnboarding = createCachedSelector(selectProject, (project) => {
  if (!project) {
    return false;
  }

  return project.autoJoin && ['Wprowadzenie', 'Onboarding'].includes(project.name);
})((_, args) => generateSelectorName(args, ['projectId']));
