export interface TimeServiceInterface {
  /**
   * Returns time that is considered 'now' in the system.
   * 
   * @return {Date}
   */
  getCurrentTime(): Date

  /**
   * Returns time that is considered 'now' in the system plus n milliseconds.
   *
   * @return {Date}
   */
  getNowPlusNMilliseconds(milliseconds: number): Date

  /**
   * Returns time that is converted from epoch.
   * 
   * @return {Date}
   */
  getTimeFromEpoch(epoch: number): Date

  /**
   * Returns time that is converted from seconds.
   * 
   * @return {number}
   */
  getTimeFromSeconds(seconds: number): Date
  /**
   * Number of SECONDS from beginning of UNIX epoch. Might be floating point.
   * 
   * @return {number}
   */
  getCurrentEpoch(): number

  /**
   * Number of SECONDS from beginning of UNIX epoch. Might be floating point.
   * 
   * @return {number}
   */
  getTimeFromDate(time: Date): number

  /**
   * Number of SECONDS from beginning of UNIX epoch without floating point
   * 
   * @return {number}
   */
  getEpochInSeconds(epochWithMilliseconds): number
  /**
   * Number of SECONDS from beginning of UNIX epoch without floating point
   * 
   * @return {number}
   */
  getEpochInSecondsFromString(datetime): number

  /**
   * Number of SECONDS between two dates
   * 
   * @return {number}
   */
  getDifferenceInSeconds(firstDate: Date, secondDate: Date): number

  getStartOfDay(date: Date): Date;

  getEndOfDay(date: Date): Date;

  getFormattedDateString(date: Date, formatStr: string): string;

  getDateNHoursAgo(hours: number): Date;

  getDateNDaysAgo(days: number): Date;

  getDateFromString(datetime: string): Date

  isDate1AfterDate2(date1: Date, date2: Date): boolean

  isDateEqual(date1: Date, date2: Date): boolean

  addDays(date: Date, amount: number): Date
}
