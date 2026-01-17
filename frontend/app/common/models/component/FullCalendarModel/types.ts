import { ImmutableMap } from "../../../types";
import { Id } from "../../../utils/identifier";
import { Views } from 'react-big-calendar'

export interface DateRange {
  start?: Date,
  end?: Date,
}

export interface FullCalendarState extends ImmutableMap<string, any> {
  dateRanges: Map<Id, DateRange>,
  currentViews: Map<Id, Views>,
  currentDates: Map<Id, Date>,
  offsets: Map<Id, number>,
}
