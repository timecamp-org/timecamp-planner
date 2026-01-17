import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { OAuth2ProviderController } from '../controllers/OAuth2ProviderController';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class OAuth2RouteConfig implements RouteConfigInterface {

  private oAuth2Controller: OAuth2ProviderController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.OAuth2ProviderController)
      oAuth2Controller: OAuth2ProviderController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.oAuth2Controller = autoBind(oAuth2Controller)
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [this.rateLimitService.getLimiter(RateLimitRule.DEFAULT)],
      paths: {
        '/token': {
          post: this.oAuth2Controller.getTokenAction
        },
        '/client': {
          paths: {
            '/:clientId': {
              get: this.oAuth2Controller.getClientInfoAction,
              paths: {
                '/regenerateSecret': {
                  patch: this.oAuth2Controller.regenerateSecret,
                }
              }
            }
          }
        },
        '/authorize': {
          post: this.oAuth2Controller.authorizeAction,
          use: [requireAuthenticatedMiddleware()]
        }
      }
    }
  }
}
