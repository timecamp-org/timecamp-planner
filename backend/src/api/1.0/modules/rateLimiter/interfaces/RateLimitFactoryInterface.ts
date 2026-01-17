import { RateLimitOptions, RateLimitHandler } from "../types";

export interface RateLimitFactoryInterface {
  createRateLimit(options: RateLimitOptions): RateLimitHandler;
}
