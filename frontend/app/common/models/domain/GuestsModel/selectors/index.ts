import { selectGuestInProjectData } from './domain'
import { selectCurrentOrganizationId } from '../../OrganizationsModel/selectors/domain'
import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import generateSelectorName from 'common/utils/generateSelectorName'

export const selectCurrentOrganizationGuestInProjectData = createSelector(
  selectGuestInProjectData,
  selectCurrentOrganizationId,
  (guestInProjectData, organizationId) =>
    guestInProjectData
      .valueSeq()
      .filter(guestInProject => guestInProject.organizationId === organizationId)
      .toList(),
)


export const selectCurrentOrganizationOccupiedGuestSeatsCount = createSelector(
  selectCurrentOrganizationGuestInProjectData,
  (organizationGuestsInProject) =>
    organizationGuestsInProject.size,
)

// args: userId
export const selectCurrentOrganizationUserOccupiedGuestSeatsCount = createCachedSelector(
  selectGuestInProjectData,
  selectCurrentOrganizationId,
  (_, args) => args.userId,
  (guestInProjectData, organizationId, userId) =>
    guestInProjectData
      .valueSeq()
      .toList()
      .filter(guestInProject =>
        guestInProject.organizationId === organizationId && guestInProject.userId === userId
      ).size
)
  (
    (_, args) => generateSelectorName(args, ['userId'])
  )


