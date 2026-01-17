import { ICalCalendarEventData, ICalCalendarData } from "../types";

export interface CalendarProviderInterface {

  createCalendar(calendarData: ICalCalendarData);

  createEvent(calendar, event: ICalCalendarEventData);
}
