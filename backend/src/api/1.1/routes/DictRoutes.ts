import autoBind = require('auto-bind');
import { inject, injectable } from 'inversify';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { ControllersModule } from '../controllers/ControllersModule';
import { DictController } from '../controllers/DictController';
import { RouteConfigInterface } from './RouteConfigInterface';

import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class DictRoutesConfig implements RouteConfigInterface {
  constructor(
    @inject(ControllersModule.DictController)
    private dictController: DictController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface
  ) {
    this.dictController = autoBind(dictController);
  }
  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware(), this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
      paths: {
        '/names': {
          get: {
            use: [],
            action: this.dictController.getDictionaryNamesAction,
          },
        },
        '/:name': {
          get: {
            use: [],
            action: this.dictController.getDictionaryAction,
          },
        },
      },
    };
  }
}
