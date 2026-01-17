import { RateLimitIntervalInterface } from "../interfaces/RateLimitIntervalInterface";

export class NSecondsInterval
  implements RateLimitIntervalInterface {
  protected n: number;

  constructor(n: number) {
    this.n = n
  }

  getMilliseconds(): number {
    return this.n * 1000
  }

  getDisplayValue(): string {
    return `${this.n} seconds`
  }
}
