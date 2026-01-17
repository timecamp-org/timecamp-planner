import { createSelector } from 'reselect'
import { domain } from './constants'

export const selectAddUsersToProjectModalDomain = (state) => state.get(domain)

export const selectAddUsersToProjectModalProjectId = createSelector(
  selectAddUsersToProjectModalDomain,
  (addUsersToProjectModalDomain) => addUsersToProjectModalDomain.get('projectId'),
)

export const selectAddUsersToProjectModalUserIds = createSelector(
  selectAddUsersToProjectModalDomain,
  (addUsersToProjectModalDomain) => addUsersToProjectModalDomain.get('userIds'),
)
