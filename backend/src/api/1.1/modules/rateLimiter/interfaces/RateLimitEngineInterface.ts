import { RateLimitOptions, RateLimitHandler } from "../types";

export interface RateLimitEngineInterface {
  createLimiter(options: RateLimitOptions): RateLimitHandler
}
