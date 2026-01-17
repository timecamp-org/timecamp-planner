import { List, Map } from 'immutable';
import { createCachedSelector } from 're-reselect';
import { createSelector } from 'reselect';

import generateSelectorName from '../../../../utils/generateSelectorName';
import { selectFilterBy } from '../../../component/FiltersModel/selectors';
import { selectCustomFieldsDomain, selectExtensionIdsByNamespaces } from '../../ExtensionsModel/selectors/domain';
import { ExtensionNamespace, FieldType, TargetType } from '../../ExtensionsModel/types';
import { generateExtensionCustomFieldId } from '../../ExtensionsModel/utils';
import { selectProjectsColor } from '../../ProjectsModel/selectors';
import { selectProjectsFollowerIds } from '../../ProjectsModel/selectors/domain';
import { selectAllTasksAssignedToUser, selectFilteredProjectTaskIds } from '../../TasksModel/selectors';
import { selectTaskIsArchivedStatuses, selectTasksDataDomain } from '../../TasksModel/selectors/domain';
import { TaskStatusFilterType } from '../../TasksModel/types';
import { selectCurrentUserId } from '../../UsersModel/selectors/domain';

import { AnyDict } from '../../../../types';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { Id } from '../../../../utils/identifier';
import {
  selectCurrentUserAccessibleListIds,
  selectListIdByTaskIdDomain,
  selectListIdsOrderByProjectIds,
  selectListIsArchivedStatuses,
  selectListLimits,
  selectListNames,
  selectListsDomain,
  selectListsFollowers,
  selectProjectIdsByListIds,
  selectTaskIdsByListIds,
  selectTasksOrderByList,
} from './domain';

const emptyList = List();
const emptyMap = Map();

/**
 * @param listId
 */
export const selectHasAccessToList = createCachedSelector(
  selectCurrentUserAccessibleListIds,
  (_, args) => args.listId,
  (listIds, listId: Id) => listIds.indexOf(listId) !== -1
)((_, args) => generateSelectorName(args, ['listId']));

// args: projectId
export const selectListsOrderByProjectId = createCachedSelector(
  selectListIdsOrderByProjectIds,
  (_, args) => args.projectId,
  (listIdsOrderByProjectIds, projectId: Id) => listIdsOrderByProjectIds.get(projectId) || (emptyMap as Map<Id, number>)
)((_, args) => generateSelectorName(args, ['projectId']));

// args: listId
export const selectAllTasksOrderByListId = createCachedSelector(
  selectListsDomain,
  (_, args) => args.listId,
  (domain, listId: Id) => domain.getIn(['tasksOrderByListId', listId]) || (emptyMap as Map<Id, number>)
)((_, args) => generateSelectorName(args, ['listId']));

// args: taskId
export const selectListIdByTaskId = createCachedSelector(
  selectListIdByTaskIdDomain,
  (_, args) => args.taskId,
  (listIdByTaskId, taskId: Id) => listIdByTaskId.get(taskId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: listId
export const selectListFollowers = createCachedSelector(
  selectListsFollowers,
  (_, args) => args.listId,
  (listsFollowers, listId: Id) => listsFollowers.get(listId) || (emptyList as List<Id>)
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectIsCurrentUserListFollower = createCachedSelector(
  selectListFollowers,
  selectCurrentUserId,
  (listFollowers, currentUserId: Id) => listFollowers.includes(currentUserId)
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectProjectIdByListId = createCachedSelector(
  selectProjectIdsByListIds,
  (_, args) => args.listId,
  (projectIdsByListIds, listId: Id) => projectIdsByListIds.get(listId) || null
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectIsCurrentUserListOrSpaceFollower = createCachedSelector(
  selectCurrentUserId,
  selectIsCurrentUserListFollower,
  selectProjectsFollowerIds,
  selectProjectIdByListId,
  (currentUserId: Id, currentUserFollowsList, projectFollowersDomain, projectId) => {
    const projectFollowers = projectFollowersDomain.get(projectId);
    return currentUserFollowsList || (!!projectFollowers && projectFollowers.includes(currentUserId));
  }
)((_, args) => generateSelectorName(args, ['listId']));

export const selectProjectsListIds = createSelector(
  selectListIdsOrderByProjectIds,
  (listIdsOrderByProjectIds) =>
    listIdsOrderByProjectIds.map(
      (listIdsOrderByProjectId) =>
        listIdsOrderByProjectId
          .sort((a, b) => a - b)
          .keySeq()
          .toList() as List<Id>
    ) as Map<Id, List<Id>>
);

// args: projectId
export const selectProjectListIdsInOrder = createCachedSelector(
  selectListIdsOrderByProjectIds,
  (_, args) => args.projectId,
  (listIdsOrderByProjects, projectId) => {
    const unsortedListIds = listIdsOrderByProjects.get(projectId) || (emptyMap as Map<Id, number>);
    return unsortedListIds
      .sort((a, b) => a - b)
      .keySeq()
      .toList() as List<Id>;
  }
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectProjectNotArchivedListIdsInOrder = createCachedSelector(
  selectProjectListIdsInOrder,
  selectListIsArchivedStatuses,
  (listIds, listArchivedStatuses) => listIds.filterNot((listId) => listArchivedStatuses.get(listId)) as List<Id>
)({
  keySelector: (_, args) => generateSelectorName(args, ['projectId']),
  selectorCreator: createImmutableEqualSelector,
});

// args: projectId, filterId
export const selectFilteredListIdsInOrder = createCachedSelector(
  selectProjectListIdsInOrder,
  selectListIsArchivedStatuses,
  selectFilterBy,
  selectTaskIdsByListIds,
  selectFilteredProjectTaskIds,
  (_, args) => args.projectId,
  (listIds, listArchivedStatuses, filterBy, taskIdsByListIds, filteredTasksIds) => {
    if (filterBy && filterBy.get('status') === TaskStatusFilterType.ARCHIVED) {
      return listIds.filter((listId) => {
        const taskIds = taskIdsByListIds.get(listId) || (emptyList as List<Id>);
        return taskIds.filter((taskId) => filteredTasksIds.includes(taskId)).size > 0;
      });
    } else {
      return listIds.filterNot((listId) => listArchivedStatuses.get(listId)) as List<Id>;
    }
  }
)({
  keySelector: (_, args) => generateSelectorName(args, ['projectId', 'filterId']),
  selectorCreator: createImmutableEqualSelector,
});

// args: listId
export const selectListOrder = createCachedSelector(
  selectListIdsOrderByProjectIds,
  selectProjectIdByListId,
  (_, args) => args.listId,
  (listIdsOrderByProjects, projectId, listId) => listIdsOrderByProjects.getIn([projectId, listId]) || null
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectListName = createCachedSelector(
  selectListNames,
  (_, args) => args.listId,
  (listNames, listId) => listNames.get(listId) || ''
)((_, args) => generateSelectorName(args, ['listId']));

export const selectListsData = createCachedSelector(
  selectListNames,
  (_, args) => args.listIdsArray,
  (listNames, listIdsArray) => listIdsArray.map((id) => ({ id, name: listNames.get(id) })) //listNames.get(listId) || '',
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectListIsArchived = createCachedSelector(
  selectListIsArchivedStatuses,
  (_, args) => args.listId,
  (listIsArchivedStatuses, listId) => listIsArchivedStatuses.get(listId) || false
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectListData = createCachedSelector(
  selectListName,
  selectListIsArchived,
  selectListOrder,
  selectProjectIdByListId,
  (_, args) => args.listId,
  (name, isArchived, order, projectId, listId) => ({
    name,
    isArchived,
    order,
    projectId,
    id: listId,
  })
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectListColor = createCachedSelector(
  selectProjectIdByListId,
  selectProjectsColor,
  (projectId, projectsColor) => projectsColor.get(projectId) || null
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId
export const selectTaskIdsInOrderByListId = createCachedSelector(
  selectTasksOrderByList,
  (_, args) => args.listId,
  (tasksOrderByList, listId) => {
    const unsortedTaskIds = tasksOrderByList.get(listId) || (emptyMap as Map<Id, number>);
    return unsortedTaskIds
      .sort((a, b) => a - b)
      .keySeq()
      .toList() as List<Id>;
  }
)((_, args) => generateSelectorName(args, ['listId']));

// args: listId, projectId, filterId
export const selectFilteredTaskIdsByListId = createCachedSelector(
  selectTaskIdsInOrderByListId,
  selectFilteredProjectTaskIds,
  (taskIds, filteredTaskIds) => taskIds.filter((taskId) => filteredTaskIds.includes(taskId)) as List<Id>
)({
  keySelector: (_, args) => generateSelectorName(args, ['listId', 'projectId', 'filterId']),
  selectorCreator: createImmutableEqualSelector,
});

// args: listId, projectId, filterId
export const selectListFilteredTasksCount = createCachedSelector(
  selectFilteredTaskIdsByListId,
  (taskIds) => taskIds.size
)({
  keySelector: (_, args) => generateSelectorName(args, ['listId', 'projectId', 'filterId']),
  selectorCreator: createImmutableEqualSelector,
});

// args: userId, listId, projectId, filterId
export const selectConversationFilteredTaskIdsByListId = createCachedSelector(
  selectAllTasksAssignedToUser,
  selectTaskIdsInOrderByListId,
  selectFilteredProjectTaskIds,
  (taskIdsUserIsAssignedTo, taskIds, filteredTaskIds) =>
    taskIds.filter((taskId) => filteredTaskIds.includes(taskId) && taskIdsUserIsAssignedTo.includes(taskId))
)((_, args) => generateSelectorName(args, ['listId', 'projectId', 'filterId', 'userId']));

// TODO: check for tasks parent projects privacy setting
// args: userId
export const selectConversationListIds = createCachedSelector(
  selectListIdByTaskIdDomain,
  selectAllTasksAssignedToUser,
  selectListIsArchivedStatuses,
  selectTasksDataDomain,
  (listIdsByTaskIds, taskIdsUserIsAssignedTo, listsIsArchivedStatuses, taskData) =>
    taskIdsUserIsAssignedTo
      .filter((taskId) => taskData.get(taskId) && !taskData.get(taskId).isArchived)
      .map((taskId) => listIdsByTaskIds.get(taskId))
      .filter((taskId) => listsIsArchivedStatuses.get(taskId) === false)
      .toSet()
      .toList() as List<Id>
)((_, args) => generateSelectorName(args, ['userId']));

// args: userId
export const selectConversationArchivedListIds = createCachedSelector(
  selectListIdByTaskIdDomain,
  selectAllTasksAssignedToUser,
  selectListIsArchivedStatuses,
  selectTasksDataDomain,
  (listIdsByTaskIds, taskIdsUserIsAssignedTo, listsIsArchivedStatuses, taskData) =>
    taskIdsUserIsAssignedTo
      .filter((taskId) => {
        const taskIsArchived = taskData.get(taskId) && taskData.get(taskId).isArchived;
        const listIsArchived = listsIsArchivedStatuses.get(taskId) === true;

        return taskIsArchived || listIsArchived;
      })
      .map((taskId) => listIdsByTaskIds.get(taskId))
      .toSet()
      .toList() as List<Id>
)((_, args) => generateSelectorName(args, ['userId']));

// listId, projectId, filterId
export const selectListFilteredEstimatedEffort = createCachedSelector(
  selectFilteredTaskIdsByListId,
  selectCustomFieldsDomain,
  selectExtensionIdsByNamespaces,
  (filteredTaskIds, customFields, extensionIdsByNamespaces) =>
    sumEstimatedEffort(extensionIdsByNamespaces.get(ExtensionNamespace.AGILE), filteredTaskIds, customFields)
)((_, args) => generateSelectorName(args, ['listId', 'projectId', 'filterId']));

// listId, countArchived
export const selectListEstimatedEffort = createCachedSelector(
  selectTaskIdsInOrderByListId,
  selectCustomFieldsDomain,
  selectExtensionIdsByNamespaces,
  selectTaskIsArchivedStatuses,
  (_, args) => args.countArchived,
  (taskIds, customFields, extensionIdsByNamespaces, isTaskArchivedMap, countArchived) => {
    if (!countArchived) {
      taskIds = taskIds.filter((taskId) => !isTaskArchivedMap.get(taskId)) as List<string>;
    }

    return sumEstimatedEffort(extensionIdsByNamespaces.get(ExtensionNamespace.AGILE), taskIds, customFields);
  }
)((_, args) => generateSelectorName(args, ['listId', 'countArchived']));

function sumEstimatedEffort(extensionId: Id, taskIds: List<Id>, customFields: AnyDict): number {
  return taskIds.reduce((sum, taskId) => {
    const fieldKey = generateExtensionCustomFieldId(extensionId, TargetType.TASK, taskId, FieldType.ESTIMATED_EFFORT);
    const taskEstimatedEffort: number = customFields.get(fieldKey, 0);
    return sum + taskEstimatedEffort;
  }, 0);
}

export const selectListLimit = createCachedSelector(
  selectListLimits,
  (_, args) => args.listId,
  (listsLimit, listId) => listsLimit.get(listId)
)((_, args) => generateSelectorName(args, ['listId']));

// projectId, filterId
export const selectFilteredTasksByList = createCachedSelector(
  selectFilteredListIdsInOrder,
  (state, args) => ({
    state,
    args,
  }),
  (lists, { state, args }) =>
    lists.reduce((acc, listId) => {
      const taskIds = selectFilteredTaskIdsByListId(state, { ...args, listId })?.toJS();
      acc.push({ listId, taskIds });

      return acc;
    }, [] as { listId: string; taskIds: string[] }[])
)((_, args) => generateSelectorName(args, ['projectId, filterId']));
