import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions'
import { i18mark } from 'i18n'
import { VisibleTimePeriodDropdownItem } from './types'

export function getLabelName(periodDuration: PeriodDurationType): string {
  switch (periodDuration) {
    case PeriodDurationType.WEEK: {
      return i18mark('Week')
    }
    case PeriodDurationType.TWO_WEEKS: {
      return i18mark('2 Weeks')
    }
    case PeriodDurationType.MONTH: {
      return i18mark('Month')
    }
    case PeriodDurationType.QUARTER: {
      return i18mark('3 Months')
    }
    case PeriodDurationType.HALF_YEAR: {
      return i18mark('Half Year')
    }
    default: {
      return 'EMPTY LABEL'
    }
  }
}

export function getDropdownItem(periodDuration: PeriodDurationType): VisibleTimePeriodDropdownItem {
  return {
    label: getLabelName(periodDuration),
    key: periodDuration,
  }
}