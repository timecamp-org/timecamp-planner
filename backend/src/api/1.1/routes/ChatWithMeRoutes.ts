import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import * as autoBind from 'auto-bind'
import { ChatWithMeController } from '../controllers/ChatWithMeController';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class ChatWithMeRouteConfig implements RouteConfigInterface {

  private chatWithMeController: ChatWithMeController
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.ChatWithMeController)
      chatWithMeController: ChatWithMeController,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.chatWithMeController = autoBind(chatWithMeController)
    this.rateLimitService = rateLimitService
  }


  getPathConfig(): PathConfig {
    return {
      paths: {
        '/join/:token': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
          post: this.chatWithMeController.joinOrganizationAsGuestAndCreateSpace,
        },
        '/data/:token': {
          use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
          get: this.chatWithMeController.getBasicInvitationData,
        },
      }
    }
  }
}
