/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { FC } from 'react';

import { isWeekend } from 'date-fns';

import { getDurationHumanText, parseMinutesToDuration } from 'common/utils/duration';
import { ScheduleItem } from 'models/domain/ScheduleModel/types';

import styles from './styles.css';

// TODO replace with user work time settings
const WORK_TIME = 8 * 60;

interface TimeCapacityMarkerInterface {
  item: ScheduleItem;
}

export const TimeCapacityMarker: FC<TimeCapacityMarkerInterface> = ({ item: { start_time, minutes } }) => {
  const isWorkingDay = !isWeekend(start_time);
  const isOvertime = minutes > WORK_TIME;
  const color = isOvertime ? 'var(--color-critical-500)' : 'var(--color-gray-900)';
  const estimatedDailyWorkTime = isOvertime ? minutes - WORK_TIME : minutes;

  return (
    <div className={styles.marker} style={{ color }}>
      {isWorkingDay
        ? `${isOvertime ? '+' : ''}${getDurationHumanText(parseMinutesToDuration(estimatedDailyWorkTime))}`
        : ''}
    </div>
  );
};
