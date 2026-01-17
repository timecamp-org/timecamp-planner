import { i18n } from '../../../common/i18n';
import isWithinRange from 'date-fns/is_within_range';
import isSameDay from 'date-fns/is_same_day';
import isAfter from 'date-fns/is_after';

export const getMonths = () => [
  i18n.t('January'),
  i18n.t('February'),
  i18n.t('March'),
  i18n.t('April'),
  i18n.t('May'),
  i18n.t('June'),
  i18n.t('July'),
  i18n.t('August'),
  i18n.t('September'),
  i18n.t('October'),
  i18n.t('November'),
  i18n.t('December'),
];

export const getMonthsShort = () => [
  i18n.t('Jan'),
  i18n.t('Feb'),
  i18n.t('Mar'),
  i18n.t('May'),
  i18n.t('Apr'),
  i18n.t('Jun'),
  i18n.t('Jul'),
  i18n.t('Aug'),
  i18n.t('Sep'),
  i18n.t('Oct'),
  i18n.t('Nov'),
  i18n.t('Dec'),
];

export const getWeekDaysLong = () => [
  i18n.t('Sunday'),
  i18n.t('Monday'),
  i18n.t('Tuesday'),
  i18n.t('Wednesday'),
  i18n.t('Thursday'),
  i18n.t('Friday'),
  i18n.t('Saturday'),
];

export const getWeekDaysShort = () => [
  i18n.t('Su'),
  i18n.t('Mo'),
  i18n.t('Tu'),
  i18n.t('We'),
  i18n.t('Th'),
  i18n.t('Fr'),
  i18n.t('Sa'),
];

export function getIsTodayInRange({ from, to }) {
  const today = new Date();

  if (!to && isSameDay(today, from)) {
    return true;
  }
  if (!to) {
    return false;
  }

  if (isAfter(from, to)) {
    return false;
  }
  const isInRange = isWithinRange(today, from, to);

  return isInRange;
}
