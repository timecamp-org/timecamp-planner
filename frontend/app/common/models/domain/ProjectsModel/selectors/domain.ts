import * as Constants from '../constants'

import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import {
  ProjectsData,
  ProjectsPeopleRole,
  ProjectsPeople,
  ProjectType, ProjectsState,
} from '../types';
import { Id } from '../../../../utils/identifier';
import { List, Map } from 'immutable';
import { EntityStatus } from '../../EntityModel/types';
import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { ApplicationState } from 'common/types'
import { createSelector } from 'reselect';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

const emptyList = List()

/**
 * Direct selector to the projectsTree state domain
 */
export const selectProjectsDomain = (state: ApplicationState): ProjectsState => state.get(Constants.domain)

export const selectProjectsDataDomain = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectsData') as ProjectsData,
)

export const selectProjectsPeople = createImmutableEqualSelector<
  ApplicationState,
  ProjectsState,
  ProjectsPeople>(
  selectProjectsDomain,
  (domain) => domain.get('projectPeople') as ProjectsPeople,
)

export const selectProjectsPeopleRoleDomain = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectPeopleRole') as ProjectsPeopleRole,
)

export const selectProjectOrganizationIds = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectOrganizationIds') as Map<Id, Id>
)

export const selectSectionsScrollTopDomain = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('sectionsScrollTop') as Map<Id, number>
)

export const selectKanbanScrollLeftDomain = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('kanbanScrollLeft') as Map<Id, number>
)

export const selectProjectsFollowerIds = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectFollowerIds') as Map<Id, List<Id>>
)

export const selectProjectsHaveUnreadMessages = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectsHaveUnreadMessages') as Map<Id, boolean>
)

export const selectProjectNames = createImmutableEqualSelector(
  selectProjectsDataDomain,
  projects => projects.map(project => project.name) as Map<Id, string>,
)

export const selectProjectTypes = createImmutableEqualSelector(
  selectProjectsDataDomain,
  projects => projects.map(project => project.projectType) as Map<Id, ProjectType>,
)

/**
 * @returns {Map}
 */
export const selectIsConversationVisibleDomain = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('isConversationVisible') as Map<Id, boolean>,
)

/**
 * @returns {Map}
 */
export const selectProjectsFileIds = createImmutableEqualSelector(
  selectProjectsDomain,
  (domain) => domain.get('projectFileIds') as Map<Id, List<Id>>,
)

/**
 * @returns {Map}
 */
export const selectProjectStatuses = createImmutableEqualSelector(
  selectProjectsDataDomain,
  (projects) => projects.map(project => project.status) as Map<Id, EntityStatus>,
)

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectProjectPeople = createCachedSelector<
  ApplicationState,
  { projectId: Id },
  ProjectsPeople,
  Id,
  List<string>>(
  selectProjectsPeople,
  (_, args) => args.projectId,
  (projectsPeople, projectId) => projectsPeople.get(projectId) || emptyList as List<string>,
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

export const selectFirstProjectDomain = createSelector(
  selectProjectsDomain,
  (domain): Map<Id, Id> => domain.get('firstProjectIds') as Map<Id, Id>,
)

export const selectCurrentFirstProjectId = createSelector(
  selectFirstProjectDomain,
  selectCurrentOrganizationId,
  (firstProjectIds, organizationId): Id => firstProjectIds.get(organizationId)
)
