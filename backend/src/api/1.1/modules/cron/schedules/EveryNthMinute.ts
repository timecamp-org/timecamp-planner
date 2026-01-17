import { CronScheduleInterface } from '../CronScheduleInterface'

export class EveryNthMinute
  implements CronScheduleInterface
{
  protected n : number;

  constructor(n: number) {
    this.n = n
  }
  
  inSchedule(date: Date): boolean {
    return (date.getMinutes() % this.n) === 0;
  }
}