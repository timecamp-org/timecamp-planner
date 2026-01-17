import { inject, injectable } from 'inversify';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { TimeCampController } from '../controllers/TimeCampController';
import { RouteConfigInterface } from './RouteConfigInterface';
import { ControllersModule } from '../controllers/ControllersModule';
import autoBind = require('auto-bind');
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';

@injectable()
export class TimeCampRouteConfig implements RouteConfigInterface {
  private timeCampController: TimeCampController;
  private rateLimitService: RateLimitServiceInterface;

  constructor(
    @inject(ControllersModule.TimeCampController)
    timeCampController: TimeCampController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.timeCampController = autoBind(timeCampController);
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      paths: {
        '/timer': {
          post: {
            action: this.timeCampController.timerAction,
            use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
          },
        },

        '/time-entries/:taskId': {
          get: {
            action: this.timeCampController.getTimeEntries,
            use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
          },
        },
        '/time-entries': {
          post: {
            action: this.timeCampController.createTimeEntryAction,
            use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
          },
        },

        '/token': {
          post: {
            action: this.timeCampController.hasTokenAction,
            use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.CREATE_FREQUENTLY)],
          },
        },
      },
    };
  }
}
