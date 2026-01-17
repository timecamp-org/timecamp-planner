import { RateLimitServiceInterface } from "./interfaces/RateLimitServiceInterface";
import { RateLimitHandler, RateLimitRule, RateLimitConfig } from "./types";
import { injectable, inject } from "inversify";
import { RateLimitModule } from "./RateLimiterModule";
import { RateLimitFactoryInterface } from "./interfaces/RateLimitFactoryInterface";
import RateLimitDefinitions from "./RateLimitDefinitions";
import { NextFunction, Response, Request } from "express";

@injectable()
export class RateLimitService implements RateLimitServiceInterface {
  private rateLimitFactory: RateLimitFactoryInterface;
  private config: RateLimitConfig;

  constructor(
    @inject(RateLimitModule.RateLimitFactoryInterface)
    rateLimitFactory: RateLimitFactoryInterface,
    @inject(RateLimitModule.RateLimitConfig)
    config: RateLimitConfig,
  ) {
    this.rateLimitFactory = rateLimitFactory
    this.config = config
  }

  skipRateLimiter(req: Request, res: Response, next: NextFunction) {
    return next()
  }

  keyHandler(req: Request) {
    const currentUserId = req.heyspace.authResult.userId;
    if (currentUserId) {
      return `${currentUserId}::${req.ip}`
    } else {
      return req.ip
    }
  }

  getLimiter(rule: RateLimitRule): RateLimitHandler {
    const definition = RateLimitDefinitions[rule]
    if (!this.config.isEnabled) {
      definition.handler = this.skipRateLimiter
    }
    definition.keyGenerator = this.keyHandler
    return this.rateLimitFactory.createRateLimit(definition)
  }

}
