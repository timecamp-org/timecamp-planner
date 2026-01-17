import { DateFlavor } from "./types";
import { UserDbRow } from "../../db/schema";

/**
 * Formats date in various flavours
 * according to user's locale (IN FUTURE/TODO)
 */
export interface DateFormatterServiceInterface {
  /**
   * Formats date for specific usage (stated as flavor) according to user's 
   * locale settings. If no user object is provided then default locale is used.
   * 
   * @param date
   * @param {UserDbRow} user
   * @param {DateFlavor} flavor
   * @return {string}
   */

  format(date: Date, flavor: DateFlavor, user?: UserDbRow) : string;
  
  getFormat(date: Date, flavor: DateFlavor, user?: UserDbRow) : string;
}
