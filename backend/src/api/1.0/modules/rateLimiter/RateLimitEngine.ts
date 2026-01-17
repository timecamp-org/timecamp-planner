import * as rateLimits from 'express-rate-limit'
import { RateLimitOptions } from "./types";
import { injectable } from "inversify";
import { RateLimitEngineInterface } from './interfaces/RateLimitEngineInterface';
import { createDefaultMessageWithTime } from './utils';

@injectable()
export class RateLimitEngine
  implements RateLimitEngineInterface {

  createLimiter(options: RateLimitOptions): rateLimits.RateLimit {
    const translatedOptions = this.getTranslatedOptions(options)
    return rateLimits(translatedOptions)
  }

  private getTranslatedOptions(options: RateLimitOptions): rateLimits.Options {
    const { maxConnectionsPerTimeWindow, interval, ...restOptions } = options
    return {
      max: maxConnectionsPerTimeWindow,
      windowMs: interval.getMilliseconds(),
      message: createDefaultMessageWithTime(interval.getDisplayValue()),
      ...restOptions,
    }
  }


}
