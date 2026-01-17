import { EntityType } from '../../common/enum';
import { Id } from '../../common/identifier';
import {
  CreateEntityFromTemplateResult,
  CreateEntityTemplateResult,
  DeleteEntityTemplateResult,
  GetEntityTemplateResult,
  GetEntityTemplatesResult,
  ProjectTemplateJson,
  UpdateEntityTemplateResult,
} from '../types';

export interface TemplateServiceInterface {
  getEntityTemplate(userId: Id, entityType: EntityType, templateId: Id): PromiseLike<GetEntityTemplateResult>;
  getEntityTemplates(userId: Id, entityType: EntityType): PromiseLike<GetEntityTemplatesResult>;

  createProjectTemplate(
    userId: Id,
    projectTemplateJson: ProjectTemplateJson,
    trx?: Transaction
  ): PromiseLike<CreateEntityTemplateResult>;

  createEntityTemplate(userId: Id, entityType: EntityType, entityJson: any): PromiseLike<any>;
  updateEntityTemplate(
    userId: Id,
    entityType: EntityType,
    templateId: Id,
    templateJson: any
  ): PromiseLike<UpdateEntityTemplateResult>;

  deleteEntityTemplate(entityType: EntityType, templateId: Id): PromiseLike<DeleteEntityTemplateResult>;

  createEntityFromTemplateAction(
    userId: Id,
    entityType: EntityType,
    templateId: Id,
    body: Object,
    omitTasks: boolean
  ): PromiseLike<CreateEntityFromTemplateResult>;

  createTaskFromTemplate(
    taskTemplate,
    projectId: Id,
    creatorId: Id,
    taskListId: Id,
    omitTasks?: boolean
  ): PromiseLike<CreateEntityFromTemplateResult>;
}
