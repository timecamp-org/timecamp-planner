import { CronScheduleInterface } from '../CronScheduleInterface'

export class EveryNthHour
implements CronScheduleInterface
{
  protected n : number;

  constructor(n: number) {
    this.n = n
  }
  
  inSchedule(date: Date): boolean {
    return (date.getHours() % this.n) === 0 && date.getMinutes() === 0;
  }
}
