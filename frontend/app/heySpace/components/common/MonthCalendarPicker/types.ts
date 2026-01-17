import { Moment } from 'moment';

export interface MonthCalendarInterface {
  value: Moment;
  onChange: (value: Moment) => void;
}
