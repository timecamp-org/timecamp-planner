import differenceInDays from 'date-fns/difference_in_days';
import getDay from 'date-fns/get_day';
import getMonth from 'date-fns/get_month';

export function getVerticalLineClassNamesForTime(start: number, end: number): string[] {
  if (differenceInDays(end, start) > 1) {
    const monthNumber = getMonth(start);
    if (monthNumber % 2 !== 0) {
      // when styling month vertical lines pass empty string as first class name to fix react-calendar-timeline bug:
      // lib wrongly concats internal classnames with ones provided by us.
      // Remove this hack-fix after https://github.com/namespace-ee/react-calendar-timeline/pull/729 gets merged.
      return ['', 'timeline-month', 'timeline-month-odd'];
    } else {
      return ['', 'timeline-month', 'timeline-month-even'];
    }
  } else {
    const weekDayNumber = getDay(start);

    if (weekDayNumber % 2 !== 0) {
      return ['timeline-day', 'timeline-day-odd', `timeline-day-data=${start}`];
    } else if (weekDayNumber === 0) {
      return ['timeline-day', 'timeline-day-saturday', `timeline-day-data=${start}`];
    } else {
      return ['timeline-day', 'timeline-day-even', `timeline-day-data=${start}`];
    }
  }
}
