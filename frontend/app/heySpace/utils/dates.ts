import { eachDay, isWeekend } from 'date-fns';

export const differenceInBusinessDays = (start: number, end: number): number =>
  eachDay(start, end).reduce((acc, day) => (isWeekend(day) ? acc : acc + 1), 0);
