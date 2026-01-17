import { RouteConfigInterface } from './RouteConfigInterface';
import { RouteConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import AuthenticationController from '../controllers/AuthenticationController';
import { DeauthenticationController } from '../controllers/DeauthenticationController';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';

@injectable()
export class AuthenticationRouteConfig implements RouteConfigInterface {

  private authenticationController: AuthenticationController
  private deauthenticationController: DeauthenticationController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.AuthenticationController)
      authenticationController: AuthenticationController,
    @inject(ControllersModule.DeauthenticationController)
      notificationController: DeauthenticationController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.authenticationController = autoBind(authenticationController)
    this.deauthenticationController = autoBind(notificationController)
    this.rateLimitService = rateLimitService
  }

  getRouteConfig(): RouteConfig {
    return {
      '/authenticate': {
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.LOGIN)
        ],
        paths: {
          '/password': {
            post: this.authenticationController.loginWithPasswordAction
          },
          '/openId': {
            post: this.authenticationController.loginWithOpenIdAction
          },
          '/apple': {
            post: this.authenticationController.loginWithAppleAction,
          }
        }
      },
      '/deauthenticate': {
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.DEFAULT)
        ],
        post: this.deauthenticationController.deauthenticateAction,
      },
      '/register': {
        use: [
          this.rateLimitService.getLimiter(RateLimitRule.CREATE_ACCOUNT)
        ],
        post: this.authenticationController.redirectRegisterWithParams,
      },
    }
  }
}
