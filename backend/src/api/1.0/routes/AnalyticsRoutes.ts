import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import * as autoBind from 'auto-bind'
import { AnalyticsController } from '../controllers/AnalyticsController';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class AnalyticsRouteConfig implements RouteConfigInterface {

  private analyticsController: AnalyticsController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.AnalyticsController)
      analyticsController: AnalyticsController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.analyticsController = autoBind(analyticsController)
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/userFeedback': {
          post: {
            action: this.analyticsController.setUserFeedback,
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
          }
        }
      }
    }
  }
}
