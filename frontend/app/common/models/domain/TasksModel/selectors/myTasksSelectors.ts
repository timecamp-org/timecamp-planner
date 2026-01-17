import createCachedSelector from 're-reselect'
import { selectTaskPeopleRoleDomain, selectProjectIdsByTaskIdsDomain } from './domain'
import { selectFilteredTaskIdsForPath } from '.'
import generateSelectorName from 'common/utils/generateSelectorName'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { getUniqueAssigneeIdsForTaskIds, sortTaskAssignees } from '../helpers'
import { selectUsersName, selectCurrentUserId } from '../../UsersModel/selectors/domain'
import { selectTagsByObjectId, selectTagsData } from '../../TagsModel/selectors/domain'
import { getUniqueTagIdsForTaskIds } from '../../TagsModel/utils'
import { TaskPeopleRole } from '../types'
import { createSelector } from 'reselect'
import { EMPTY_FILTER_OPTION, SortOrder } from 'models/component/FiltersModel/types'
import { compareString } from 'common/utils/sort'

const emptyList = List()

export const selectMyTaskIds = createSelector(
  selectCurrentUserId,
  selectTaskPeopleRoleDomain,
  (currentUserId, tasksPeopleRole) => {
    let taskIdsUserIsAssigneeOf = emptyList as List<Id>
    tasksPeopleRole
      .forEach((taskPeopleRole, taskId) => {
        if (taskPeopleRole.get(currentUserId) === TaskPeopleRole.ASSIGNEE) {
          taskIdsUserIsAssigneeOf = taskIdsUserIsAssigneeOf.push(taskId)
        }
      })
    return taskIdsUserIsAssigneeOf
  }
)

export const selectMyTasksAssignees = createSelector(
  selectMyTaskIds,
  selectTaskPeopleRoleDomain,
  (taskIds, taskPeopleRole) => getUniqueAssigneeIdsForTaskIds(taskIds, taskPeopleRole).push(EMPTY_FILTER_OPTION) as List<string>,
)

export const selectSortedMyTasksAssignees = createSelector(
  selectMyTasksAssignees,
  selectUsersName,
  selectCurrentUserId,
  (assigneeIds, usersName, currentUserId) => sortTaskAssignees(assigneeIds, usersName, currentUserId),
)

export const selectVisibleMyTaskAssignees = createSelector(
  selectSortedMyTasksAssignees,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) => projectTasksAssignees.slice(0, maxItemsCount) as List<Id>,
)


export const selectHiddenMyTaskAssigneesCount = createSelector(
  selectMyTasksAssignees,
  selectVisibleMyTaskAssignees,
  (projectTasksAssignees, visibleProjectTaskAssignees) => projectTasksAssignees.size - visibleProjectTaskAssignees.size,
)

export const selectMyTasksTags = createSelector(
  selectMyTaskIds,
  selectTagsByObjectId,
  (taskIds, tagsByObjectId) => getUniqueTagIdsForTaskIds(taskIds, tagsByObjectId).push(EMPTY_FILTER_OPTION)
)

export const selectSortedMyTasksTags = createSelector(
  selectMyTasksTags,
  selectTagsData,
  (tagIds, tagsData) => tagIds.sort((tagIdA, tagIdB) => {
    const tagNameA = tagsData.getIn([tagIdA, 'name'])
    const tagNameB = tagsData.getIn([tagIdB, 'name'])

    return compareString(tagNameA, tagNameB, SortOrder.ASC)
  }) as List<Id>
)

export const selectVisibleMyTaskTags = createSelector(
  selectSortedMyTasksTags,
  (_, args) => args.maxItemsCount,
  (projectTasksTags, maxItemsCount) => projectTasksTags.slice(0, maxItemsCount) as List<Id>,
)

export const selectHiddenMyTaskTagsCount = createSelector(
  selectSortedMyTasksTags,
  selectVisibleMyTaskTags,
  (projectTasksTags, visibleProjectTaskTags) => projectTasksTags.size - visibleProjectTaskTags.size,
)

// args: filterId, filterPath, defaultFilterBy
export const selectFilteredMyTaskIdsCountPreview = createCachedSelector(
  selectFilteredTaskIdsForPath,
  selectMyTaskIds,
  (filteredTaskIds, taskIds) => filteredTaskIds.filter(taskId => taskIds.includes(taskId)).size,
)(
  (_, args) => generateSelectorName(args, ['filterId', 'filterPath', 'defaultFilterBy']),
)

export const selectMyTasksProjectIds = createSelector(
  selectMyTaskIds,
  selectProjectIdsByTaskIdsDomain,
  (taskIds, projectIdsByTaskIds) => {
    let projectIds = emptyList
    taskIds.forEach(taskId => {
      const projectId = projectIdsByTaskIds.get(taskId)
      if (!projectIds.includes(projectId)) {
        projectIds = projectIds.push(projectId)
      }
    })
    return projectIds as List<Id>
  }

)

export const selectVisibleMyTaskProjectIds = createSelector(
  selectMyTasksProjectIds,
  (_, args) => args.maxItemsCount,
  (projectIds, maxItemsCount) => projectIds.slice(0, maxItemsCount) as List<Id>,
)

export const selectHiddenMyTaskProjectsCount = createSelector(
  selectMyTasksProjectIds,
  selectVisibleMyTaskProjectIds,
  (projectIds, visibleProjectTaskTags) => projectIds.size - visibleProjectTaskTags.size,
)