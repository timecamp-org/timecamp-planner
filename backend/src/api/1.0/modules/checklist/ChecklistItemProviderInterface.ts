
import { Id, IdMap } from '../common/identifier'
import { ChecklistItemDbRow } from '../db/schema'
import { ChecklistItemBasicData } from './types'

export interface ChecklistItemProviderInterface {
  createChecklistItem(checklistItem: ChecklistItemDbRow, trx?: Transaction): Promise<ChecklistItemDbRow>
  getChecklistItem(id: Id, trx?: Transaction): Promise<ChecklistItemDbRow>
  deleteChecklistItem(id: Id): Promise<number>
  updateChecklistItem(id: Id, checklistItemData: Partial<ChecklistItemDbRow>, trx?: Transaction): Promise<number>
  createChecklistItems(checklistItems: ChecklistItemDbRow[], trx?: Transaction): Promise<void>

  addChecklistItemAssignee(checklistItemId: Id, userId: Id, trx?: Transaction): Promise<void>
  removeChecklistItemAssignee(checklistItemId: Id, userId: Id, trx?: Transaction): Promise<number>
  getChecklistItemAssignees(checklistItemId: Id): Promise<Id[]>
  getTaskChecklistItemsAssignees(taskId: Id): Promise<IdMap>

  getTasksChecklistItemsBasicData(taskIds: Id[]): Promise<ChecklistItemBasicData[]>

}