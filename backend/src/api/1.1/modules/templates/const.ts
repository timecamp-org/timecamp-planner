import { EntityType } from '../common/enum';
import Table from '../db/Table';

export const templateEntityParentRelationIdNamesByTable = {
  [Table.TASK_LIST_TEMPLATE]: 'projectTemplateId',
  [Table.TASK_TEMPLATE]: 'taskListTemplateId',
  [Table.CHECKLIST_ITEM_TEMPLATE]: 'taskTemplateId',
};

export const templateTableByEntityType: Partial<Record<EntityType, Table>> = {
  [EntityType.Project]: Table.PROJECT_TEMPLATE,
  [EntityType.TaskList]: Table.TASK_LIST_TEMPLATE,
  [EntityType.Task]: Table.TASK_TEMPLATE,
  [EntityType.ChecklistItem]: Table.CHECKLIST_ITEM_TEMPLATE,
};
