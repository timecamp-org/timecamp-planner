import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';
import { onFetchTaskTimeEntry } from 'models/domain/Timecamp/actions';
import { selectElapsedTaskTime, selectHasTaskTimeEntry } from 'models/domain/Timecamp/selectors';

export const useTaskElapsedTime = (taskId: string) => {
  const dispatch = useDispatch();
  const hasTimeEntry = useSelector((state) => selectHasTaskTimeEntry(state, { taskId }));
  const taskElapsedTime = useSelector((state) => selectElapsedTaskTime(state, { taskId })) || 0;

  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, { requestType: RequestTypesConstants.checkTaskTimer, objectId: taskId })
  );

  useEffect(() => {
    if (!hasTimeEntry) {
      dispatch(onFetchTaskTimeEntry(taskId));
    }
  }, [taskId, hasTimeEntry, dispatch]);

  return {
    taskElapsedTime,
    isLoading,
  };
};
