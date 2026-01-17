import {
  CreateChecklistItemResult,
  UpdateChecklistItemResult,
  DeleteChecklistItemResult,
  CheckListItemJson,
  TasksChecklistItemsMap,
  AddChecklistItemAssigneeResult,
  RemoveChecklistItemAssigneeResult, ChecklistItemBasicData,
} from './types'
import { ChecklistItemDbRow } from '../db/schema';
import { Id, IdMap } from '../common/identifier'

import { QueryModifier } from '../../../../services/types';

export interface ChecklistItemServiceInterface {
  createChecklistItem(id: Id, taskId: Id, checkListItem: CheckListItemJson): PromiseLike<CreateChecklistItemResult>
  updateChecklistItem(id: Id, taskId: Id, checkListItem: CheckListItemJson, updatedAt: number): PromiseLike<UpdateChecklistItemResult>
  deleteChecklistItem(id: Id): PromiseLike<DeleteChecklistItemResult>

  getChecklistItemsWhereTaskId(taskId: Id, decorate?: QueryModifier, trx?: Transaction): PromiseLike<Array<ChecklistItemDbRow>>
  getTaskChecklistItemsAssignees(taskId: Id): Promise<IdMap>
  getTasksChecklistItems(taskIds: Id[], trx?: Transaction): PromiseLike<TasksChecklistItemsMap>
  getTasksChecklistItemsBasicData(taskIds: Id[]): Promise<ChecklistItemBasicData[]>

  createChecklistItems(checklistItems: ChecklistItemDbRow[], trx?: Transaction): PromiseLike<void>

  addChecklistItemAssignee(checklistItemId: Id, userId: Id, actorId: Id): Promise<AddChecklistItemAssigneeResult>
  removeChecklistItemAssignee(checklistItemId: Id, userId: Id, actorId: Id): Promise<RemoveChecklistItemAssigneeResult>
}
