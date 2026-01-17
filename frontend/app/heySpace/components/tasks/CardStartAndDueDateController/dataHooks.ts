import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as TaskModelActions from 'models/domain/TasksModel/actions';
import { selectTaskColor, selectTaskDueDate, selectTaskStartDate } from 'models/domain/TasksModel/selectors';
import { TaskInterface } from 'models/domain/TasksModel/types';

export type DataProviderHook = {
  startDate: number;
  dueDate: number;
  color: string;
};

export function useDataProvider(taskId: Id): DataProviderHook {
  return {
    startDate: useSelector((state) => selectTaskStartDate(state, { taskId })),
    dueDate: useSelector((state) => selectTaskDueDate(state, { taskId })),
    color: useSelector((state) => selectTaskColor(state, { taskId })),
  };
}

export type DataPersisterHook = {
  onTaskUpdate: (fields: Pick<TaskInterface, 'startDate' | 'dueDate'>) => void;
};

export function useDataPersister(taskId: Id): DataPersisterHook {
  const dispatch = useDispatch();

  return {
    onTaskUpdate: useCallback(
      (fields: Pick<TaskInterface, 'startDate' | 'dueDate'> = {}) =>
        dispatch(TaskModelActions.onTaskUpdate(taskId, fields, true)),
      [dispatch, taskId]
    ),
  };
}
