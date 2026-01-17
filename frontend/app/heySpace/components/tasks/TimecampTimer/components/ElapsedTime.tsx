import { FC } from 'react';

import moment from 'moment';

import { TaskTimerBox } from './styled';

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const ElapsedTime: FC<{ seconds: number }> = ({ seconds }) => {
  if (!seconds) {
    return <TaskTimerBox>00:00:00</TaskTimerBox>;
  }

  const duration = moment.duration(seconds, 'seconds');
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();

  return (
    <TaskTimerBox>
      {formatTime(h)}:{formatTime(m)}:{formatTime(s)}
    </TaskTimerBox>
  );
};
