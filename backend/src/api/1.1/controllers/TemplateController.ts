import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { EntityType } from '../modules/common/enum';
import { TemplateModule } from '../modules/templates/TemplateModule';
import { TemplateServiceInterface } from '../modules/templates/interfaces/TemplateServiceInterface';
import {
  CreateEntityFromTemplateStatus,
  CreateEntityTemplateStatus,
  DeleteEntityTemplateStatus,
  GetEntityTemplateStatus,
  GetEntityTemplatesStatus,
  UpdateEntityTemplateStatus,
} from '../modules/templates/types';

@injectable()
export class TemplateController {
  constructor(
    @inject(TemplateModule.TemplateServiceInterface)
    protected templateService: TemplateServiceInterface
  ) {}

  async getEntityTypeTemplateAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { entityType, templateId } = req.params;

      const result = await this.templateService.getEntityTemplate(userId, entityType as EntityType, templateId);
      switch (result.status) {
        case GetEntityTemplateStatus.OK:
          return res.send(result.template);
        case GetEntityTemplateStatus.ENTITY_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TEMPLATE_ENTITY_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async getEntityTypeTemplatesAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId;
      const { entityType } = req.params;

      const result = await this.templateService.getEntityTemplates(userId, entityType as EntityType);

      switch (result.status) {
        case GetEntityTemplatesStatus.OK:
          return res.send(result.templates);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createEntityTemplateAction(req: Request, res: Response) {
    try {
      const { entityType } = req.params;
      const userId = req.heyspace.authResult.userId;
      const result = await this.templateService.createEntityTemplate(userId, entityType as EntityType, req.body);

      switch (result.status) {
        case CreateEntityTemplateStatus.OK:
          return res.send(result.template);
        case CreateEntityTemplateStatus.ORGANIZATION_ID_NOT_PROVIDED:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_ID_NOT_PROVIDED]);
        case CreateEntityTemplateStatus.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME:
          return res.send(ErrorDefinitions[Type.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME]);
        case CreateEntityTemplateStatus.TEMPLATE_ENTITY_NOT_CREATED:
          return res.send(ErrorDefinitions[Type.TEMPLATE_ENTITY_NOT_CREATED]);
        case CreateEntityFromTemplateStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async updateEntityTemplateAction(req: Request, res: Response) {
    try {
      const { entityType, templateId } = req.params;
      const userId = req.heyspace.authResult.userId;

      const result = await this.templateService.updateEntityTemplate(
        userId,
        entityType as EntityType,
        templateId,
        req.body
      );

      switch (result.status) {
        case UpdateEntityTemplateStatus.OK:
          return res.send(result.template);
        case UpdateEntityTemplateStatus.ORGANIZATION_ID_NOT_PROVIDED:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_ID_NOT_PROVIDED]);
        case UpdateEntityTemplateStatus.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME:
          return res.send(ErrorDefinitions[Type.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async deleteEntityTemplate(req: Request, res: Response) {
    try {
      const { entityType, templateId } = req.params;

      const result = await this.templateService.deleteEntityTemplate(entityType as EntityType, templateId);

      switch (result.status) {
        case DeleteEntityTemplateStatus.OK:
          return res.send();
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  async createEntityFromTemplateAction(req: Request, res: Response) {
    try {
      const { entityType, templateId } = req.params;
      const { omitTasks } = req.query;

      const userId = req.heyspace.authResult.userId;
      const result = await this.templateService.createEntityFromTemplateAction(
        userId,
        entityType as EntityType,
        templateId,
        req.body,
        Boolean(omitTasks)
      );

      switch (result.status) {
        case CreateEntityFromTemplateStatus.OK:
          return res.send(result.entity);
        case CreateEntityFromTemplateStatus.NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE:
          return res.send(ErrorDefinitions[Type.NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE]);
        case CreateEntityFromTemplateStatus.USER_NOT_IN_ORGANIZATION:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_ORGANIZATION]);
        case CreateEntityFromTemplateStatus.USER_NOT_IN_PROJECT:
          return res.send(ErrorDefinitions[Type.USER_NOT_IN_PROJECT]);
        case CreateEntityFromTemplateStatus.TEMPLATE_ENTITY_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TEMPLATE_ENTITY_NOT_FOUND]);
        case CreateEntityFromTemplateStatus.DUE_DATE_EARLIER_THAN_START_DATE:
          return res.send(ErrorDefinitions[Type.TASK_DUE_DATE_EARLIER_THAN_START_DATE]);
        case CreateEntityFromTemplateStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND]);
        case CreateEntityFromTemplateStatus.PROJECT_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.PROJECT_NOT_FOUND]);
        case CreateEntityFromTemplateStatus.TASK_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TASK_ALREADY_EXISTS]);
        case CreateEntityFromTemplateStatus.TASK_WITH_ORDER_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.TASK_WITH_ORDER_ALREADY_EXISTS]);
        case CreateEntityFromTemplateStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case CreateEntityFromTemplateStatus.ORGANIZATION_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.ORGANIZATION_NOT_FOUND]);
        case CreateEntityFromTemplateStatus.PROJECT_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.PROJECT_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error);
      return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
