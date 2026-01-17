import { TimeServiceInterface } from "./TimeServiceInterface";
import { injectable } from "inversify";
import * as differenceInSeconds from 'date-fns/difference_in_seconds'
import * as startOfDay from 'date-fns/start_of_day'
import * as endOfDay from 'date-fns/end_of_day'
import * as format from 'date-fns/format'
import * as isAfter from 'date-fns/is_after'
import * as isEqual from 'date-fns/is_equal'
import * as addMilliseconds from 'date-fns/add_milliseconds'
import * as addDays from 'date-fns/add_days'

@injectable()
export class TimeService implements TimeServiceInterface {

  getCurrentTime(): Date {
    return new Date();
  }

  getNowPlusNMilliseconds(milliseconds: number): Date {
    return addMilliseconds(this.getCurrentTime(), milliseconds)
  }

  getTimeFromEpoch(epoch): Date {
    return new Date(epoch);
  }

  getTimeFromSeconds(seconds: number): Date {
    return new Date(seconds * 1000);
  }

  getCurrentEpoch(): number {
    return this.getCurrentTime().getTime() / 1000;
  }

  getTimeFromDate(date): number {
    return date.getTime();
  }

  getEpochInSeconds(epochWithMilliseconds): number {
    return Math.floor(epochWithMilliseconds / 1000)
  }

  getEpochInSecondsFromString(datetime: string): number {
    return Math.floor(new Date(datetime).getTime() / 1000)
  }

  getDifferenceInSeconds(firstDate: Date, secondDate: Date): number {
    return differenceInSeconds(firstDate, secondDate);
  }

  getStartOfDay(date: Date): Date {
    return startOfDay(date)
  }

  getEndOfDay(date: Date): Date {
    return endOfDay(date)
  }

  getFormattedDateString(date: Date, formatStr: string): string {
    return format(date, formatStr)
  }

  getDateNHoursAgo(hours: number): Date {
    const millisecondsInHours = hours * 3600 * 1000
    const timestampNHoursAgo: number = this.getCurrentTime().getTime() - millisecondsInHours
    return this.getTimeFromEpoch(timestampNHoursAgo)
  }

  getDateNDaysAgo(days: number): Date {
    const millisecondsInDays = days * 24 * 3600 * 1000
    const timestampNDaysAgo: number = this.getCurrentTime().getTime() - millisecondsInDays
    return this.getTimeFromEpoch(timestampNDaysAgo)
  }

  getDateFromString(datetime: string): Date {
    return new Date(datetime)
  }

  isDate1AfterDate2(date1: Date, date2: Date): boolean {
    return isAfter(date1, date2)
  }

  isDateEqual(date1: Date, date2: Date): boolean {
    return isEqual(date1, date2)
  }

  addDays(date: Date, amount: number): Date {
    return addDays(date, amount)
  }
}
