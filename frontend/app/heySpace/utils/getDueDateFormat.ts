import { differenceInCalendarDays, isThisWeek, isThisYear } from 'date-fns';

import { i18mark } from 'i18n';

export const getDueDateFormatAndLabel = (dueDate: number): { label: string; format: string } => {
  const dayDiff = differenceInCalendarDays(dueDate, new Date());
  const isOverdue = dayDiff < 0;

  if (dayDiff >= 0 && isThisWeek(dueDate)) {
    return { label: '', format: 'dddd' };
  } else if (isOverdue && dayDiff >= -7) {
    const absDiff = Math.abs(dayDiff);

    return {
      label: `${absDiff} ${i18mark(absDiff > 1 ? 'days ago' : 'day ago')}`,
      format: '',
    };
  } else if (isThisYear(dueDate)) {
    return { label: '', format: 'MMM DD' };
  } else {
    return {
      label: '',
      format: 'YYYY-MM-DD',
    };
  }
};
