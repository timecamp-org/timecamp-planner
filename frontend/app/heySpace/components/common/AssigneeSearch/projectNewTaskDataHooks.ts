import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import {
  DataPersisterHookInterface,
  DataProviderHookInterface,
} from 'commonComponents/AssigneeSearch/dataHooks';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { onCreateUserAndAddToSubscribers } from 'models/domain/TasksModel/actions';
import { TaskPeopleRole } from 'models/domain/TasksModel/types';
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain';

export function useDataProvider(objectId: Id): DataProviderHookInterface {
  return {
    objectColor: useSelector((state) =>
      selectProjectColor(state, { projectId: objectId })
    ),
    usersSearchName: useSelector((state) => selectUsersSearchName(state)),
  };
}

export function useDataPersister(objectId: Id): DataPersisterHookInterface {
  const dispatch = useDispatch();

  return {
    onCreateUserAndAddToSubscribers: useCallback(
      (email) =>
        dispatch(
          onCreateUserAndAddToSubscribers(
            objectId,
            email,
            TaskPeopleRole.ASSIGNEE
          )
        ),
      [dispatch, objectId]
    ),
  };
}
