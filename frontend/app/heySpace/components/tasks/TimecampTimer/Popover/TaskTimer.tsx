import { differenceInSeconds } from 'date-fns';
import { FC, useEffect, useRef, useState } from 'react';
import { ElapsedTime } from '../components/ElapsedTime';
import { useTaskTimer } from '../hooks/useTaskTimer';
import { TaskTimerInterface } from './TimecampTimerPopoverButton';

export const TaskTimer: FC<TaskTimerInterface> = ({ taskId }) => {
  const { timer } = useTaskTimer(taskId);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerInterval = useRef(null);

  useEffect(() => {
    if (!timer?.taskId) {
      clearInterval(timerInterval.current);
      setTimeElapsed(0);
      timerInterval.current = null;

      return;
    }

    setTimeElapsed(differenceInSeconds(new Date(), timer.startedAt));

    timerInterval.current = setInterval(() => {
      setTimeElapsed(differenceInSeconds(new Date(), timer.startedAt));
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(timerInterval.current);
    };
  }, [timer]);

  return <ElapsedTime seconds={timeElapsed} />;
};
