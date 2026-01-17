import { inject, injectable } from 'inversify';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { ControllersModule } from '../controllers/ControllersModule';
import { SearchController } from '../controllers/SearchController';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { PermissionMiddlewareHandler } from '../modules/permissions/types';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';
import { RouteConfigInterface } from './RouteConfigInterface';
import autoBind = require('auto-bind');

@injectable()
export class SearchRoutesConfig implements RouteConfigInterface {
  private searchController: SearchController;
  private rateLimitService: RateLimitServiceInterface;
  constructor(
    @inject(ControllersModule.SearchController)
    searchController: SearchController,
    @inject(PermissionsModule.PermissionMiddleware)
    requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    rateLimitService: RateLimitServiceInterface
  ) {
    this.searchController = autoBind(searchController);
    this.rateLimitService = rateLimitService;
  }
  getPathConfig(): PathConfig {
    return {
      paths: {
        '/:organizationId': {
          get: {
            use: [this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY)],
            action: this.searchController.searchAction,
          },
        },
      },
    };
  }
}
