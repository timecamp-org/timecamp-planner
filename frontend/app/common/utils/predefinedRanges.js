import subDays from 'date-fns/sub_days'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import subWeeks from 'date-fns/sub_weeks'
import startOfMonth from 'date-fns/start_of_month'
import endOfMonth from 'date-fns/end_of_month'
import startOfYear from 'date-fns/start_of_year'
import endOfYear from 'date-fns/end_of_year'
import subYears from 'date-fns/sub_years'
import isSameDay from 'date-fns/is_same_day'
import startOfDay from 'date-fns/start_of_day'
import subMonths from 'date-fns/sub_months'

const predefinedRanges = {
  Today: {
    startDate: (now) => now,
    endDate: (now) => now,
  },
  Yesterday: {
    startDate: (now) => subDays(now, 1),
    endDate: (now) => subDays(now, 1),
  },
  'This week': {
    startDate: (now) => startOfWeek(now),
    endDate: (now) => endOfWeek(now),
  },
  'Last week': {
    startDate: (now) => startOfWeek(subWeeks(now, 1)),
    endDate: (now) => endOfWeek(subWeeks(now, 1))
  },
  'This month': {
    startDate: (now) => startOfMonth(now),
    endDate: (now) => endOfMonth(now)
  },
  'Last month': {
    startDate: (now) => startOfMonth(subMonths(now, 1)),
    endDate: (now) => endOfMonth(subMonths(now, 1)),
  },
  'This year': {
    startDate: (now) => startOfYear(now),
    endDate: (now) => endOfYear(now),
  },
  'Last year': {
    startDate: (now) => startOfYear(subYears(now, 1)),
    endDate: (now) => endOfYear(subYears(now, 1))
  },
  'All time': {
    startDate: (now) => 0,
    endDate: (now) => now,
  }
}

export function getMatchingPredefinedRangeName(startDate, endDate) {
  // if the arguments correspond to a range predefined in predefinedRanges.js (at the present moment),
  // this function returns that range's name as a string
  const matchingPredefinedRanges = Object.keys(predefinedRanges)
    .filter(
      (key) => (
        isSameDay(startOfDay(predefinedRanges[key].startDate(Date.now())), startOfDay(startDate))
        && isSameDay(startOfDay(predefinedRanges[key].endDate(Date.now())), startOfDay(endDate))
      )
    )
  return matchingPredefinedRanges[0]
}

export default predefinedRanges
