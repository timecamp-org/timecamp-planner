import addDays from 'date-fns/add_days';
import addHours from 'date-fns/add_hours';
import addMinutes from 'date-fns/add_minutes';
import addWeeks from 'date-fns/add_weeks';
import { List } from 'immutable';

import { i18mark } from '../../../../../common/i18n';
import { epochNow } from '../../../../../common/utils/epoch';

export enum TimePeriod {
  HALF_QUARTER = 'HALF_QUARTER',
  QUARTER = 'QUARTER',
  HALF_HOUR = 'HALF_HOUR',
  ONE_HOUR = 'ONE_HOUR',
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  MORE = 'MORE',
}

export const dropdownKeys = List([
  TimePeriod.HALF_HOUR,
  TimePeriod.ONE_HOUR,
  TimePeriod.ONE_DAY,
  TimePeriod.ONE_WEEK,
  TimePeriod.MORE,
]);

export interface UserStatusProposal {
  resetPeriod: TimePeriod;
  emojiCode: string;
  title: string;
}

export const timePeriodDisplayNames = {
  [TimePeriod.QUARTER]: i18mark('15 minutes'),
  [TimePeriod.HALF_HOUR]: i18mark('30 minutes'),
  [TimePeriod.ONE_HOUR]: i18mark('1 hour'),
  [TimePeriod.ONE_DAY]: i18mark('1 day'),
  [TimePeriod.ONE_WEEK]: i18mark('1 week'),
  [TimePeriod.MORE]: i18mark('select date'),
};

export function getPeriodDate(period: TimePeriod): Date {
  const now = epochNow();
  switch (period) {
    case TimePeriod.QUARTER:
      return addMinutes(now, 15);
    case TimePeriod.HALF_HOUR:
      return addMinutes(now, 30);
    case TimePeriod.ONE_HOUR:
      return addHours(now, 1);
    case TimePeriod.ONE_DAY:
      return addDays(now, 1);
    case TimePeriod.ONE_WEEK:
      return addWeeks(now, 1);
    default:
      throw new Error(`Unsupported time period: ${period}`);
  }
}

export const statusProposals: UserStatusProposal[] = [
  {
    title: i18mark('Running late'),
    emojiCode: ':man-running:',
    resetPeriod: TimePeriod.QUARTER,
  },
  {
    title: i18mark('In a meeting'),
    emojiCode: ':calendar:',
    resetPeriod: TimePeriod.HALF_HOUR,
  },
  {
    title: i18mark('AFK'),
    emojiCode: ':red_circle:',
    resetPeriod: TimePeriod.ONE_HOUR,
  },
  {
    title: i18mark('Don’t disturb'),
    emojiCode: ':no_entry:',
    resetPeriod: TimePeriod.ONE_HOUR,
  },
  {
    title: i18mark('Remote work'),
    emojiCode: ':house:',
    resetPeriod: TimePeriod.ONE_DAY,
  },
  {
    title: i18mark('Sick Leave'),
    emojiCode: ':face_with_thermometer:',
    resetPeriod: TimePeriod.ONE_DAY,
  },
  {
    title: i18mark('Vacation'),
    emojiCode: ':palm_tree:',
    resetPeriod: TimePeriod.ONE_WEEK,
  },
];
