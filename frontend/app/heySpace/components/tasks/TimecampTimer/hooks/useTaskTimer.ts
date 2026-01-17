import { useDispatch, useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { onSetTimer } from 'models/domain/Timecamp/actions';
import { selectTaskTimer } from 'models/domain/Timecamp/selectors';

import { useTimerStatusCheck } from './useTimerStatusCheck';

export const useTaskTimer = (taskId: Id) => {
  const dispatch = useDispatch();
  const taskTimer = useSelector((state) => selectTaskTimer(state, { taskId }));
  const { hasIntegration } = useTimerStatusCheck(taskId);

  const isTaskTimerRunning = taskTimer?.isRunning ?? false;

  const startTaskTimer = () =>
    hasIntegration
      ? dispatch(onSetTimer({ taskId, timeEntryAction: 'start' }))
      : dispatch(onOpenModal(ModalType.TIMECAMP_API_KEY_MODAL));

  const stopTaskTimer = () => dispatch(onSetTimer({ taskId, timeEntryAction: 'stop' }));

  const toggleTimer = () => {
    // eslint-disable-next-line no-unused-expressions
    isTaskTimerRunning ? stopTaskTimer() : startTaskTimer();
  };

  return {
    timer: taskTimer,
    startTaskTimer,
    stopTaskTimer,
    isTimerRunning: isTaskTimerRunning,
    toggleTimer,
  };
};
