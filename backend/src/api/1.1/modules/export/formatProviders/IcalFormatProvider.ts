import { injectable } from "inversify";
import { ICalCalendarEventData, ICalCalendarData } from "../types";
import { CalendarProviderInterface } from "../interfaces/CalendarProviderInterface";
import * as ical from 'ical-generator'
const ICalCalendar = require('ical-generator') // beacuse Ical.IcalCalendar is not a constructor ...

@injectable()
export class IcalFormatProvider 
implements CalendarProviderInterface {

  createCalendar(calendarData: ICalCalendarData): ical.ICalCalendar {
    return new ICalCalendar({
      name: calendarData.name,
      prodId: { 
        company: calendarData.company, 
        product: calendarData.product 
      },
    })
  }

  createEvent(calendar: ical.ICalCalendar, event: ICalCalendarEventData) {
    return calendar.createEvent({
      start: event.start,
      end: event.end,
      summary: event.title,
      description: event.description,
      allDay: event.allDay,
    })
  }
}
