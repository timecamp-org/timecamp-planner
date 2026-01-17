import { Request, Response } from 'express'

import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import logger from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import {
  CreateUserAppStatus,
  UpdateUserAppStatus,
  GetUserAppsStatus,
  DeleteUserAppStatus,
  AddUserAppMemberStatus,
  RemoveUserAppMemberStatus,
  InviteUserAppMemberStatus
} from '../modules/userApps/types';
import { CommonModule } from '../modules/common/CommonModule';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';
import { UserAppsModule } from '../modules/userApps/UserAppsModule';
import { UserAppsServiceInterface } from '../modules/userApps/interfaces/UserAppsServiceInterface';

@injectable()
export class UserAppsController {


  constructor(
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(UserAppsModule.UserAppsServiceInterface)
    private userAppsService: UserAppsServiceInterface,
  ) { }

  async createAppAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;

      const appId = req.params.appId || this.idGenerator.generateId()

      const result = await this.userAppsService.createApp(currentUserId, appId, req.body)

      switch (result.status) {
        case CreateUserAppStatus.OK:
          return res.send(result.app)
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      logger(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async updateAppAction(req: Request, res: Response) {
    try {
      const { appId } = req.params
      const result = await this.userAppsService.updateApp(appId, req.body)

      switch (result.status) {
        case UpdateUserAppStatus.OK:
          return res.send(result.app)
        case UpdateUserAppStatus.APP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      logger(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async deleteAppAction(req: Request, res: Response) {
    try {
      const { appId } = req.params
      const result = await this.userAppsService.deleteApp(appId)

      switch (result.status) {
        case DeleteUserAppStatus.OK:
          return res.send()
        case DeleteUserAppStatus.APP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      logger(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async getUserAppsAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const result = await this.userAppsService.getUserApps(currentUserId)

      switch (result.status) {
        case GetUserAppsStatus.OK:
          return res.send(result)
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addAppMemberAction(req: Request, res: Response) {
    try {
      const { appId, userId } = req.params
      const { role } = req.body
      const result = await this.userAppsService.addAppMember(appId, userId, role)

      switch (result.status) {
        case AddUserAppMemberStatus.OK:
          return res.send()
        case AddUserAppMemberStatus.APP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        case AddUserAppMemberStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async removeAppMemberAction(req: Request, res: Response) {
    try {
      const { appId, userId } = req.params
      const result = await this.userAppsService.removeAppMember(appId, userId)

      switch (result.status) {
        case RemoveUserAppMemberStatus.OK:
          return res.send()
        case RemoveUserAppMemberStatus.APP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        case RemoveUserAppMemberStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async inviteAppMemberAction(req: Request, res: Response) {
    try {
      const { appId } = req.params
      const { role, email } = req.body
      const result = await this.userAppsService.inviteAppMember(appId, email, role)

      switch (result.status) {
        case InviteUserAppMemberStatus.OK:
          return res.send(result)
        case InviteUserAppMemberStatus.APP_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        case InviteUserAppMemberStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
