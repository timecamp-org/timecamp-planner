import createCachedSelector from 're-reselect'
import { selectTaskPeopleRoleDomain } from './domain'
import { selectFilteredTaskIdsForPath, selectAllTasksAssignedToUser, selectFilteredAllTasksAssignedToUser } from '.'
import generateSelectorName from 'common/utils/generateSelectorName'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { getUniqueAssigneeIdsForTaskIds, sortTaskAssignees } from '../helpers'
import { selectUsersName, selectCurrentUserId } from '../../UsersModel/selectors/domain'
import { selectTagsByObjectId, selectTagsData } from '../../TagsModel/selectors/domain'
import { getUniqueTagIdsForTaskIds } from '../../TagsModel/utils'
import { createSelector } from 'reselect'
import { EMPTY_FILTER_OPTION, SortOrder } from 'models/component/FiltersModel/types'
import { compareString } from 'common/utils/sort'

const emptyList = List()

// args: userId
export const selectConversationTasksAssignees = createCachedSelector(
  selectAllTasksAssignedToUser,
  selectTaskPeopleRoleDomain,
  (taskIds, taskPeopleRole) => getUniqueAssigneeIdsForTaskIds(taskIds, taskPeopleRole).push(EMPTY_FILTER_OPTION) as List<string>,
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectSortedConversationTasksAssignees = createCachedSelector(
  selectConversationTasksAssignees,
  selectUsersName,
  selectCurrentUserId,
  (assigneeIds, usersName, currentUserId) => sortTaskAssignees(assigneeIds, usersName, currentUserId),
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectVisibleConversationTaskAssignees = createCachedSelector(
  selectSortedConversationTasksAssignees,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) => projectTasksAssignees.slice(0, maxItemsCount) as List<Id>,
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

// args: userId
export const selectHiddenConversationTaskAssigneesCount = createCachedSelector(
  selectConversationTasksAssignees,
  selectVisibleConversationTaskAssignees,
  (projectTasksAssignees, visibleProjectTaskAssignees) => projectTasksAssignees.size - visibleProjectTaskAssignees.size,
)
(
  (_, args) => generateSelectorName(args, ['userId'])
)

export const selectConversationTasksTags = createSelector(
  selectAllTasksAssignedToUser,
  selectTagsByObjectId,
  (taskIds, tagsByObjectId) => getUniqueTagIdsForTaskIds(taskIds, tagsByObjectId).push(EMPTY_FILTER_OPTION)
)

export const selectSortedConversationTasksTags = createSelector(
  selectConversationTasksTags,
  selectTagsData,
  (tagIds, tagsData) => tagIds.sort((tagIdA, tagIdB) => {
    const tagNameA = tagsData.getIn([tagIdA, 'name'])
    const tagNameB = tagsData.getIn([tagIdB, 'name'])

    return compareString(tagNameA, tagNameB, SortOrder.ASC)
  }) as List<Id>
)

export const selectVisibleConversationTaskTags = createSelector(
  selectConversationTasksTags,
  (_, args) => args.maxItemsCount,
  (projectTasksTags, maxItemsCount) => projectTasksTags.slice(0, maxItemsCount) as List<Id>,
)

export const selectHiddenConversationTaskTagsCount = createSelector(
  selectConversationTasksTags,
  selectVisibleConversationTaskTags,
  (projectTasksTags, visibleProjectTaskTags) => projectTasksTags.size - visibleProjectTaskTags.size,
)

// args: userId, filterId, defaultFilterBy
export const selectFilteredAllTasksAssignedToUserCountPreview = createCachedSelector(
  selectFilteredTaskIdsForPath,
  selectFilteredAllTasksAssignedToUser,
  (filteredTaskIds, taskIds) => filteredTaskIds.filter(taskId => taskIds.includes(taskId)).size,
)(
  (_, args) => generateSelectorName(args, ['userId', 'filterId', 'filterPath', 'defaultFilterBy']),
)