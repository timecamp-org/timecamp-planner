import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import addWeeks from 'date-fns/add_weeks';
import addYears from 'date-fns/add_years';
import getDiffInDays from 'date-fns/difference_in_calendar_days';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isBefore from 'date-fns/is_before';
import isToday from 'date-fns/is_today';
import setDate from 'date-fns/set_date';
import setMonth from 'date-fns/set_month';
import getStartOfDay from 'date-fns/start_of_day';
import getStartOfMonth from 'date-fns/start_of_month';
import getStartOfWeek from 'date-fns/start_of_week';
import { List } from 'immutable';

import { Maybe, PeriodType } from '../../../../common/types';
import { epochNow } from '../../../../common/utils/epoch';

export function getNextRecurrenceAt(
  period: PeriodType,
  interval: number,
  weekDays: List<number>,
  dayOfMonth: number,
  month: number
): Maybe<Date> {
  const now = new Date(epochNow());
  let nextRecurrenceAt: Date = null;
  switch (period) {
    case PeriodType.DAILY: {
      const startOfDay = getStartOfDay(now);
      nextRecurrenceAt = addDays(startOfDay, interval);
      break;
    }
    case PeriodType.WEEKLY: {
      if (weekDays.size === 0) {
        return null;
      }
      nextRecurrenceAt = getClosestWeekDay(weekDays, interval);
      break;
    }
    case PeriodType.MONTHLY:
      return getFirstAvailableMonthForDay(dayOfMonth, interval);
    case PeriodType.YEARLY: {
      if (month === null) {
        return null;
      }
      let date = now;
      date = setMonth(date, month);
      date = setDate(date, dayOfMonth);

      if (isToday(date) || isBefore(date, now)) {
        date = addYears(date, interval);
      }
      nextRecurrenceAt = date;
      break;
    }
    default:
      return null;
  }
  return getStartOfDay(nextRecurrenceAt);
}

export function getClosestWeekDay(
  weekDays: List<number>,
  interval: number
): Date {
  const now = new Date(epochNow());
  let closestWeekDay = null;
  weekDays.forEach((weekDay) => {
    let date = now;
    date = getStartOfWeek(date);
    date = addDays(date, weekDay);
    if (isToday(date) || isBefore(date, now)) {
      date = addWeeks(date, interval);
    }

    const prevDiffInDays = getDiffInDays(closestWeekDay, now);
    const diffInDays = getDiffInDays(date, now);
    if (diffInDays > -1 && (!closestWeekDay || diffInDays < prevDiffInDays)) {
      closestWeekDay = date;
    }
    return closestWeekDay;
  });

  return closestWeekDay;
}

function getFirstAvailableMonthForDay(dayOfMonth, interval) {
  const now = new Date();
  let date = now;
  date = getStartOfMonth(date);
  date = addMonths(date, interval);

  let daysInMonth = getDaysInMonth(date);

  let nextMonth = date;
  while (
    daysInMonth < dayOfMonth ||
    isToday(nextMonth) ||
    isBefore(nextMonth, now)
  ) {
    nextMonth = addMonths(nextMonth, 1);
    daysInMonth = getDaysInMonth(nextMonth);
  }

  return setDate(nextMonth, dayOfMonth);
}

export function getMaxDayOfMonth(month: number): number {
  const now = new Date(epochNow());
  const date = setMonth(now, month);
  return getDaysInMonth(date);
}
