import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import * as autoBind from 'auto-bind'
import { UsageTrackerController } from '../controllers/UsageTrackerController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class UsageTrackerRouteConfig implements RouteConfigInterface {

  private usageTrackerController: UsageTrackerController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.UsageTrackerController)
      usageTrackerController: UsageTrackerController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.usageTrackerController = autoBind(usageTrackerController)
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
          put: this.usageTrackerController.handleUsageTrackerEventsAction,
        },
      }
    }
  }
}
