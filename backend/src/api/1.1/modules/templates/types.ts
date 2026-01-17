import {
  ChecklistItemDbRow,
  ChecklistItemTemplateDbRow,
  ListDbRow,
  ListTemplateDbRow,
  ProjectTemplateDbRow,
  TaskDbRow,
  TaskTemplateDbRow,
} from '../db/schema';
import { ProjectJson } from '../projects/types';

export type NestedProjectTemplate = ProjectTemplateDbRow & {
  taskListTemplates: (Partial<ListTemplateDbRow> & {
    taskTemplates: (Partial<TaskTemplateDbRow> & {
      checklistItemTemplates: Partial<ChecklistItemDbRow>[];
    })[];
  })[];
};

export type ProjectTemplateJson = Pick<
  ProjectJson,
  'name' | 'projectType' | 'color' | 'organizationId' | 'backgroundImageUrl'
>;

export type EntityTemplateDbRow =
  | ProjectTemplateDbRow
  | ListTemplateDbRow
  | TaskTemplateDbRow
  | ChecklistItemTemplateDbRow;

export type ProjectTemplateType = ProjectTemplateJson & {
  taskListTemplates: TaskListTemplateType[];
};

export type TaskListTemplateType = Pick<ListDbRow, 'name' | 'order' | 'isArchived'> & {
  taskTemplates: TaskTemplateType[];
};

export type TaskTemplateType = Pick<TaskDbRow, 'name' | 'description' | 'startDate' | 'dueDate' | 'order'> & {
  taskPriorityType: string;
  checklistItemTemplates: ChecklistTemplateType[];
};

export type ChecklistTemplateType = Pick<ChecklistItemDbRow, 'name' | 'order' | 'isChecked'>;

export enum GetEntityTemplateStatus {
  OK,
  ENTITY_NOT_FOUND,
}

export type GetEntityTemplateResult = {
  status: GetEntityTemplateStatus;
  template?: EntityTemplateDbRow;
};

export enum GetEntityTemplatesStatus {
  OK,
}
export type GetEntityTemplatesResult = {
  status: GetEntityTemplatesStatus;
  templates?: EntityTemplateDbRow[];
};

export enum CreateEntityTemplateStatus {
  OK,
  TEMPLATE_ENTITY_NOT_CREATED,
  USER_NOT_IN_ORGANIZATION,
  ORGANIZATION_ID_NOT_PROVIDED,
  GLOBAL_TEMPLATE_NOT_UNIQUE_NAME,
}

export type CreateEntityTemplateResult = {
  status: CreateEntityTemplateStatus;
  template?: EntityTemplateDbRow;
};

export enum UpdateEntityTemplateStatus {
  OK,
  USER_NOT_IN_ORGANIZATION,
  ORGANIZATION_ID_NOT_PROVIDED,
  GLOBAL_TEMPLATE_NOT_UNIQUE_NAME,
}

export type UpdateEntityTemplateResult = {
  status: UpdateEntityTemplateStatus;
  template?: EntityTemplateDbRow;
};

export enum CreateEntityFromTemplateStatus {
  OK,
  NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE,
  USER_NOT_IN_ORGANIZATION,
  USER_NOT_IN_PROJECT,
  TEMPLATE_ENTITY_NOT_FOUND,
  TASK_ALREADY_EXISTS,
  TASK_WITH_ORDER_ALREADY_EXISTS,
  PROJECT_NOT_FOUND,
  LIST_NOT_FOUND,
  DUE_DATE_EARLIER_THAN_START_DATE,
  TASK_NOT_FOUND,
  CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS,
  CHECKLIST_ITEM_ALREADY_EXISTS,
  ORGANIZATION_NOT_FOUND,
  PROJECT_ALREADY_EXISTS,
}

export type CreateEntityFromTemplateResult = {
  status: CreateEntityFromTemplateStatus;
  entity?: any;
};

export enum DeleteEntityTemplateStatus {
  OK,
}

export type DeleteEntityTemplateResult = {
  status: DeleteEntityTemplateStatus;
};
