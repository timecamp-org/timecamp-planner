import { RateLimitIntervalInterface } from "../interfaces/RateLimitIntervalInterface";

export class NMinutesInterval
  implements RateLimitIntervalInterface {
  protected n: number;

  constructor(n: number) {
    this.n = n
  }

  getMilliseconds(): number {
    return this.n * 60 * 1000
  }

  getDisplayValue(): string {
    return `${this.n} minutes`
  }
}
