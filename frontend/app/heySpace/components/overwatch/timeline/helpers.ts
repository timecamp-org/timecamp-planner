import addMonths from 'date-fns/add_months';
import addWeeks from 'date-fns/add_weeks';
import getStartOfMonth from 'date-fns/start_of_month';
import getStartOfWeek from 'date-fns/start_of_week';

import { timestampNow } from 'common/utils/epoch';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';

type TimeBounds = {
  timeStart: number;
  timeEnd: number;
};

export function getNewTimeBounds(durationType: PeriodDurationType, initialTime?: number): TimeBounds {
  const startTime = initialTime ?? timestampNow();
  let timeStart: Date;
  let timeEnd: Date;

  switch (durationType) {
    case PeriodDurationType.WEEK: {
      timeStart = getStartOfWeek(startTime);
      timeEnd = addWeeks(timeStart, 1);
      break;
    }
    case PeriodDurationType.TWO_WEEKS: {
      timeStart = getStartOfWeek(startTime);
      timeEnd = addWeeks(timeStart, 2);
      break;
    }
    case PeriodDurationType.MONTH: {
      timeStart = getStartOfMonth(startTime);
      timeEnd = addMonths(timeStart, 1);
      break;
    }
    case PeriodDurationType.QUARTER: {
      timeStart = getStartOfMonth(startTime);
      timeEnd = addMonths(timeStart, 3);
      break;
    }
    case PeriodDurationType.HALF_YEAR: {
      timeStart = getStartOfMonth(startTime);
      timeEnd = addMonths(timeStart, 6);
      break;
    }
    default: {
      throw new Error('Unimplemented duration type');
    }
  }

  return {
    timeStart: timeStart.getTime(),
    timeEnd: timeEnd.getTime(),
  };
}
