import { selectCurrentUserId } from '../../UsersModel/selectors/domain'
import { selectProjectsDataDomain, selectProjectsPeopleRoleDomain } from './domain'
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'

import { getCurrentUserAccessibleProjectIds } from '../../PermissionsModel/utils'
import { selectCurrentUserCurrentOrganizationRole } from '../../OrganizationsModel/selectors'
import { ProjectsData, ProjectsPeopleRole } from '../types';
import { Id } from '../../../../utils/identifier';
import { OrganizationPeopleRole } from '../../OrganizationsModel/types';

export const selectCurrentUserAccessibleProjectIds = createImmutableEqualSelector(
  selectCurrentUserId,
  selectProjectsDataDomain,
  selectProjectsPeopleRoleDomain,
  selectCurrentUserCurrentOrganizationRole,
  (userId: Id, projectsData: ProjectsData, projectsPeopleRole: ProjectsPeopleRole, organizationRole: OrganizationPeopleRole) => 
    getCurrentUserAccessibleProjectIds(userId, projectsData, projectsPeopleRole, organizationRole),
)
