import { LoggerInterface } from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { UserStatusServiceInterface } from '../modules/userStatus/interfaces/UserStatusServiceInterface';
import { UserStatusModule } from '../modules/userStatus/UserStatusModule';
import { GetOrganizationUserStatusesStatus, SetUserStatusStatus, DeleteUserStatusStatus } from '../modules/userStatus/types';

@injectable()
export class UserStatusController {
  protected logger: LoggerInterface;
  protected userStatusService: UserStatusServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(UserStatusModule.UserStatusServiceInterface)
      userStatusService: UserStatusServiceInterface,
  ) {
    this.logger = logger
    this.userStatusService = userStatusService
  }

  public async getOrganizationUserStatuses(req: Request, res: Response) {
    try {
      const { organizationId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.userStatusService.getOrganizationUserStatuses(userId, organizationId);
      
      switch(result.status) {
        case GetOrganizationUserStatusesStatus.OK:
          return res.send(result.userStatuses)
        case GetOrganizationUserStatusesStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND])
        case GetOrganizationUserStatusesStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }


  public async setUserStatus(req: Request, res: Response) {
    try {
      const { organizationId } = req.params
      const { title, emojiCode, resetAt } = req.body
      const userId = req.heyspace.authResult.userId
      const result = await this.userStatusService.setUserStatus({ 
        userId,
        organizationId,
        title,
        emojiCode,
        resetAt,
      });
      
      switch(result.status) {
        case SetUserStatusStatus.OK:
          return res.send(result.userStatus)
        case SetUserStatusStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND])
        case SetUserStatusStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }


  public async deleteUserStatus(req: Request, res: Response) {
    try {
      const { organizationId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.userStatusService.deleteUserStatus(userId, organizationId);
      
      switch(result.status) {
        case DeleteUserStatusStatus.OK:
          return res.send()
        case DeleteUserStatusStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND])
        case DeleteUserStatusStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        case DeleteUserStatusStatus.STATUS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}
