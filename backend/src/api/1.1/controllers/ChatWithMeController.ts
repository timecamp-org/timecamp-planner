import { Request, Response } from 'express'

import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import logger from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import { ChatWithMeModule } from '../modules/chatWithMe/ChatWithMeModule';
import { ChatWithMeServiceInterface } from '../modules/chatWithMe/interfaces/ChatWithMeServiceInterface';
import { 
  JoinOrganizationAsGuestAndCreateSpaceStatus, 
  GetBasicInvitationDataStatus,
} from '../modules/chatWithMe/types';
import { getFirstAcceptedLanguage } from '../../../infrastructure/utils';

@injectable()
export class ChatWithMeController {

  protected chatWithMeService: ChatWithMeServiceInterface;

  constructor(
    @inject(ChatWithMeModule.ChatWithMeServiceInterface)
      chatWithMeService: ChatWithMeServiceInterface,
  ) {
    this.chatWithMeService = chatWithMeService
  }

  async joinOrganizationAsGuestAndCreateSpace(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId;
      const { token } = req.params
      const userLanguage = getFirstAcceptedLanguage(req)

      const result = await this.chatWithMeService.joinOrganizationAsGuestAndCreateSpace(currentUserId, token, userLanguage)

      switch (result.status) {
        case JoinOrganizationAsGuestAndCreateSpaceStatus.OK:
          return res.send(result)
        case JoinOrganizationAsGuestAndCreateSpaceStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.EMAIL_TAKEN:
          return res.send(ErrorDefinitions[Type.EMAIL_ALREADY_IN_USE])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.PROJECT_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.PROJECT_ALREADY_EXISTS])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.INVALID_INVITER_ROLE:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.ORGANIZATION_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_ALREADY_EXISTS])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.USER_ALREADY_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_PROJECT])
        case JoinOrganizationAsGuestAndCreateSpaceStatus.NOT_PERMITTED:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async getBasicInvitationData(req: Request, res: Response) {
    try {
      const { token } = req.params

      const result = await this.chatWithMeService.getBasicInvitationData(token)

      switch (result.status) {
        case GetBasicInvitationDataStatus.OK:
          return res.send(result)

        case GetBasicInvitationDataStatus.NOT_PERMITTED:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED])

        case GetBasicInvitationDataStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])

        case GetBasicInvitationDataStatus.USER_IN_ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_IN_ORGANIZATION_NOT_FOUND])

        case GetBasicInvitationDataStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND])

        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
