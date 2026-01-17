import { inject, injectable } from 'inversify';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { ControllersModule } from '../controllers/ControllersModule';
import { TemplateController } from '../controllers/TemplateController';
import { RouteConfigInterface } from './RouteConfigInterface';
import autoBind = require('auto-bind');
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class TemplateRouteConfig implements RouteConfigInterface {
  private templateController: TemplateController;
  private rateLimitService: RateLimitServiceInterface;
  constructor(
    @inject(ControllersModule.TemplateController)
    templateController: TemplateController,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.templateController = autoBind(templateController);
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      paths: {
        '/:entityType': {
          post: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
            action: this.templateController.createEntityTemplateAction,
          },
          get: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            action: this.templateController.getEntityTypeTemplatesAction,
          },
        },

        '/:entityType/:templateId': {
          get: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            action: this.templateController.getEntityTypeTemplateAction,
          },
          patch: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
            action: this.templateController.updateEntityTemplateAction,
          },
          delete: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
            action: this.templateController.deleteEntityTemplate,
          },
          post: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
            action: this.templateController.createEntityFromTemplateAction,
          },
        },
      },
    };
  }
}
