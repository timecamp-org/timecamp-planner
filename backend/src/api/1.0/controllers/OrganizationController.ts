import { Request, Response } from 'express';
import {
  CreateOrganizationResultStatus,
  GetOrganizationResultStatus,
  InviteUserToOrganizationAndCreateConversationResultStatus,
  InviteUserToOrganizationResultStatus,
  UpdateOrganizationResultStatus,
  UserPayload,
  DeactivateUserFromWorkspaceStatus,
  ReactivateUserFromWorkspaceStatus,
  UpdateUserRoleStatus,
  ResendInvitationToOrganizationStatus,
  GenerateInvitationLinkStatus,
  GetOrganizationUserProjectsWithMetadataStatus,
  OrganizationProjectsQueryParams,
} from '../modules/organizations/types';

import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { LoggerInterface } from '../../../infrastructure/logger';
import { CreateWorkspaceResultStatus } from '../modules/organizations/types';
import { GetOrganizationTagsResultStatus } from '../modules/tags/types';
import { DeleteGuestFromAllSpacesStatus } from '../modules/projects/types';
import { Id, IdGeneratorInterface } from '../modules/common/identifier';
import { OrganizationsModule } from '../modules/organizations/OrganizationsModule';
import { OrganizationServiceInterface } from '../modules/organizations/interfaces/OrganizationServiceInterface';
import { inject, injectable } from 'inversify';
import { TagsModule } from '../modules/tags/TagsModule';
import { TagServiceInterface } from '../modules/tags/TagServiceInterface';
import { InvitationServiceInterface } from '../modules/organizations/interfaces/InvitationServiceInterface';
import { WorkspaceServiceInterface } from '../modules/organizations/interfaces/WorkspaceServiceInterface';
import { ProjectsModule } from '../modules/projects/ProjectsModule';
import { ProjectPeopleServiceInterface } from '../modules/projects/interfaces/ProjectPeopleServiceInterface';
import { UserInOrganizationServiceInterface } from '../modules/organizations/interfaces/UserInOrganizationServiceInterface';
import { getFirstAcceptedLanguage } from '../../../infrastructure/utils';
import { CommonModule } from '../modules/common/CommonModule';
import { OrganizationProjectsServiceInterface } from '../modules/organizations/interfaces/OrganizationProjectsServiceInterface';
import { conversationSettingsQueryModifier } from '../modules/internal/queryDecorators';
import { HttpStatus } from '../../../infrastructure/enum';
import { ProjectServiceInterface } from '../modules/projects/interfaces/ProjectServiceInterface';
import { ConversationServiceInterface } from '../modules/projects/interfaces/ConversationServiceInterface';
import { GuestInProjectProviderInterface } from '../modules/projects/interfaces/GuestInProjectProviderInterface';
import { OrganizationPeopleResource } from '../modules/organizations/resources/OrganizationPeopleResource';
import { EntityStatus } from '../modules/common/enum';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

@injectable()
export class OrganizationController {
  constructor(
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(TagsModule.TagServiceInterface)
    private tagService: TagServiceInterface,
    @inject(OrganizationsModule.InvitationServiceInterface)
    private invitationService: InvitationServiceInterface,
    @inject(OrganizationsModule.WorkspaceServiceInterface)
    private workspaceService: WorkspaceServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(OrganizationsModule.OrganizationProjectsServiceInterface)
    private organizationProjectsService: OrganizationProjectsServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(ProjectsModule.GuestInProjectProviderInterface)
    private guestInProjectProvider: GuestInProjectProviderInterface,
    @inject(OrganizationsModule.OrganizationPeopleResource)
    private organizationPeopleResource: OrganizationPeopleResource,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface
  ) {}

  async createOrganizationAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const organizationId = req.params.organizationId || this.idGenerator.generateId();
      const result = await this.organizationService.createOrganization(userId, req.body, organizationId);

      switch (result.status) {
        case CreateOrganizationResultStatus.ORGANIZATION_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_ALREADY_EXISTS]);
        case CreateOrganizationResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(result.organization);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationAction(req: Request, res: Response) {
    try {
      const result = await this.organizationService.getOrganization(req.params.organizationId);

      switch (result.status) {
        case GetOrganizationResultStatus.OK:
          return res.send(result.organization);
        case GetOrganizationResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateOrganizationAction(req: Request, res: Response) {
    try {
      const result = await this.organizationService.updateOrganization(req.body, req.params.organizationId);

      switch (result.status) {
        case UpdateOrganizationResultStatus.OK:
          return res.send();
        case UpdateOrganizationResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getTagsAction(req: Request, res: Response) {
    try {
      const result = await this.tagService.getOrganizationTags(req.params.organizationId);

      switch (result.status) {
        case GetOrganizationTagsResultStatus.OK:
          return res.send(result.organizationTags);
        case GetOrganizationTagsResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getProjectsAction(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const currentUserId = req.heyspace.authResult.userId;
      const queryParams = req.query;

      const result = await this.organizationProjectsService.getUserOrganizationProjectsWithMetadata(
        organizationId,
        currentUserId,
        queryParams as unknown as OrganizationProjectsQueryParams
      );

      switch (result.status) {
        case GetOrganizationUserProjectsWithMetadataStatus.OK:
          return res.send(result.data);
        case GetOrganizationUserProjectsWithMetadataStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case GetOrganizationUserProjectsWithMetadataStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getPeopleAction(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const { userId } = req.heyspace.authResult;
      const result = await this.organizationPeopleResource.getData(req.query, {
        organizationId,
        userId,
      });
      res.send(result);
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addPersonAction(req: Request, res: Response) {
    try {
      const result = await this.organizationService.inviteUserToOrganization(
        req.heyspace.authResult.userId,
        req.params.organizationId,
        req.body.email,
        req.params.userId
      );

      switch (result.status) {
        case InviteUserToOrganizationResultStatus.OK:
        case InviteUserToOrganizationResultStatus.USER_REACTIVATED:
          return res.send(result.user);
        case InviteUserToOrganizationResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case InviteUserToOrganizationResultStatus.USER_ALREADY_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_ORGANIZATION]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addPeopleAndCreateConversationsAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;

      const users: UserPayload[] = req.body.users;

      const inviteUsersPromises = users.map(
        async (user) =>
          await this.invitationService.inviteUserToOrganizationAndCreateConversation(
            req.params.organizationId,
            user.projectId,
            currentUserId,
            user.email,
            user.userId
          )
      );

      const inviteUsersStatuses = await Promise.all(inviteUsersPromises);
      res.send(inviteUsersStatuses);
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addPersonAndCreateConversationAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;

      const result = await this.invitationService.inviteUserToOrganizationAndCreateConversation(
        req.params.organizationId,
        req.params.projectId,
        currentUserId,
        req.body.email,
        req.params.userId
      );

      switch (result.status) {
        case InviteUserToOrganizationAndCreateConversationResultStatus.OK:
          return res.send(result.user);
        case InviteUserToOrganizationAndCreateConversationResultStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case InviteUserToOrganizationAndCreateConversationResultStatus.USER_ALREADY_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_ORGANIZATION]);
        case InviteUserToOrganizationAndCreateConversationResultStatus.PROJECT_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.PROJECT_ALREADY_EXISTS]);
        case InviteUserToOrganizationAndCreateConversationResultStatus.USER_ALREADY_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_PROJECT]);
        case InviteUserToOrganizationAndCreateConversationResultStatus.INVITER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.INVITER_NOT_FOUND]);
        case InviteUserToOrganizationAndCreateConversationResultStatus.INVITED_USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.INVITED_USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async inviteGuestsToOrganizationAndSpaces(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      this.logger.info(`Inviter IP: ${req.clientIp}`);

      const guestEmails: string[] = req.body.guestMails ? req.body.guestMails : req.body.guests;
      const projectIds: Id[] = req.body.projectIds;

      const { organization } = await this.organizationService.getOrganization(req.params.organizationId);
      if (!organization || organization.status !== EntityStatus.EXISTS) {
        return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
      }

      const inviteGuestsPromises = guestEmails.map(
        async (guestEmail) =>
          await this.invitationService.inviteGuestToOrganization(
            req.params.organizationId,
            projectIds,
            currentUserId,
            guestEmail
          )
      );

      const inviteGuestsStatuses = await Promise.all(inviteGuestsPromises);
      res.send(inviteGuestsStatuses);
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async resendInvitationAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;

      const result = await this.invitationService.resentInvitationToOrganization(
        req.params.organizationId,
        currentUserId,
        req.params.userId
      );

      switch (result.status) {
        case ResendInvitationToOrganizationStatus.OK:
          return res.send();
        case ResendInvitationToOrganizationStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case ResendInvitationToOrganizationStatus.INVITER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.INVITER_NOT_FOUND]);
        case ResendInvitationToOrganizationStatus.INVITED_USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.INVITED_USER_NOT_FOUND]);
        case ResendInvitationToOrganizationStatus.TOO_MANY_REQUESTS:
          return res.send(ErrorDefinitions[Type.TOO_MANY_REQUESTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async generateInvitationLinkAction(req: Request, res: Response) {
    try {
      const result = await this.organizationService.generateInvitationLink(req.params.userId);

      switch (result.status) {
        case GenerateInvitationLinkStatus.OK:
          return res.send(result.invitationLink);
        case GenerateInvitationLinkStatus.INVITED_USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.INVITED_USER_NOT_FOUND]);
        case GenerateInvitationLinkStatus.USER_ALREADY_REGISTERED:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createWorkspace(req: Request, res: Response) {
    try {
      const organizationJson = req.body;
      const { organizationId } = req.params;
      const userId = req.heyspace.authResult.userId;
      const userLanguage = getFirstAcceptedLanguage(req);

      const result = await this.workspaceService.createWorkspace(
        userId,
        organizationId,
        organizationJson,
        userLanguage
      );

      switch (result.status) {
        case CreateWorkspaceResultStatus.OK:
          return res.send(result);
        case CreateWorkspaceResultStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case CreateWorkspaceResultStatus.ORGANIZATION_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_ALREADY_EXISTS]);
        case CreateWorkspaceResultStatus.PROJECT_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.PROJECT_ALREADY_EXISTS]);
        case CreateWorkspaceResultStatus.USER_ALREADY_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_PROJECT]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deactivateUserFromOrganization(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const userId = req.params.userId;
      const organizationId = req.params.organizationId;

      const result = await this.userInOrganizationService.deactivateUserFromWorkspace(
        currentUserId,
        userId,
        organizationId
      );

      switch (result.status) {
        case DeactivateUserFromWorkspaceStatus.OK:
          return res.send();
        case DeactivateUserFromWorkspaceStatus.FORBIDDEN:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED]);
        case DeactivateUserFromWorkspaceStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async reactivateUserFromOrganization(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const userId = req.params.userId;
      const organizationId = req.params.organizationId;

      const result = await this.userInOrganizationService.reactivateUserFromWorkspace(
        currentUserId,
        userId,
        organizationId
      );

      switch (result.status) {
        case ReactivateUserFromWorkspaceStatus.OK:
          return res.send();
        case ReactivateUserFromWorkspaceStatus.FORBIDDEN:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED]);
        case ReactivateUserFromWorkspaceStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateUserRoleAction(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.params;
      const result = await this.userInOrganizationService.updateUserRole(userId, organizationId, req.body.role);

      switch (result.status) {
        case UpdateUserRoleStatus.OK:
          return res.send();
        case UpdateUserRoleStatus.USER_IN_ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        case UpdateUserRoleStatus.ACCOUNT_DELETED:
          return res.send(ErrorDefinitions[Type.ACCOUNT_DELETED]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteGuestFromAllSpaces(req: Request, res: Response) {
    try {
      const { userId, organizationId } = req.params;
      const currentUserId = req.heyspace.authResult.userId;
      const result = await this.projectPeopleService.deleteGuestFromAllSpaces(currentUserId, userId, organizationId);

      switch (result.status) {
        case DeleteGuestFromAllSpacesStatus.OK:
          return res.send();
        case DeleteGuestFromAllSpacesStatus.FORBIDDEN:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED]);
        case DeleteGuestFromAllSpacesStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case DeleteGuestFromAllSpacesStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationProjectsPeopleAction(req: Request, res: Response) {
    try {
      const projectsPeople = await this.projectPeopleService.getOrganizationProjectsPeopleForUser(
        req.params.organizationId,
        req.heyspace.authResult.userId
      );

      return res.send(projectsPeople);
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationProjectsHaveUnreadMessagesAction(req: Request, res: Response) {
    try {
      const projectIdsWithUnreadMessages = await this.projectService.getProjectIdsInOrganizationWithUnreadMessages(
        req.params.organizationId,
        req.heyspace.authResult.userId
      );

      return res.send(projectIdsWithUnreadMessages);
    } catch (error) {
      this.logger.error(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getUserOrganizationConversationsSettings(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const { userId } = req.heyspace.authResult;

      const conversationSettings = await this.conversationService.getUserConversationsSettings(
        userId,
        organizationId,
        conversationSettingsQueryModifier
      );

      res.status(HttpStatus.OK).send(conversationSettings);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getOrganizationProjectsGuestInProject(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const organizationProjectsGuestInProject =
        await this.guestInProjectProvider.getOrganizationProjectsGuestInProject(organizationId);

      res.status(HttpStatus.OK).send(organizationProjectsGuestInProject);
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
