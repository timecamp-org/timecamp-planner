import { createSelector } from 'reselect'
import {
  selectProjectOrderWithoutGroupDomain,
  selectProjectIdsInGroups,
  selectProjectGroupsData,
  selectProjectOrdersByGroupId
} from './domain'
import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable'
import { selectProjectsHaveUnreadMessages } from '../../ProjectsModel/selectors/domain'
import createCachedSelector from 're-reselect'
import generateSelectorName from 'common/utils/generateSelectorName'
import { selectChatNotificationSettingsTypeMap, selectUnreadNotificationsTypes } from '../../NotificationsModel/selectors/domain'
import { ChatNotificationSettingsType } from '../../NotificationsModel/types'
import { selectUnreadNotificationsChronology } from '../../NotificationsModel/selectors'
import { getProjectUnreadMessagesCount } from '../../NotificationsModel/utils'
import { selectSortedAvailableVisibleSpacesIds } from '../../ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectCurrentUserInOrganizationId } from '../../OrganizationsModel/selectors'
import { selectAvailableVisibleSpacesIds } from '../../ProjectsModel/selectors'
import createImmutableEqualSelector from 'common/utils/createImmutableEqualSelector'

const emptyMap = Map()

export const selectUngroupedSpaceIds = createSelector(
  selectProjectOrderWithoutGroupDomain,
  selectSortedAvailableVisibleSpacesIds,
  selectProjectIdsInGroups,
  (
    projectOrderWithoutGroupDomain,
    availableVisibleSpacesIds,
    projectIdsWithGroups,
  ) => {
    const ungroupedSpaceIds = projectOrderWithoutGroupDomain
      .keySeq()
      .toList()

    const unorderedSpaceIds = availableVisibleSpacesIds
      .filter(projectId => !projectIdsWithGroups.includes(projectId) && !ungroupedSpaceIds.includes(projectId))

    return ungroupedSpaceIds
      .sort((projectIdA: Id, projectIdB: Id) => {
        const projectAOrder = projectOrderWithoutGroupDomain.get(projectIdA)
        const projectBOrder = projectOrderWithoutGroupDomain.get(projectIdB)
        return projectAOrder - projectBOrder
      })
      .toList()
      .unshift(...unorderedSpaceIds.toArray())
      .filter(projectId => availableVisibleSpacesIds.includes(projectId)) as List<Id>
  }
)


// args: groupId
export const selectOrderedProjectIdsByGroupId = createCachedSelector(
  selectProjectOrdersByGroupId,
  selectAvailableVisibleSpacesIds,
  (projectOrderByGroupId, availableVisibleSpacesIds) => projectOrderByGroupId
    .keySeq()
    .toList()
    .filter(projectId => availableVisibleSpacesIds.includes(projectId))
    .sort((projectIdA: Id, projectIdB: Id) => {
      const projectAOrder = projectOrderByGroupId.get(projectIdA)
      const projectBOrder = projectOrderByGroupId.get(projectIdB)
      return projectAOrder - projectBOrder
    }) as List<Id>
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

export const selectCurrentUserGroupsData = createSelector(
  selectProjectGroupsData,
  selectCurrentUserInOrganizationId,
  (groupsData, currentUserInOrganizationId) => groupsData
    .filter(group => group.userInOrganizationId === currentUserInOrganizationId)
)

export const selectCurrentOrganizationProjectGroupIds = createSelector(
  selectCurrentUserGroupsData,
  (groupsData) => groupsData
    .keySeq()
    .toList()
)

export const selectSortedProjectGroupIds = createSelector(
  selectCurrentOrganizationProjectGroupIds,
  selectProjectGroupsData,
  (groupIds, groupsData) => {
    return groupIds
      .sort((groupIdA, groupIdB) => {
        const groupOrderA = groupsData.getIn([groupIdA, 'order'])
        const groupOrderB = groupsData.getIn([groupIdB, 'order'])
        return groupOrderA - groupOrderB
      })
      .toList() as List<Id>
  }
)

// args: groupId
export const selectGroupHasUnreadMessages = createCachedSelector(
  selectProjectsHaveUnreadMessages,
  selectOrderedProjectIdsByGroupId,
  selectChatNotificationSettingsTypeMap,
  (projectsHaveUnreadMessages, projectIds, chatNotificationSettingsTypeMap) => projectIds.some(projectId => {
    const isMuted = chatNotificationSettingsTypeMap.get(projectId) === ChatNotificationSettingsType.NOTHING
    return projectsHaveUnreadMessages.get(projectId) && !isMuted
  })
)
  (
    (_, args) => generateSelectorName(args, ['groupId']),
  )

// args: groupId
export const selectProjectGroupUnreadMessagesCount = createCachedSelector(
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  selectOrderedProjectIdsByGroupId,
  (unreadNotificationsChronology, unreadNotificationTypes, projectIds) => {
    if (!unreadNotificationsChronology) {
      return 0
    }
    return projectIds.reduce((acc, projectId) => {
      acc += getProjectUnreadMessagesCount(projectId, unreadNotificationsChronology, unreadNotificationTypes)
      return acc
    }, 0)
  },
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )


export const selectProjectGroupOrders = createImmutableEqualSelector(
  selectCurrentUserGroupsData,
  (projectGroupsData) => {
    let groupOrders = emptyMap
    projectGroupsData.forEach((data, groupId) => {
      groupOrders = groupOrders.set(groupId, data.order)
    })
    return groupOrders
  }
)

export const selectProjectGroupNames = createSelector(
  selectCurrentUserGroupsData,
  (projectGroupsData) => projectGroupsData
    .valueSeq()
    .map((data, _) => data.name) as List<string>
)