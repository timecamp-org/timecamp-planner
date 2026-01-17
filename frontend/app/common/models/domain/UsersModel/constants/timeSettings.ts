import { TimeSettingsOption } from 'models/domain/UsersModel/types';

export enum DateFormat {
  DayMonthYear = 'DD.MM.YYYY',
  MonthDayYear = 'MM.DD.YYYY',
  YearMonthDay = 'YYYY-MM-DD',
  MonthDay = 'MMM, D',
}

export enum TimeFormat {
  HoursMinutes = 'HH:mm',
}

export const dateFormatOptions: Record<string, TimeSettingsOption> = {
  DayMonthYear: {
    label: 'Day-Month-Year',
    value: DateFormat.DayMonthYear,
  },
  MonthDayYear: {
    label: 'Month-Day-Year',
    value: DateFormat.MonthDayYear,
  },
  YearMonthDay: {
    label: 'Year-Month-Day',
    value: DateFormat.YearMonthDay,
  },
};
