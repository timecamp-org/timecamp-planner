import { Id } from '../common/identifier';
import { ChecklistItemDbRow } from '../db/schema';

export interface CreateChecklistItemResult {
  status: CreateChecklistItemStatus;
  checklistItem?: ChecklistItemDbRow,
}

export interface UpdateChecklistItemResult {
  status: UpdateChecklistItemStatus;
}

export interface DeleteChecklistItemResult {
  status: DeleteChecklistItemStatus;
}

export enum CreateChecklistItemStatus {
  OK, CHECKLIST_ITEM_ALREADY_EXISTS, CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS, TASK_NOT_FOUND,
}

export enum UpdateChecklistItemStatus {
  OK, CHECKLIST_ITEM_NOT_FOUND,
}

export enum DeleteChecklistItemStatus {
  OK, CHECKLIST_ITEM_NOT_FOUND,
}

export interface CheckListItemJson {
  id: Id,
  taskId: Id,
  order: number,
  name: string,
}

export interface ChecklistItemBasicData {
  id: Id,
  isChecked: boolean,
  taskId: Id,
}

export interface TasksChecklistItemsMap {
  [taskId: string]: ChecklistItemDbRow[],
}

export enum AddChecklistItemAssigneeStatus {
  OK,
  USER_ALREADY_ASSIGNED,
  CHECKLIST_ITEM_NOT_FOUND,
  USER_NOT_FOUND
}

export interface AddChecklistItemAssigneeResult {
  status: AddChecklistItemAssigneeStatus,
}

export enum RemoveChecklistItemAssigneeStatus {
  OK,
  CHECKLIST_ASSIGNEE_NOT_FOUND,
  CHECKLIST_ITEM_NOT_FOUND,
}

export interface RemoveChecklistItemAssigneeResult {
  status: RemoveChecklistItemAssigneeStatus
}

