import { filterSpaces, sortSpaces } from '../helpers';

import { selectChatNotificationSettingsTypeMap } from '../../NotificationsModel/selectors/domain';
import { selectProjectsData, selectAvailableVisibleSpacesIds } from './index';

import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { createSelector } from 'reselect';
import {
  selectCurrentFirstProjectId,
  selectProjectsDataDomain,
  selectProjectsPeople,
} from 'models/domain/ProjectsModel/selectors/domain';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { isProjectGroupOrDirectChatByType } from 'models/domain/ProjectsModel/helpers';
import { ProjectType } from 'models/domain/ProjectsModel/types';
import { generateConversationId } from 'common/utils/generateCombinedId';
import { Maybe, FirstProjectInterface } from 'common/types';

export const selectSortedAvailableVisibleSpacesIds = createImmutableEqualSelector(
  selectAvailableVisibleSpacesIds,
  selectProjectsData,
  selectChatNotificationSettingsTypeMap,
  (availableSpacesIds, projectsData, chatNotificationSettingsTypeMap) =>
    sortSpaces(availableSpacesIds, projectsData, chatNotificationSettingsTypeMap)
);

export const selectSortedAndFilteredAvailableVisibleSpacesIds = createSelector(
  selectProjectsData,
  selectSortedAvailableVisibleSpacesIds,
  (_, args) => args.searchFilter,
  (projectsData, sortedIds, searchFilter) => filterSpaces(projectsData, sortedIds, searchFilter)
);

export const selectFirstProjectData = createSelector(
  selectCurrentFirstProjectId,
  selectCurrentOrganizationId,
  selectProjectsPeople,
  selectProjectsDataDomain,
  selectSortedAvailableVisibleSpacesIds,
  (firstProjectId, organizationId, projectsPeople, projectsData, sortedSpaceIds): Maybe<FirstProjectInterface> => {
    if (!firstProjectId) {
      const firstVisibleSpaceId = sortedSpaceIds.first();

      if (!firstVisibleSpaceId) {
        return null;
      }

      return {
        projectId: firstVisibleSpaceId,
        projectType: ProjectType.PROJECT,
      };
    }

    const projectType = projectsData.getIn([firstProjectId, 'projectType']);
    let conversationHash;
    if (isProjectGroupOrDirectChatByType(projectType)) {
      const firstProjectPeople = projectsPeople.get(firstProjectId);
      conversationHash = generateConversationId(firstProjectPeople, organizationId);
    }

    return {
      projectId: firstProjectId,
      conversationHash,
      projectType,
    };
  }
);
