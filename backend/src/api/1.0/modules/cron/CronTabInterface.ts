import { CronScheduleInterface } from './CronScheduleInterface'
import { CronTabJobInterface } from './CronTabJobInterface'

export interface CronTabInterface
{
  /**
   * Resumes jobs according to schedule.
   */
  start();

  /**
   * Prevents all future jobs from starting and gracefully
   * waits until currently running jobs finish.
   */
  stop() : PromiseLike<void>;

  /**
   * Registers job with given schedule.
   * If job was already registered it will be rescheduled with new schedule.
   * 
   * @param schedule
   * @param job
   */
  schedule(job: CronTabJobInterface, schedule : CronScheduleInterface);

  /**
   * Removes job from schedule completely.
   * 
   * @param job
   */
  unregister(job: CronTabJobInterface);
}