import { createSelector } from 'reselect'

import { domain } from '../constants'
import { List, Map } from 'immutable'
import { Id } from '../../../../utils/identifier'
import createCachedSelector from 're-reselect'
import generateSelectorName from 'common/utils/generateSelectorName'
import { AppUserRole } from '../types'

const emptyList = List()
const emptyMap = Map()

export const userAppsDomain = (state) => state.get(domain)

export const selectOAuthClientIdByAppIdDomain = createSelector(
  userAppsDomain,
  domain => domain.get('oAuthClientIdByAppId') as Map<Id, Id>,
)

export const selectAppUserIdsDomain = createSelector(
  userAppsDomain,
  domain => domain.get('appUserIds') as Map<Id, List<Id>>,
)
export const selectAppUsersRoleDomain = createSelector(
  userAppsDomain,
  domain => domain.get('appUsersRole') as Map<Id, Map<Id, AppUserRole>>,
)

// args: appId
export const selectAppUserIds = createCachedSelector(
  selectAppUserIdsDomain,
  (_, args) => args.appId,
  (appUserIdsDomain, appId) => (appUserIdsDomain.get(appId) || emptyList) as List<Id>
)
  (
    (_, args) => generateSelectorName(args, ['appId']),
  )

// args: appId
export const selectAppUsersRole = createCachedSelector(
  selectAppUsersRoleDomain,
  (_, args) => args.appId,
  (appUsersRoleDomain, appId) => (appUsersRoleDomain.get(appId) || emptyMap) as Map<Id, AppUserRole>
)
  (
    (_, args) => generateSelectorName(args, ['appId']),
  )

// args: appId, userId
export const selectUserInAppRole = createCachedSelector(
  selectAppUsersRole,
  (_, args) => args.userId,
  (appUsersRole, userId) => appUsersRole.get(userId) as AppUserRole
)
  (
    (_, args) => generateSelectorName(args, ['appId', 'userId']),
  )
