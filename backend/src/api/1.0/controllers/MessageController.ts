import { Request, Response } from 'express';

import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { pick } from 'lodash';
import {
  CreateMessageStatus,
  UpdateMessageStatus,
  AddReactionStatus,
  DeleteMessageStatus,
  GetContainerMessagesStatus,
  UpdateMessageMetadataStatus,
  DeleteReactionStatus,
  GetMetadataStatus,
} from '../modules/messages/types';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';
import { injectable, inject } from 'inversify';
import { MessagesModule } from '../modules/messages/MessagesModule';
import { MessageServiceInterface } from '../modules/messages/interfaces/MessageServiceInterface';
import { CommonModule } from '../modules/common/CommonModule';

@injectable()
export class MessageController {
  constructor(
    @inject(MessagesModule.MessageServiceInterface)
    private messageService: MessageServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  async createMessageAction(req: Request, res: Response) {
    try {
      const messageId = req.params.messageId || this.idGenerator.generateId();
      const messageCreateResult = await this.messageService.createMessage(
        messageId,
        req.heyspace.authResult.userId,
        req.body
      );

      switch (messageCreateResult.status) {
        case CreateMessageStatus.OK:
          return res.send(messageCreateResult.message);
        case CreateMessageStatus.MESSAGE_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.MESSAGE_ALREADY_EXISTS]);
        case CreateMessageStatus.CONTAINER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CONTAINER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateMessageAction(req: Request, res: Response) {
    try {
      const messageUpdateResult = await this.messageService.updateMessage(
        req.params.messageId,
        req.heyspace.authResult.userId,
        req.body
      );

      switch (messageUpdateResult.status) {
        case UpdateMessageStatus.OK:
          return res.send();
        case UpdateMessageStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteMessageAction(req: Request, res: Response) {
    try {
      const messageDeleteResult = await this.messageService.deleteMessage(req.params.messageId);

      switch (messageDeleteResult.status) {
        case DeleteMessageStatus.OK:
          return res.send();
        case DeleteMessageStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async addReactionAction(req: Request, res: Response) {
    try {
      const { reactionId, messageId } = req.params;
      const reactionAddResult = await this.messageService.addReaction(
        messageId,
        req.heyspace.authResult.userId,
        reactionId || this.idGenerator.generateId(),
        req.body
      );

      switch (reactionAddResult.status) {
        case AddReactionStatus.OK:
          return res.send(reactionAddResult.reaction);
        case AddReactionStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        case AddReactionStatus.REACTION_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.REACTION_ALREADY_EXISTS]);
        case AddReactionStatus.REACTION_FOR_USER_EXISTS:
          return res.send(ErrorDefinitions[Type.REACTION_FOR_USER_EXISTS]);
        default:
          throw 'ResultStatus not implemented';
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteReactionAction(req: Request, res: Response) {
    try {
      const reactionDeleteResult = await this.messageService.deleteReaction(
        req.heyspace.authResult.userId,
        req.params.reactionId
      );

      switch (reactionDeleteResult.status) {
        case DeleteReactionStatus.OK:
          return res.send();
        case DeleteReactionStatus.REACTION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.REACTION_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getContainerMessagesAction(req: Request, res: Response) {
    try {
      const result = await this.messageService.getContainerMessages(
        req.params.containerType,
        req.params.containerId,
        req.query.page,
        parseInt(req.query.limit as string)
      );

      switch (result.status) {
        case GetContainerMessagesStatus.OK:
          return res.send(result);
        case GetContainerMessagesStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case GetContainerMessagesStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateMessageReadAction(req: Request, res: Response) {
    try {
      const result = await this.messageService.updateMessageRead(
        req.params.containerType,
        req.params.containerId,
        req.heyspace.authResult.userId,
        req.body.messageId
      );

      switch (result.status) {
        case UpdateMessageMetadataStatus.OK:
          return res.send();
        case UpdateMessageMetadataStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateKeyPressAction(req: Request, res: Response) {
    try {
      const result = await this.messageService.updateKeyPress(
        req.params.containerType,
        req.params.containerId,
        req.heyspace.authResult.userId,
        req.body.keyPressTime === null
      );

      switch (result.status) {
        case UpdateMessageMetadataStatus.OK:
          return res.send();
        case UpdateMessageMetadataStatus.MESSAGE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.MESSAGE_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getContainerMetadataAction(req: Request, res: Response) {
    try {
      const result = await this.messageService.getContainerMetadata(req.params.containerType, req.params.containerId);

      switch (result.status) {
        case GetMetadataStatus.OK:
          return res.send({
            ...pick(result, ['lastKeyPress', 'lastRead']),
          });
        case GetMetadataStatus.CONTAINER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CONTAINER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
