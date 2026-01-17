import { selectCurrentUserId } from '../../UsersModel/selectors/domain'
import { selectIsCurrentUserOrganizationAdmin, selectIsCurrentUserOrganizationGuest } from '../../OrganizationsModel/selectors'
import { ProjectPeopleRole, ProjectType } from '../types';
import { selectProjectPeopleRole, selectProjectType } from './index';
import generateSelectorName from '../../../../utils/generateSelectorName';
import createCachedSelector from 're-reselect'

const spaceEditRoles = [ProjectPeopleRole.OWNER, ProjectPeopleRole.MANAGER]
const projectInviteRoles = [ProjectPeopleRole.OWNER, ProjectPeopleRole.MANAGER, ProjectPeopleRole.MEMBER]

/**
 * @param {string} projectId
 * @return {boolean}
 */
export const selectIsProjectEditable = createCachedSelector(
  selectCurrentUserId,
  selectProjectPeopleRole,
  selectIsCurrentUserOrganizationAdmin,
  selectIsCurrentUserOrganizationGuest,
  selectProjectType,
  (currentUserId, projectPeopleRole, isCurrentUserOrganizationAdmin, isCurrentUserOrganizationGuest, projectType) => {
    const currentUserRole = projectPeopleRole.get(currentUserId)

    if (projectType !== ProjectType.PROJECT) {
      return !!currentUserRole
    }

    const hasValidProjectRole = (currentUserRole && spaceEditRoles.includes(currentUserRole))
    return !isCurrentUserOrganizationGuest && (hasValidProjectRole || isCurrentUserOrganizationAdmin)
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )
/**
 * @param {string} projectId
 * @return {List}
 */
export const selectCanUserInviteToProject = createCachedSelector(
  selectCurrentUserId,
  selectProjectPeopleRole,
  selectIsCurrentUserOrganizationAdmin,
  selectIsCurrentUserOrganizationGuest,
  (currentUserId, projectPeopleRole, isCurrentUserOrganizationAdmin, isCurrentUserOrganizationGuest) => {
    const currentUserRole = projectPeopleRole.get(currentUserId)
    const hasValidProjectRole = (currentUserRole && projectInviteRoles.includes(currentUserRole))
    return !isCurrentUserOrganizationGuest && (hasValidProjectRole || isCurrentUserOrganizationAdmin)
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )
