import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { OAuth1ClientController } from '../controllers/OAuth1ClientController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class OAuth1RouteConfig implements RouteConfigInterface {

  private oAuth1Controller: OAuth1ClientController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.OAuth1ClientController)
      oAuth1Controller: OAuth1ClientController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface
  ) {
    this.oAuth1Controller = autoBind(oAuth1Controller)
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      use: [this.rateLimitService.getLimiter(RateLimitRule.DEFAULT)],
      paths: {
        '/authorizeUrl/:applicationName': this.oAuth1Controller.getAuthorizeUrlAction,
        '/authorize/:applicationName': {
          post: this.oAuth1Controller.authorizeAction
        },
        '/deauthorize/:applicationName': {
          post: this.oAuth1Controller.deauthorizeAction
        },
        '/authorizedApplications': this.oAuth1Controller.getAuthorizedApplicationsAction,
      }
    }
  }
}
