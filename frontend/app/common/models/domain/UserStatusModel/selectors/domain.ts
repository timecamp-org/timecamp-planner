import { createSelector } from 'reselect'
import { domain } from '../constants'
import { UserStatusInterface, UserStatusState } from '../types';
import { Id } from '../../../../utils/identifier';
import { Map } from 'immutable';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import generateSelectorName from '../../../../utils/generateSelectorName';

const emptyMap = Map()

/**
 * Direct selector to the projectsTree state domain
 */
export const selectUserStatusDomain = (state) => state.get(domain) as UserStatusState

/**
 * Other specific selectors
 */

export const selectUserStatusData = createSelector(
  selectUserStatusDomain,
  (domain) => domain.get('userStatusData') as Map<Id, UserStatusInterface>,
)

export const selectUserStatusByUserId = createImmutableEqualSelector(
  selectUserStatusData,
  (userStatuses) => {
    let result = emptyMap
    userStatuses.valueSeq().forEach(userStatus => {
      result = result.set(userStatus.userId, userStatus.id)
    })
    return result as Map<Id, Id>
  }
)

// args: userId
export const selectUserStatusId = createCachedSelector(
  selectUserStatusByUserId,
  (_, args) => args.userId,
  (userStatusByUserId, userId) => userStatusByUserId.get(userId),
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectUserStatus = createCachedSelector(
  selectUserStatusData,
  selectUserStatusId,
  (userStatusData, statusId) => userStatusData.get(statusId),
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectUserStatusTitle = createCachedSelector(
  selectUserStatus,
  (status) => status ? status.title : '',
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectUserStatusEmojiCode = createCachedSelector(
  selectUserStatus,
  (status) => status ? status.emojiCode : null,
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectUserStatusResetAt = createCachedSelector(
  selectUserStatus,
  (status) => status ? status.resetAt : null,
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)
