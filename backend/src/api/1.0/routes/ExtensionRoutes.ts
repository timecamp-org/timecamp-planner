import { RouteConfigInterface } from './RouteConfigInterface';
import { RouteConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import { PermissionType, PermissionMiddlewareHandler } from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import * as autoBind from 'auto-bind'
import { CustomFieldController } from '../controllers/CustomFieldController';
import { ExtensionController } from '../controllers/ExtensionController';
import { IntegrationController } from '../controllers/IntegrationController';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class ExtensionRouteConfig implements RouteConfigInterface {

  private customFieldController: CustomFieldController
  private extensionController: ExtensionController
  private integrationController: IntegrationController
  private requirePermission: PermissionMiddlewareHandler
  private rateLimitService: RateLimitServiceInterface

  constructor(
    @inject(ControllersModule.CustomFieldController)
      customFieldController: CustomFieldController,
    @inject(ControllersModule.ExtensionController)
      extensionController: ExtensionController,
    @inject(ControllersModule.IntegrationController)
      integrationController: IntegrationController,
    @inject(PermissionsModule.PermissionMiddleware)
      requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
      rateLimitService: RateLimitServiceInterface,
  ) {
    this.customFieldController = autoBind(customFieldController)
    this.extensionController = autoBind(extensionController)
    this.integrationController = autoBind(integrationController)
    this.requirePermission = requirePermission
    this.rateLimitService = rateLimitService
  }

  getRouteConfig(): RouteConfig {
    return {
      '/extension': {
        use: [requireAuthenticatedMiddleware()],
        paths: {
          '/:namespace': {
            paths: {
              '/:targetType/:targetId/relationData': {
                use: [
                  this.requirePermission([PermissionType.VIEW_CUSTOM_FIELD]),
                ],
                get: {
                  action: this.customFieldController.getExtensionRelationAction,
                  use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
                }
              },
              '/:relation': {
                use: [
                  this.requirePermission([PermissionType.UPDATE_EXTENSION_RELATION])
                ],
                patch: {
                  action: this.customFieldController.updateExtensionRelationAction,
                  use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
                },
                delete: {
                  action: this.customFieldController.deleteExtensionRelationAction,
                  use: [this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY)],
                },
              },
            },
          },
        },
      },
      '/customFields': {
        use: [requireAuthenticatedMiddleware()],
        paths: {
          '/:targetType/:targetId': {
            patch: {
              action: this.customFieldController.updateCustomFieldsAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                this.requirePermission([PermissionType.UPDATE_CUSTOM_FIELD])
              ]
            },
            get: {
              action: this.customFieldController.getCustomFieldsAction,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                this.requirePermission([PermissionType.VIEW_CUSTOM_FIELD]),
              ]
            }
          }
        }
      },
      '/organizations/:organizationId': {
        paths: {
          '/extensions': {
            use: [this.requirePermission([PermissionType.VIEW_ORGANIZATION])],
            get: {
              action: this.extensionController.getWorkspaceExtensions,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
            },
            paths: {
              '/:extensionId': {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_EXTENSION_STATUS])
                ],
                patch: this.extensionController.updateExtensionStatusInWorkspace,
              },
            },
          },
          '/integrations': {
            get: {
              action: this.integrationController.getIntegrationsAction,
              use: [this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY)],
            },
            use: [this.requirePermission([PermissionType.VIEW_ORGANIZATION])],
            paths: {
              '/confirm': {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_INTEGRATION_STATUS])
                ],
                patch: this.integrationController.confirmIntegrationsStatusAction,
              },
              '/:extensionId': {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
                  this.requirePermission([PermissionType.UPDATE_EXTENSION_STATUS])
                ],
                post: this.integrationController.runAction,
              },
            },
          },
        }
      },
    }
  }
}
