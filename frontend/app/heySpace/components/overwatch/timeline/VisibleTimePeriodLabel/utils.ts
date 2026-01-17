import { PeriodDurationType, week } from 'common/utils/timeIntervalDefinitions'
import { i18n } from 'i18n'
import getISOWeek from 'date-fns/get_iso_week'
import getMonth from 'date-fns/get_month'
import getQuarter from 'date-fns/get_quarter'

export function getPeriodLabelText(periodDuration: PeriodDurationType, periodStartTimestamp: number): string {
  switch (periodDuration) {
    case PeriodDurationType.WEEK: {
      return i18n.t('Week {{weekNumber}}', { weekNumber: getISOWeek(periodStartTimestamp) })
    }
    case PeriodDurationType.TWO_WEEKS: {
      return i18n.t('Weeks {{startWeek}}-{{endWeek}}', { startWeek: getISOWeek(periodStartTimestamp), endWeek: getISOWeek(periodStartTimestamp + (2 * week)) })
    }
    case PeriodDurationType.MONTH: {
      return i18n.t('Month {{monthNumber}}', { monthNumber: getMonth(periodStartTimestamp) + 1 })
    }
    case PeriodDurationType.QUARTER: {
      return i18n.t('Quarter {{quarterNumber}}', { quarterNumber: getQuarter(periodStartTimestamp) })
    }
    case PeriodDurationType.HALF_YEAR: {
      return i18n.t('Year half: {{yearHalfNumber}}', { yearHalfNumber: getYearHalf(periodStartTimestamp) })
    }
    default: {
      return 'EMPTY LABEL'
    }
  }
}

function getYearHalf(timestamp: number): 1 | 2 {
  const quarter = getQuarter(timestamp)
  if (quarter <= 2) {
    return 2
  } else {
    return 1
  }
}
