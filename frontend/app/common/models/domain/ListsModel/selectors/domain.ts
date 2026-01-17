
import { domain as listsDomainName } from '../constants'
import {
  filterImmutableObjectByKeys,
  filterImmutableObjectByValues,
} from '../../PermissionsModel/utils'
import { selectCurrentUserAccessibleProjectIds } from '../../ProjectsModel/selectors/accessSelectors'
import { Map, List } from 'immutable'
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../../utils/generateSelectorName'
import { TaskListsState } from '../types';
import { Id } from '../../../../utils/identifier';
import { createSelector } from 'reselect'

const emptyList = List()
const emptyMap = Map()


export const selectListsDomain = state => state.get(listsDomainName) as TaskListsState

export const selectListNames = createImmutableEqualSelector(
  selectListsDomain,
  domain => domain.get('listNames') as Map<Id, string>,
)


export const selectListIsArchivedStatuses = createImmutableEqualSelector(
  selectListsDomain,
  domain => domain.get('listIsArchivedStatuses') as Map<Id, boolean>,
)


export const selectListsFollowers = createImmutableEqualSelector(
  selectListsDomain,
  domain => domain.get('listFollowers') as Map<Id, List<Id>>,
)


export const selectProjectIdsByListIdsDomain = createImmutableEqualSelector(
  selectListsDomain,
  domain => domain.get('projectIdsByListIds') as Map<Id, Id>,
)

export const selectListIdByTaskId = createImmutableEqualSelector(
  selectListsDomain,
  domain => domain.get('listIdByTaskId') as Map<Id, Id>,
)

export const selectListLimits = createSelector(
  selectListsDomain,
  domain => domain.get('listLimits') as Map<Id, number>,
)

export const selectCurrentUserAccessibleListIds = createImmutableEqualSelector(
  selectCurrentUserAccessibleProjectIds,
  selectProjectIdsByListIdsDomain,
  (projectIds, projectIdsByListIds) => {
    let listIds = emptyList as List<Id>
    projectIdsByListIds.forEach((projectId, listId) => {
      if (projectIds.includes(projectId)) {
        listIds = listIds.push(listId)
      }
    })

    return listIds
  },
)

export const selectCurrentUserAccessibleTaskIds = createImmutableEqualSelector(
  selectCurrentUserAccessibleListIds,
  selectListIdByTaskId,
  (listIds, listIdByTaskId) => {
    let taskIds = emptyList as List<Id>
    listIdByTaskId.forEach((listId, taskId) => {
      if (listIds.includes(listId)) {
        taskIds = taskIds.push(taskId)
      }
    })

    return taskIds
  },
)

export const selectListIdsOrderByProjectDomain = createImmutableEqualSelector(
  selectListsDomain,
  (domain) => domain.get('listIdsOrderByProject') as Map<Id, Map<Id, number>>,
)

export const selectListIdsOrderByProjectIds = createImmutableEqualSelector(
  selectListIdsOrderByProjectDomain,
  selectCurrentUserAccessibleProjectIds,
  (listIdsOrderByProject, projectIds) => filterImmutableObjectByKeys<Map<Id, number>>(listIdsOrderByProject, projectIds) as Map<Id, Map<Id, number>>,
)

export const selectProjectIdsByListIds = createImmutableEqualSelector(
  selectProjectIdsByListIdsDomain,
  selectCurrentUserAccessibleListIds,
  (projectIdsByListIds, listIds) => filterImmutableObjectByKeys<Id>(projectIdsByListIds, listIds) as Map<Id, Id>,
)

export const selectTasksOrderByListIdDomain = createImmutableEqualSelector(
  selectListsDomain,
  (domain) => domain.get('tasksOrderByListId') as Map<Id, Map<Id, number>>,
)

export const selectTasksOrderByList = createImmutableEqualSelector(
  selectTasksOrderByListIdDomain,
  selectCurrentUserAccessibleListIds,
  (tasksOrderByListId, listIds) => filterImmutableObjectByKeys<Map<Id, number>>(tasksOrderByListId, listIds) as Map<Id, Map<Id, number>>,
)

export const selectTaskIdsByListIds = createImmutableEqualSelector(
  selectTasksOrderByList,
  (tasksOrderByListIds) => {
    let result = emptyMap as Map<Id, List<Id>>
    tasksOrderByListIds.map((taskOrders, listId) => {
      result = result.set(listId, taskOrders.keySeq().toList())
    })
    return result
  },
)

// listId
export const selectTaskIdsByListId = createCachedSelector(
  selectTaskIdsByListIds,
  (_, args) => args.listId,
  (taskIdsByListIds, listId) => taskIdsByListIds.get(listId) as List<Id>
)
(
  {
    keySelector: (_, args) => generateSelectorName(args, ['listId']),
    selectorCreator: createImmutableEqualSelector
  }
)

export const selectListIdByTaskIdDomain = createImmutableEqualSelector(
  selectListIdByTaskId,
  selectCurrentUserAccessibleListIds,
  (listIdByTaskId, listIds) => filterImmutableObjectByValues(listIdByTaskId, listIds) as Map<Id, Id>,
)
