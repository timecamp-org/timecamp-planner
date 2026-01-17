import { Id } from '../../common/identifier';
import Table from '../../db/Table';
import { ProjectTemplateDbRow } from '../../db/schema';
import { EntityTemplateDbRow, ProjectTemplateType } from '../types';

export interface TemplateProviderInterface {
  getEntity<T>(table: Table, id: Id): Promise<T>;
  getTemplateEntitiesByQueryModifiers(
    table: Table,
    queryModifier: Record<string, string | number>
  ): Promise<EntityTemplateDbRow[]>;
  getTemplateEntity(
    table: Table,

    templateId: Id,
    userOrganizationIds?: Id[]
  ): Promise<EntityTemplateDbRow>;
  getTemplateEntities(table: Table, userOrganizationIds: Id[]): Promise<EntityTemplateDbRow[]>;

  createTemplateEntity(templateTable: Table, data: any, trx?: Transaction): Promise<any>;

  createTemplateEntities(templateTable: Table, data: any, trx?: Transaction): Promise<any[]>;

  updateTemplateEntity(
    templateTable: Table,
    id: Id,
    projectTemplateJson: Partial<ProjectTemplateType>,
    trx?: Transaction
  ): Promise<ProjectTemplateDbRow>;

  deleteTemplateEntity(entityTable: Table, templateId: Id): Promise<number>;

  deleteCascadeTemplateEntityChildren(entityTable: Table, templateId: Id): Promise<number>;
}
