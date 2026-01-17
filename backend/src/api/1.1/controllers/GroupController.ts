import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import logger, { LoggerInterface } from '../../../infrastructure/logger';
import { inject, injectable } from 'inversify';
import { GroupsModule } from '../modules/groups/GroupsModule';
import { OrganizationGroupsServiceInterface } from '../modules/groups/interfaces/OrganizationGroupsServiceInterface';
import {
  AddUserToGroupStatus,
  CreateGroupStatus,
  DeleteGroupStatus,
  RemoveUserFromGroupStatus,
  UpdateGroupStatus,
} from '../modules/groups/types';
import { HttpStatus } from '../../../infrastructure/enum';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

@injectable()
export class GroupController {
  constructor(
    @inject(GroupsModule.OrganizationGroupsServiceInterface)
    private organizationGroupsService: OrganizationGroupsServiceInterface,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface
  ) {}

  async createOrganizationGroupAction(req: Request, res: Response) {
    try {
      const { name, slug, organizationId } = req.body;

      const result = await this.organizationGroupsService.createGroup(
        organizationId,
        name,
        slug
      );

      switch (result.status) {
        case CreateGroupStatus.OK:
          return res.status(HttpStatus.OK).send(result.group);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteOrganizationGroupAction(req: Request, res: Response) {
    try {
      const { groupId } = req.params;

      const result = await this.organizationGroupsService.deleteGroup(groupId);

      switch (result.status) {
        case DeleteGroupStatus.OK:
          return res.status(HttpStatus.OK).send();
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateOrganizationGroupAction(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { name, slug } = req.body;

      const result = await this.organizationGroupsService.updateGroup(
        groupId,
        name,
        slug
      );

      switch (result.status) {
        case UpdateGroupStatus.OK:
          return res.status(HttpStatus.OK).send(result.group);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addUserToGroupAction(req: Request, res: Response) {
    try {
      const { groupId, userId } = req.params;

      const result = await this.organizationGroupsService.addUserToGroup(
        groupId,
        userId
      );
      switch (result.status) {
        case AddUserToGroupStatus.OK:
          return res.status(HttpStatus.OK).send();
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async removeUserFromGroupAction(req: Request, res: Response) {
    try {
      const { groupId, userId } = req.params;

      const result = await this.organizationGroupsService.removeUserFromGroup(
        groupId,
        userId
      );
      switch (result.status) {
        case RemoveUserFromGroupStatus.OK:
          return res.status(HttpStatus.OK).send();
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getGroupUserIdsAction(req: Request, res: Response) {
    try {
      const { groupId } = req.params;

      const result = await this.organizationGroupsService.getGroupUserIds(
        groupId
      );

      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
