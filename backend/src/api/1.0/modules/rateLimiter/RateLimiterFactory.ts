import { RateLimitOptions, RateLimitHandler } from "./types";
import { injectable, inject } from "inversify";
import { RateLimitModule } from "./RateLimiterModule";
import { RateLimitFactoryInterface } from "./interfaces/RateLimitFactoryInterface";
import { RateLimitEngineInterface } from "./interfaces/RateLimitEngineInterface";

@injectable()
export class RateLimitFactory implements RateLimitFactoryInterface {
  private rateLimitEngine: RateLimitEngineInterface

constructor(
  @inject(RateLimitModule.RateLimitEngine)
  rateLimitEngine: RateLimitEngineInterface,
) {
  this.rateLimitEngine = rateLimitEngine
}

  createRateLimit(options: RateLimitOptions): RateLimitHandler {
    return this.rateLimitEngine.createLimiter(options)
  }
  
}
