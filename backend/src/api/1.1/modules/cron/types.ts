import { CronTabJobInterface } from './CronTabJobInterface'
import { CronScheduleInterface } from './CronScheduleInterface'
import { LoggerInterface } from '../../../../infrastructure/logger'

export type CronTabEntry = {
  job: CronTabJobInterface,
  schedule: CronScheduleInterface,
}
export interface CronTabHandle extends CronTabEntry{
  runningPromise?: PromiseLike<void>,
  logger: LoggerInterface,
}