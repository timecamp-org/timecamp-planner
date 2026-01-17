import addDays from 'date-fns/add_days';
import compareAsc from 'date-fns/compare_asc';
import differenceInDays from 'date-fns/difference_in_days';
import differenceInMonths from 'date-fns/difference_in_months';
import differenceInWeeks from 'date-fns/difference_in_weeks';
import differenceInYears from 'date-fns/difference_in_years';
import getDistanceInWords from 'date-fns/distance_in_words';
import endOfDay from 'date-fns/end_of_day';
import getEndOfWeek from 'date-fns/end_of_week';
import getFormat from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import getTime from 'date-fns/get_time';
import getYear from 'date-fns/get_year';
import isEqual from 'date-fns/is_equal';
import isSameYear from 'date-fns/is_same_year';
import getIsToday from 'date-fns/is_today';
import getIsYesterday from 'date-fns/is_yesterday';
import parse from 'date-fns/parse';
import setHours from 'date-fns/set_hours';
import setMinutes from 'date-fns/set_minutes';
import setSeconds from 'date-fns/set_seconds';
import { default as getStartOfDay, default as startOfDay } from 'date-fns/start_of_day';
import getStartOfToday from 'date-fns/start_of_today';
import getStartOfWeek from 'date-fns/start_of_week';
import createDate from 'sugar-date/date/create';
import { i18n } from '../i18n';
import { Maybe } from '../types';
import { dateNow, timestampToDate } from './date';
import { getMatchingPredefinedRangeName } from './predefinedRanges';

const locales = {
  en: require('date-fns/locale/en'),
  pl: require('date-fns/locale/pl'),
};

/**
 * ?
 *
 * @export
 * @param {string} dayId
 * @returns
 */
export function getTimestampFromDayId(dayId: string): number {
  return getTime(parse(dayId));
}

export function getTimestampFromDate(date: Date): number {
  return date ? date.getTime() : null;
}

export function parseDateIntoTimestamp(dateString: string): Maybe<number> {
  const parsedValue = createDate(dateString);
  if (!parsedValue) {
    return null;
  }
  return parsedValue.getTime();
}

export function parseTimeIntoTimestamp(timeString: string, referencedDate: Date | number): Maybe<number> {
  const dateString = format(referencedDate, 'YYYY-MM-DD');
  const parsedValue = parse(`${dateString}T${timeString}`);
  if (!parsedValue) {
    return null;
  }

  return parsedValue.getTime();
}

export function getHours(milliseconds: number): number {
  return Math.floor(milliseconds / (60 * 60 * 1000));
}

export function getMinutes(milliseconds: number): number {
  return Math.floor((milliseconds - getHours(milliseconds) * 60 * 60 * 1000) / (60 * 1000));
}

export function getSeconds(milliseconds: number): number {
  return Math.floor(
    (milliseconds - getHours(milliseconds) * 60 * 60 * 1000 - getMinutes(milliseconds) * 60 * 1000) / 1000
  );
}

export function getSecondsFromTimestamp(timestamp: number): number {
  return Math.floor(timestamp / 1000);
}

export function convertTimestampsToDateRange(
  startTimestamp: number,
  endTimestamp: number,
  shouldUsePredefinedRanges: boolean = true
): string {
  const startYear = getYear(startTimestamp);
  const startMonth = getMonth(startTimestamp);
  const startDate = parse(startTimestamp);

  const endYear = getYear(endTimestamp);
  const endMonth = getMonth(endTimestamp);
  const endDate = parse(endTimestamp);

  // if true show whole months e.g. January - March
  const wholeMonths = isFirstDayOfMonth(startTimestamp) && isLastDayOfMonth(endTimestamp);
  // if false always show year e.g. December 2016
  const isInThisYear = isThisYear(startTimestamp);

  let result;
  if (shouldUsePredefinedRanges) {
    result = getMatchingPredefinedRangeName(startDate, endDate);
  }
  if (startTimestamp >= 0 && endTimestamp >= 0 && !result) {
    if (startYear !== endYear) {
      const formatString = wholeMonths ? 'MMM YYYY' : 'DD MMM YYYY';
      result = `${format(startDate, formatString)} - ${format(endDate, formatString)}`;
    } else if (startMonth !== endMonth) {
      if (wholeMonths) {
        if (isInThisYear) {
          result = `${format(startDate, 'MMMM')} - ${format(endDate, 'MMMM')}`;
        } else {
          result = `${format(startDate, 'MMMM')} - ${format(endDate, 'MMMM YYYY')}`;
        }
      } else if (isInThisYear) {
        result = `${format(startDate, 'D MMM')} - ${format(endDate, 'D MMM')}`;
      } else {
        result = `${format(startDate, 'D MMM')} - ${format(endDate, 'D MMM YYYY')}`;
      }
    } else if (startDate !== endDate) {
      if (wholeMonths) {
        const formatString = isInThisYear ? 'MMMM' : 'MMMM YYYY';
        result = `${format(startDate, formatString)}`;
      } else if (isInThisYear) {
        result = `${format(startDate, 'DD')} - ${format(endDate, 'DD MMMM')}`;
      } else {
        result = `${format(startDate, 'DD')} - ${format(endDate, 'DD MMM YYYY')}`;
      }
    } else if (isInThisYear) {
      result = `${format(startDate, 'DD MMMM')}`;
    } else {
      result = `${format(startDate, 'DD MMMM YYYY')}`;
    }
  } else if (startTimestamp && !result) {
    result = `${format(startDate, 'DD MMMM YYYY')}`;
  } else if (endTimestamp && !result) {
    result = `${format(endDate, 'DD MMMM YYYY')}`;
  }

  return result;
}

export function isFirstDayOfMonth(timestamp: number): boolean {
  return isFirstDayOfMonth(timestamp);
}

export function isLastDayOfMonth(timestamp: number): boolean {
  return isLastDayOfMonth(timestamp);
}

export function isThisYear(timestamp: number): boolean {
  return isThisYear(timestamp);
}

export function isDayIdToday(dayId: string): boolean {
  return getIsToday(dayId);
}

export function isDayIdYesterday(dayId: string): boolean {
  return getIsYesterday(dayId);
}

export function datesBetween(startDate: Date, endDate: Date) {
  const dates = [];

  let currentDate = parse(getStartOfDay(startDate));
  const lastDate = parse(getStartOfDay(endDate));
  const numberOfDaysBetween = differenceInDays(lastDate, currentDate);

  dates.push(getTime(currentDate));

  for (let i = 0; i < numberOfDaysBetween; i++) {
    currentDate = addDays(currentDate, 1);
    dates.push(getTime(currentDate));
  }

  return dates;
}

export function isToday(timestamp: number): boolean {
  return getIsToday(timestamp);
}

export function isYesterday(timestamp: number): boolean {
  return getIsYesterday(timestamp);
}

export function timestampToDefaultDateString(timestamp: number): string {
  return format(timestamp, 'YYYY-MM-DD');
}

export function dateToTimestamp(date) {
  return getTime(date);
}

export function nowTimestamp() {
  return dateToTimestamp(new Date());
}

export function startOfToday() {
  return dateToTimestamp(getStartOfToday());
}

export const todayTimestamp = startOfToday;

export function getCurrentMonth() {
  return format(nowTimestamp(), 'MMMM');
}

export function getMonthFullName(date: Date | number) {
  return format(date, 'MMMM');
}

export function getMonthFullNameWithYear(date: Date | number) {
  return format(date, 'MMMM YYYY');
}

export function areTimestampsOnTheSameDay(timestamp1, timestamp2) {
  const date1 = parse(timestamp1);
  const date2 = parse(timestamp2);
  return isEqual(getStartOfDay(date1), getStartOfDay(date2));
}

export function convertTimestampToDashboardDate(timestamp) {
  const date = new Date(timestamp);
  let result = format(date, 'DD MMM');

  if (getIsToday(date)) {
    result = 'Today';
  } else if (getIsYesterday(date)) {
    result = 'Yesterday';
  }

  return result;
}

export function convertTimestampToDashboardDateAndTime(timestamp) {
  const date = new Date(timestamp);
  return format(date, 'DD MMM, hh:mmA');
}

export function isTimestampOverdue(timestamp) {
  const date = new Date(timestamp);
  const today = endOfDay(new Date());
  return compareAsc(date, today);
}

export function thisWeekRange() {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);

  return [startOfWeek.getTime(), endOfWeek.getTime()];
}

export function lastUpdateToHumanMessage(timestamp) {
  const date = getStartOfDay(timestampToDate(timestamp));
  const now = getStartOfDay(dateNow());
  let result = null;

  if (isToday(timestamp)) {
    result = 'Today';
  } else {
    const days = differenceInDays(now, date);
    const weeks = differenceInWeeks(now, date);
    const months = differenceInMonths(now, date);
    const years = differenceInYears(now, date);

    if (years > 0) {
      result = `${years} ${years > 1 ? 'years' : 'year'} ago`;
    } else if (months > 0) {
      result = `${months} ${months > 1 ? 'months' : 'month'} ago`;
    } else if (weeks > 0) {
      result = `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`;
    } else if (days > 0) {
      result = `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else {
      // do nothing
    }
  }

  return result;
}

export function setTimeWithSelectedDate(date, selectedDate) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let newDate = setHours(selectedDate, hours);
  newDate = setMinutes(newDate, minutes);
  newDate = setSeconds(newDate, seconds);
  return newDate;
}

export function isTimeObject(time) {
  return time && time.hasOwnProperty('hour') && time.hasOwnProperty('minute');
}

export function timestampToHour(timestamp) {
  const date = new Date(timestamp);
  return format(date, 'HH:mm');
}

export function timestampToDay(timestamp) {
  const date = new Date(timestamp);
  return getDate(date);
}

export function timestampToDateFormat(timestamp) {
  const date = new Date(timestamp);
  return format(date, 'DD MMM');
}

export function getFormattedDateForDateLine(timestamp: number): string {
  if (isToday(timestamp)) {
    return i18n.t(`Today, {{date}}`, { date: format(timestamp, 'MMMM Do') });
  } else if (isYesterday(timestamp)) {
    return i18n.t(`Yesterday, {{date}}`, {
      date: format(timestamp, 'MMMM Do'),
    });
  } else {
    return format(timestamp, 'dddd, MMMM Do', {
      shouldAppendYearIfDifferentThanCurrent: true,
    });
  }
}

export function getFormattedDateForFilesTable(timestamp: number): string {
  return format(timestamp, 'MMMM Do', {
    shouldAppendYearIfDifferentThanCurrent: true,
  });
}

export function format(
  date: Date | number,
  formatStr: string,
  options: { shouldAppendYearIfDifferentThanCurrent?: boolean } = {}
): string {
  if (options.shouldAppendYearIfDifferentThanCurrent && !isSameYear(date, Date.now())) {
    formatStr = `${formatStr} YYYY`;
  }

  return getFormat(date, formatStr, {
    locale: locales[i18n.language],
  });
}

export function distanceInWords(dateA, dateB, params): string {
  return getDistanceInWords(dateA, dateB, {
    ...params,
    locale: locales[i18n.language],
  });
}

export function isStartOfDay(date: Date | string | number): boolean {
  const startOfDay = getStartOfDay(date);
  return isEqual(startOfDay, date);
}

export function getDayStartTimestampFromDate(date: Date | string | number): number {
  return startOfDay(date).getTime();
}

export function getDayEndTimestampFromDate(date: Date | string | number): number {
  return endOfDay(date).getTime();
}
