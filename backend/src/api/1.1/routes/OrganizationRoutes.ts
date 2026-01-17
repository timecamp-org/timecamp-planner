import { RouteConfigInterface } from './RouteConfigInterface';
import { PathConfig } from '../../../infrastructure/RouteLoader';
import { injectable, inject } from 'inversify';
import { ControllersModule } from '../controllers/ControllersModule';
import {
  PermissionMiddlewareHandler,
  PermissionType,
} from '../modules/permissions/types';
import requireAuthenticatedMiddleware from '../../../infrastructure/requireAuthenticatedMiddleware';
import { PermissionsModule } from '../modules/permissions/PermissionsModule';
import { OrganizationController } from '../controllers/OrganizationController';
import { ProjectController } from '../controllers/ProjectController';
import * as autoBind from 'auto-bind';
import { RateLimitServiceInterface } from '../modules/rateLimiter/interfaces/RateLimitServiceInterface';
import { RateLimitModule } from '../modules/rateLimiter/RateLimiterModule';
import { RateLimitRule } from '../modules/rateLimiter/types';

@injectable()
export class OrganizationRouteConfig implements RouteConfigInterface {
  constructor(
    @inject(ControllersModule.OrganizationController)
    private organizationController: OrganizationController,
    @inject(ControllersModule.ProjectController)
    private projectController: ProjectController,
    @inject(PermissionsModule.PermissionMiddleware)
    private requirePermission: PermissionMiddlewareHandler,
    @inject(RateLimitModule.RateLimitServiceInterface)
    private rateLimitService: RateLimitServiceInterface
  ) {
    this.organizationController = autoBind(organizationController);
    this.projectController = autoBind(projectController);
    this.requirePermission = requirePermission;
    this.rateLimitService = rateLimitService;
  }

  getPathConfig(): PathConfig {
    return {
      use: [requireAuthenticatedMiddleware()],
      post: {
        action: this.organizationController.createOrganizationAction,
        use: [this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY)],
      },
      paths: {
        '/:organizationId': {
          put: {
            action: this.organizationController.createOrganizationAction,
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
            ],
          },
          get: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
              this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
            ],
            action: this.organizationController.getOrganizationAction,
          },
          patch: {
            use: [
              this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
              this.requirePermission([PermissionType.UPDATE_ORGANIZATION]),
            ],
            action: this.organizationController.updateOrganizationAction,
          },

          paths: {
            '/tags': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
              ],
              action: this.organizationController.getTagsAction,
            },
            '/hideOldConversations': {
              post: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.UPDATE_RARELY),
                  this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
                ],
                action: this.organizationController.hideOldConversationsAction,
              },
            },
            '/projects': {
              get: {
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                  this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
                ],
                action: this.organizationController.getProjectsAction,
              },
              paths: {
                '/people': {
                  use: [
                    this.rateLimitService.getLimiter(
                      RateLimitRule.GET_FREQUENTLY
                    ),
                    this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
                  ],
                  get: this.organizationController
                    .getOrganizationProjectsPeopleAction,
                },
                '/unreadMessages': {
                  use: [
                    this.rateLimitService.getLimiter(
                      RateLimitRule.GET_FREQUENTLY
                    ),
                    this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
                  ],
                  get: this.organizationController
                    .getOrganizationProjectsHaveUnreadMessagesAction,
                },
                '/guests': {
                  use: [
                    this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                    this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
                  ],
                  action:
                    this.organizationController
                      .getOrganizationProjectsGuestInProject,
                },
              },
            },
            '/people': {
              use: [this.requirePermission([PermissionType.VIEW_ORGANIZATION])],
              get: {
                action: this.organizationController.getPeopleAction,
                use: [
                  this.rateLimitService.getLimiter(RateLimitRule.GET_RARELY),
                ],
              },
              paths: {
                '/:userId': {
                  put: {
                    action: this.organizationController.addPersonAction,
                    use: [
                      this.rateLimitService.getLimiter(
                        RateLimitRule.UPDATE_FREQUENTLY
                      ),
                    ],
                  },
                  paths: {
                    '/role': {
                      use: [
                        this.rateLimitService.getLimiter(
                          RateLimitRule.UPDATE_FREQUENTLY
                        ),
                        this.requirePermission([
                          PermissionType.UPDATE_ORGANIZATION_ROLE,
                        ]),
                      ],
                      patch: this.organizationController.updateUserRoleAction,
                    },
                    '/resendInvitation': {
                      use: [
                        this.rateLimitService.getLimiter(
                          RateLimitRule.UPDATE_RARELY
                        ),
                      ],
                      post: this.organizationController.resendInvitationAction,
                    },
                    '/generateInvitationLink': {
                      use: [
                        this.rateLimitService.getLimiter(
                          RateLimitRule.UPDATE_RARELY
                        ),
                      ],
                      get: this.organizationController
                        .generateInvitationLinkAction,
                    },
                    '/deleteGuestFromAllSpaces': {
                      use: [
                        this.rateLimitService.getLimiter(
                          RateLimitRule.UPDATE_FREQUENTLY
                        ),
                        this.requirePermission([
                          PermissionType.DELETE_GUEST_FROM_ALL_SPACES,
                        ]),
                      ],
                      delete:
                        this.organizationController.deleteGuestFromAllSpaces,
                    },
                  },
                },
                '/inviteGuests': {
                  use: [
                    this.rateLimitService.getLimiter(
                      RateLimitRule.CREATE_RARELY
                    ),
                  ],
                  post: this.organizationController
                    .inviteGuestsToOrganizationAndSpaces,
                },
              },
            },

            '/people/deactivate/:userId': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.UPDATE_FREQUENTLY
                ),
                this.requirePermission([
                  PermissionType.DEACTIVATE_USER_FROM_ORGANIZATION,
                ]),
              ],
              patch: this.organizationController.deactivateUserFromOrganization,
            },

            '/people/reactivate/:userId': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.UPDATE_FREQUENTLY
                ),
                this.requirePermission([
                  PermissionType.REACTIVATE_USER_FROM_ORGANIZATION,
                ]),
              ],
              patch: this.organizationController.reactivateUserFromOrganization,
            },

            '/conversations/:projectId/people/:userId': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.UPDATE_FREQUENTLY
                ),
                this.requirePermission([PermissionType.UPDATE_PROJECT_PEOPLE]),
              ],
              put: this.organizationController
                .addPersonAndCreateConversationAction,
            },
            '/conversations/people': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.UPDATE_FREQUENTLY
                ),
              ],
              put: this.organizationController
                .addPeopleAndCreateConversationsAction,
            },

            '/conversations/settings': {
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
                this.requirePermission([PermissionType.VIEW_ORGANIZATION]),
              ],
              get: this.organizationController
                .getUserOrganizationConversationsSettings,
            },

            '/conversationByHash/:conversationHash/settings': {
              use: [
                this.rateLimitService.getLimiter(
                  RateLimitRule.UPDATE_FREQUENTLY
                ),
              ],
              put: this.projectController.updateConversationSettings,
            },

            '/workspace': {
              put: this.organizationController.createWorkspace,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.CREATE_RARELY),
              ],
            },
            '/archivedProjectsViewData': {
              get: this.projectController.getArchivedProjectsViewData,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              ],
            },
            '/schedule': {
              get: this.organizationController.getOrganizationSchedule,
              use: [
                this.rateLimitService.getLimiter(RateLimitRule.GET_FREQUENTLY),
              ],
            },
            '/groups': {
              get: {
                action: this.organizationController.getOrganizationGroupsAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.GET_FREQUENTLY
                  ),
                ],
              },
            },
            '/groups/people': {
              get: {
                action:
                  this.organizationController.getOrganizationGroupsPeopleAction,
                use: [
                  this.rateLimitService.getLimiter(
                    RateLimitRule.GET_FREQUENTLY
                  ),
                ],
              },
            },
          },
        },
      },
    };
  }
}
