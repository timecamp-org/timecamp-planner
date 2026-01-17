import getDaysInMonth from 'date-fns/get_days_in_month'
import getDaysInYear from 'date-fns/get_days_in_year'
import startOfQuarter from 'date-fns/start_of_quarter'
import endOfQuarter from 'date-fns/end_of_quarter'
import differenceInDays from 'date-fns/difference_in_days'

export const second = 1000
export const minute = 60 * second
export const hour = minute * 60
export const day = hour * 24
export const week = 7 * day
export const twoWeeks = 2 * week

export enum PeriodDurationType {
  WEEK = 'week',
  TWO_WEEKS = 'two_weeks',
  MONTH = 'month',
  QUARTER = 'quarter',
  HALF_YEAR = 'half_year',
}

export function getPeriodDuration(currentDate: number | Date, periodDurationType: PeriodDurationType): number {
  switch (periodDurationType) {
    case PeriodDurationType.WEEK: {
      return week
    }
    case PeriodDurationType.TWO_WEEKS: {
      return twoWeeks
    }
    case PeriodDurationType.MONTH: {
      return getDaysInMonth(currentDate) * day
    }
    case PeriodDurationType.QUARTER: {
      const days = Math.abs(differenceInDays(startOfQuarter(currentDate), endOfQuarter(currentDate)))
      return days * day
    }
    case PeriodDurationType.HALF_YEAR: {
      return Math.abs(getDaysInYear(currentDate) / 2) * day
    }
    default: {
      throw new Error('Unimplemented period duration')

    }


  }
}