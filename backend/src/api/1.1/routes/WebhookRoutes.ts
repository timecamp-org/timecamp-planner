import { inject, injectable } from 'inversify';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { RouteConfigInterface } from './RouteConfigInterface';
import { ControllersModule } from '../controllers/ControllersModule';
import { WebhookController } from '../controllers/WebhookController';
import autoBind = require('auto-bind');
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class WebhookRouteConfig implements RouteConfigInterface {
  private webhookController: WebhookController;
  private rateLimitService: RateLimitServiceInterface;
  constructor(
    @inject(ControllersModule.WebhookController)
    webhookController: WebhookController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.webhookController = autoBind(webhookController);
    this.rateLimitService = autoBind(rateLimitService);
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.webhookController.createWebhookAction,
        use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
      },
      get: {
        action: this.webhookController.getWebhooksAction,
        use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
      },
      paths: {
        '/:webhookId': {
          get: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            action: this.webhookController.getWebhookAction,
          },
          patch: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
            action: this.webhookController.updateWebhookAction,
          },
          delete: {
            action: this.webhookController.deleteWebhookAction,
            use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
          },
        },
      },
    };
  }
}
