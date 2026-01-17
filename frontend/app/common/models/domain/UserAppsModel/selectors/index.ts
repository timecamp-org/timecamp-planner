import createCachedSelector from 're-reselect'
import {
  selectOAuthClientIdByAppIdDomain,
  selectAppUsersRole,
  selectAppUserIdsDomain,
  selectAppUserIds
} from './domain'
import generateSelectorName from '../../../../utils/generateSelectorName'
import { selectCurrentUserId } from '../../UsersModel/selectors/domain'
import { AppUserRole } from '../types'
import { createSelector } from 'reselect'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { selectUserIds } from '../../UsersModel/selectors'

// args: appId
export const selectOAuthClientIdByAppId = createCachedSelector(
  selectOAuthClientIdByAppIdDomain,
  (_, args) => args.appId,
  (oAuthClientIdByAppIdDomain, appId) => oAuthClientIdByAppIdDomain.get(appId),
)
  (
    (_, args) => generateSelectorName(args, ['appId']),
  )

// args: appId
export const selectIsCurrentUserAppOwner = createCachedSelector(
  selectCurrentUserId,
  selectAppUsersRole,
  (currentUserId, appUsersRole) => {
    const role = appUsersRole.get(currentUserId)
    return role && role === AppUserRole.OWNER
  }
)
  (
    (_, args) => generateSelectorName(args, ['appId']),
  )


export const selectCurrentUserAppIds = createSelector(
  selectAppUserIdsDomain,
  selectCurrentUserId,
  (appUserIdsDomain, currentUserId) => {
    let appIds = List<Id>()
    appUserIdsDomain.forEach((userIds, appId) => {
      if (userIds.includes(currentUserId)) {
        appIds = appIds.push(appId)
      }
    })
    return appIds
  }
)

// args: appId
export const selectAppNotAssignedUserIds = createCachedSelector(
  selectAppUserIds,
  selectUserIds,
  (assignedUserIds, allUserIds) => allUserIds.filter(userId => !assignedUserIds.includes(userId)) as List<Id>,
)
  (
    (_, args) => generateSelectorName(args, ['appId']),
  )
