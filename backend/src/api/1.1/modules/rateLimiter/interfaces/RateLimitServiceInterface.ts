import { RateLimitRule, RateLimitHandler } from "../types";

export interface RateLimitServiceInterface {
  getLimiter(rule: RateLimitRule): RateLimitHandler;
}
