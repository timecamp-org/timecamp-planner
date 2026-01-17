import {UserDbRow} from '../../db/schema'
import {format} from 'date-fns'
import { DateFormatterServiceInterface } from './DateFormatterServiceInterface';
import { injectable } from 'inversify';
import { DateFlavor, DEFAULT_FORMAT } from './types';

/**
 * For now locale settings is ignored as we do not support it.
 * Only default date formats are used. 
 */
@injectable()
export class DateFormatterService implements DateFormatterServiceInterface {

  format(date: Date, flavor: DateFlavor, user?: UserDbRow) : string {
    const formatString = this.getFormat(date, flavor, user);
    return format(date, formatString);
  }
  
  getFormat(date: Date, flavor: DateFlavor, user?: UserDbRow): string {
    return DEFAULT_FORMAT[flavor];
  }
}
