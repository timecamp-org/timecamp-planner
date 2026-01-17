import { createSelector } from 'reselect'
import { domain } from '../constants'
import { GuestInProjectData, GuestsState } from '../types'
import createCachedSelector from 're-reselect'
import generateSelectorName from 'common/utils/generateSelectorName'

export const selectGuestsDomain = (state) => state.get(domain) as GuestsState

export const selectGuestInProjectData = createSelector(
  selectGuestsDomain,
  (domain) => domain.get('guestInProjectData') as GuestInProjectData,
)

// args: organizationId
export const selectOrganizationGuestInProjectData = createCachedSelector(
  selectGuestInProjectData,
  (_, args) => args.organizationId,
  (guestInProjectData, organizationId) =>
    guestInProjectData
      .valueSeq()
      .filter(guestInProject => guestInProject.organizationId === organizationId)
      .toList(),
)
(
  (_, args) => generateSelectorName(args, ['organizationId'])
)

// args: organizationId
export const selectOrganizationOccupiedGuestSeatsCount = createCachedSelector(
  selectOrganizationGuestInProjectData,
  (organizationGuestsInProject) =>
    organizationGuestsInProject.size,
)
(
  (_, args) => generateSelectorName(args, ['organizationId'])
)

// args: guestInProjectId
export const selectGuestInProject = createCachedSelector(
  selectGuestInProjectData,
  (_, args) => args.guestInProjectId,
  (guestInProjectData, guestInProjectId) => guestInProjectData.get(guestInProjectId)
)
(
  (_, args) => generateSelectorName(args, ['guestInProjectId'])
)

// args: userId, projectId
export const selectGuestInProjectByUserIdAndProjectId = createCachedSelector(
  selectGuestInProjectData,
  (_, args) => args.userId,
  (_, args) => args.projectId,
  (guestInProjectData, userId, projectId) => guestInProjectData
    .find((guestInProject) =>
      guestInProject.userId === userId && guestInProject.projectId === projectId
    )
)
(
  (_, args) => generateSelectorName(args, ['userId', 'projectId'])
)