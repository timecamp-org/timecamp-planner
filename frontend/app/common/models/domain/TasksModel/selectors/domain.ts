import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { Id } from '../../../../utils/identifier';
import { selectCurrentUserAccessibleTaskIds, selectListNames } from '../../ListsModel/selectors/domain';
import { filterImmutableObjectByKeys } from '../../PermissionsModel/utils';
import { selectProjectNames } from '../../ProjectsModel/selectors/domain';
import { domain } from '../constants';
import { getTaskAssigneeIdsFromTaskPeopleRole } from '../helpers';
import { Task } from '../models';
import { TaskPeopleRole, TaskPriorityTypes, TaskStatus, TasksState } from '../types';

const emptyMap = Map();
const emptyList = List();

const selectTasksDomain = (state) => state.get(domain) as TasksState;

/**
 * Other specific selectors
 */

export const selectTasksData = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('tasksData') as Map<Id, Task>
);

export const selectTasksDataDomain = createImmutableEqualSelector(
  selectTasksData,
  selectCurrentUserAccessibleTaskIds,
  (tasksData, taskIds) => filterImmutableObjectByKeys(tasksData, taskIds)
);

export const selectTaskStatuses = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, TaskStatus>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.status);
  });
  return result;
});

export const selectTaskPriorities = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, TaskPriorityTypes>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.taskPriorityType);
  });
  return result;
});

export const selectTaskNames = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, string>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.name);
  });
  return result;
});

export const selectTaskListNames = createImmutableEqualSelector(
  selectTasksData,
  selectListNames,
  (tasksData, listNames) => {
    let result = emptyMap as Map<Id, string>;
    tasksData.forEach((data, taskId) => {
      result = result.set(taskId, listNames.get(data.taskListId));
    });
    return result;
  }
);

export const selectTaskProjectNames = createImmutableEqualSelector(
  selectTasksData,
  selectProjectNames,
  (tasksData, projectNames) => {
    let result = emptyMap as Map<Id, string>;
    tasksData.forEach((data, taskId) => {
      result = result.set(taskId, projectNames.get(data.projectId));
    });
    return result;
  }
);

export const selectTaskDueDates = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, number>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.dueDate);
  });
  return result;
});

export const selectTaskStartDates = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, number>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.startDate);
  });
  return result;
});

export const selectTaskProgressEstimates = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, number>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.progress);
  });
  return result;
});

export const selectTaskIsArchivedStatuses = createImmutableEqualSelector(selectTasksData, (tasksData) => {
  let result = emptyMap as Map<Id, boolean>;
  tasksData.forEach((data, taskId) => {
    result = result.set(taskId, data.isArchived);
  });
  return result;
});

export const selectTaskIds = createImmutableEqualSelector(
  selectTasksDataDomain,
  (tasksData) => tasksData.keySeq().toList() as List<Id>
);

export const selectAllTaskIds = createImmutableEqualSelector(
  selectTasksData,
  (tasksData) => tasksData.keySeq().toList() as List<Id>
);

export const selectTaskPeopleIdsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskPeopleIds') as Map<Id, List<Id>>
);

export const selectTaskTagIdsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskTagIds') as Map<Id, List<Id>>
);

export const selectTaskPeopleRoleDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskPeopleRole') as Map<Id, Map<Id, TaskPeopleRole>>
);

export const selectTaskFollowerIdsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskFollowerIds') as Map<Id, List<Id>>
);

export const selectTaskIdByMessageIdDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskIdByMessageId') as Map<Id, Id>
);

export const selectTaskDescriptionsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskDescriptions') as Map<Id, string>
);

export const selectProjectIdsByTaskIdsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('projectIdsByTaskIds') as Map<Id, Id>
);

export const selectTaskReactionsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskReactions') as Map<Id, Map<Id, string>>
);

export const selectIsTaskDescriptionDirty = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('isTaskDescriptionDirty') as boolean
);

export const selectTaskAttachmentsDomain = createImmutableEqualSelector(
  selectTasksDomain,
  (domain) => domain.get('taskAttachmentsIds') as Map<Id, List<Id>>
);

export const selectTasksFileIds = createImmutableEqualSelector(
  selectTasksDomain,
  (tasksDomain) => tasksDomain.get('taskFileIds') as Map<Id, List<Id>>
);

export const selectIsWaitingToUpdateProgress = createImmutableEqualSelector(
  selectTasksDomain,
  (tasksDomain) => tasksDomain.get('isWaitingToUpdateProgress') as boolean
);

export const selectTasksLatestVisits = createImmutableEqualSelector(
  selectTasksDomain,
  (tasksDomain) => tasksDomain.get('taskLatestVisit') as Map<Id, number>
);

export const selectProjectsTaskIds = createImmutableEqualSelector(
  selectProjectIdsByTaskIdsDomain,
  (projectIdsByTaskIds) => {
    let projectTaskIds = emptyMap as Map<Id, List<Id>>;
    projectIdsByTaskIds.forEach((projectId, taskId) => {
      projectTaskIds = projectTaskIds.update(projectId, (list) => {
        if (list) {
          return list.push(taskId);
        } else {
          return List([taskId]);
        }
      });
    });
    return projectTaskIds as Map<Id, List<Id>>;
  }
);

// args: projectId
export const selectProjectTaskIds = createCachedSelector(
  selectProjectsTaskIds,
  (_, args) => args.projectId,
  (projectsIdsByTaskIds, projectId) => projectsIdsByTaskIds.get(projectId) || (emptyList as List<Id>)
)((_, args) => generateSelectorName(args, ['projectId']));

// args: taskId
export const selectTaskAssigneeIds = createCachedSelector(
  selectTaskPeopleRoleDomain,
  (_, args) => args.taskId,
  (taskPeopleRole, taskId) => getTaskAssigneeIdsFromTaskPeopleRole(taskId, taskPeopleRole)
)((_, args) => generateSelectorName(args, ['taskId']));
