import getTime from 'date-fns/get_time'

export function dateAsEpoch(optionalDate: Date | number): number {
  return getTime(optionalDate || new Date())
}

export function epochToDate(epoch: number): Date  {
  const date = new Date(0) // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(epoch)
  return date
}

export function timestampNow(): number {
  return new Date().getTime()
}

export function epochNow(): number {
  return timestampNow()
}
