import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { WebhookModule } from '../modules/webhooks/WebhookModule';
import { WebhookServiceInterface } from '../modules/webhooks/interfaces/WebhookServiceInterface';
import {
  CreateWebhookStatus,
  DeleteWebhookStatus,
  GetWebhookStatus,
  GetWebhooksStatus,
  UpdateWebhookStatus,
  WebhookCreateRequestBodyInterface,
} from '../modules/webhooks/types';
import logger from '../../../infrastructure/logger';

@injectable()
export class WebhookController {
  constructor(
    @inject(WebhookModule.WebhookServiceInterface)
    private webhookService: WebhookServiceInterface
  ) {}

  async getWebhookAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { webhookId } = req.params;
      const result = await this.webhookService.getWebhook(webhookId, userId);

      switch (result.status) {
        case GetWebhookStatus.OK:
          return res.send(result.webhook);
        case GetWebhookStatus.WEBHOOK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_FOUND]);
        case GetWebhookStatus.WEBHOOK_NOT_OWNED:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_OWNED]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getWebhooksAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const result = await this.webhookService.getWebhooks(userId);
      switch (result.status) {
        case GetWebhooksStatus.OK:
          return res.send(result.webhooks);
        case GetWebhooksStatus.WEBHOOK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createWebhookAction(req: Request<{}, any, WebhookCreateRequestBodyInterface, {}>, res: Response) {
    try {
      const user = req.heyspace.authResult.userId;

      const result = await this.webhookService.createWebhook(req.body, user);
      switch (result.status) {
        case CreateWebhookStatus.OK:
          return res.send(result.webhook);
        case CreateWebhookStatus.INVALID_CALLBACK_URL:
          return res.send(ErrorDefinitions[Type.INVALID_CALLBACK_URL]);
        case CreateWebhookStatus.USER_NOT_ORGANIZATION_OWNER:
          return res.send(ErrorDefinitions[Type.USER_NOT_ORGANIZATION_OWNER]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      res.send(ErrorDefinitions[Type.INTERNAL]);
      logger(error);
    }
  }

  async updateWebhookAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { webhookId } = req.params;

      const result = await this.webhookService.updateWebhook(webhookId, userId, req.body);

      switch (result.status) {
        case UpdateWebhookStatus.OK:
          return res.send(result.webhook);
        case UpdateWebhookStatus.WEBHOOK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_FOUND]);
        case UpdateWebhookStatus.WEBHOOK_NOT_OWNED:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_OWNED]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
  async deleteWebhookAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;

      const webhookId = req.params.webhookId;

      const result = await this.webhookService.deleteWebhook(webhookId, userId);

      switch (result.status) {
        case DeleteWebhookStatus.OK:
          return res.send();
        case DeleteWebhookStatus.WEBHOOK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_FOUND]);
        case DeleteWebhookStatus.WEBHOOK_NOT_OWNED:
          return res.send(ErrorDefinitions[Type.WEBHOOK_NOT_OWNED]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      res.send(ErrorDefinitions[Type.INTERNAL]);
      logger(error);
    }
  }
}
