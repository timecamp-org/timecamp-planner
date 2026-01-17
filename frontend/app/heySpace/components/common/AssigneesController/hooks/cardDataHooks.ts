import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import {
  DataPersisterHookInterface,
  DataProviderHookInterface,
} from 'commonComponents/AssigneesController/hooks/dataHooks';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import {
  selectAlphabeticallySortedTaskAvailableAssignees,
  selectProjectIsPrivate,
} from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import {
  onAddToTaskPeople,
  onRemoveFromTaskPeople,
} from 'models/domain/TasksModel/actions';
import {
  selectAlphabeticallySortedTaskAssigneeIds,
  selectProjectIdByTaskId,
  selectTaskColor,
} from 'models/domain/TasksModel/selectors';
import { TaskPeopleRole } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

export function useDataProvider(objectId: Id): DataProviderHookInterface {
  const projectId = useSelector((state) =>
    selectProjectIdByTaskId(state, { taskId: objectId })
  );

  return {
    projectId,
    color: useSelector((state) => selectTaskColor(state, { taskId: objectId })),
    assigneeIds: useSelector((state) =>
      selectAlphabeticallySortedTaskAssigneeIds(state, { taskId: objectId })
    ),
    isProjectPrivate: useSelector((state) =>
      selectProjectIsPrivate(state, { projectId })
    ),
    projectPeopleIds: useSelector((state) =>
      selectProjectPeople(state, { projectId })
    ),
    currentUserId: useSelector((state) => selectCurrentUserId(state)),
    notAssignedUserIds: useSelector((state) =>
      selectAlphabeticallySortedTaskAvailableAssignees(state, {
        projectId,
        taskId: objectId,
      })
    ),
    isCurrentUserOrganizationGuest: useSelector((state) =>
      selectIsCurrentUserOrganizationGuest(state)
    ),
  };
}

export function useDataPersister(objectId: Id): DataPersisterHookInterface {
  const dispatch = useDispatch();

  return {
    onAddAssignee: useCallback(
      (userId) =>
        dispatch(onAddToTaskPeople(objectId, userId, TaskPeopleRole.ASSIGNEE)),
      [dispatch, objectId]
    ),
    onRemoveAssignee: useCallback(
      (userId) => dispatch(onRemoveFromTaskPeople(objectId, userId)),
      [dispatch, objectId]
    ),
  };
}
