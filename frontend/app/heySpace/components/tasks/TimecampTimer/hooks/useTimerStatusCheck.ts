import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { onCheckTimerStatus } from 'models/domain/Timecamp/actions';
import { selectHasTimecampIntegration, selectIsTimerRunning } from 'models/domain/Timecamp/selectors';

export const useTimerStatusCheck = (taskId: Id) => {
  const dispatch = useDispatch();
  const hasIntegration = useSelector(selectHasTimecampIntegration);
  const isTimerRunning = useSelector(selectIsTimerRunning);

  useEffect(() => {
    if (hasIntegration && !isTimerRunning) {
      dispatch(onCheckTimerStatus({ taskId }));
    }
  }, [hasIntegration, taskId, dispatch]);

  return {
    hasIntegration,
  };
};
