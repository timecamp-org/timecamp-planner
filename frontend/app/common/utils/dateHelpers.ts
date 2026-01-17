import startOfMonthFNS from 'date-fns/start_of_month'
import endOfMonthFNS from 'date-fns/end_of_month'

export function startOfMonth(date: number | Date): Date {
  //returns Date obj. set to start of month in current timezone
  return startOfMonthFNS(date)
}

export function endOfMonth(date: number | Date): Date {
  //returns Date obj. set to end of month in current timezone
  return endOfMonthFNS(date)
}
