import { Map, List } from 'immutable'
import * as Constants from '../ChecklistsModel/constants'
import { ChecklistItem } from '../ChecklistsModel/models'
import { timestampNow } from 'common/utils/epoch';
import { action } from 'typesafe-actions'
import { Id, IdMap } from 'common/utils/identifier'
import { ChecklistItemInterface } from 'models/domain/ChecklistsModel/types'
import { ActionResultInterface } from 'models/domain/ActionResultModel'
import { EntityWithHistory } from 'models/domain/EntityHistoryModel/types'
import { EntityInterface } from 'models/domain/EntityModel/types'

const emptyMap = Map()

export function onAddItemToChecklist(taskId: Id, previousChecklistItemId: Id, name: string) {
  return action(Constants.onAddItemToChecklist, {
    taskId,
    previousChecklistItemId,
    name,
  })
}

export function onAddItemToChecklistSuccess(checklistItemData: Partial<ChecklistItemInterface>, taskId: Id) {
  return action(Constants.onAddItemToChecklistSuccess, {
      checklistItemData: new ChecklistItem(checklistItemData),
      taskId,
    })
  }

export function onAddItemToChecklistFailure(actionResult: ActionResultInterface) {
  return action(Constants.onAddItemToChecklistFailure, {
    actionResult,
  })
}

export function onRemoveItemFromChecklistSuccess(id: Id, taskId: Id) {
  return action(Constants.onRemoveItemFromChecklistSuccess, {
    id,
    taskId,
  })
}

export function onRemoveItemFromChecklist(taskId: Id, checklistItemId: Id) {
  return action(Constants.onRemoveItemFromChecklist, {
    taskId,
    checklistItemId,
  })
}

export function onRemoveItemFromChecklistFailure(actionResult: ActionResultInterface) {
  return action(Constants.onRemoveItemFromChecklistFailure, {
    actionResult,
  })
}

export function onChangeChecklistItemData(checklistItemId: Id, checklistItemFields: Partial<ChecklistItemInterface>, taskId: Id, updatedAt: number = timestampNow()) {
  return action(Constants.onChangeChecklistItemData, {
    checklistItemId,
    checklistItemFields,
    taskId,
    updatedAt,
  })
}

export function onChangeChecklistItemText(checklistItemId: Id, text: string, taskId: Id, ignoreDebounce: boolean = false, updatedAt: number = timestampNow()) {
  return action(Constants.onChangeChecklistItemText, {
    checklistItemId,
    text,
    taskId,
    ignoreDebounce,
    updatedAt,
  })
}

export function onChangeChecklistItemDataSuccess(actionResult: ActionResultInterface) {
  return action(Constants.onChangeChecklistItemDataSuccess, {
    actionResult,
  })
}

export function onChangeChecklistItemDataFailure(actionResult: ActionResultInterface) {
  return action(Constants.onChangeChecklistItemDataFailure, {
    actionResult,
  })
}

export function onNewChecklistItemSeen(checklistItemId: Id) {
  return action(Constants.onNewChecklistItemSeen, {
    checklistItemId,
  })
}

export function onUpdateChecklistItemData(checklistItemData: EntityWithHistory<Partial<ChecklistItemInterface>>, taskId: Id) {
  const { entityHistory, ...checklistItem } = checklistItemData
  return action(Constants.onUpdateChecklistItemData, {
    checklistItem: new ChecklistItem(checklistItem),
    taskId,
    entityHistory: entityHistory,
  })
}

export function onUpdateChecklistItemDataSuccess(checklistItem: Partial<ChecklistItemInterface>) {
  return action(Constants.onUpdateChecklistItemDataSuccess, {
    checklistItem,
  })
}

export function onBatchChecklistItemsData(checklistItems: ChecklistItemInterface[], taskId: Id) {
  let checklistItemsData = emptyMap
  let taskIdsByChecklistItemIds = emptyMap

  Object.keys(checklistItems).forEach(checklistItemId => {
    checklistItemsData = checklistItemsData.set(checklistItemId, new ChecklistItem(checklistItems[checklistItemId]))
    taskIdsByChecklistItemIds = taskIdsByChecklistItemIds.set(checklistItemId, taskId)
  })
  return action(Constants.onBatchChecklistItemsData, {
    taskIdsByChecklistItemIds,
    checklistItemsData,
    taskId,
  })
}

export function onBatchChecklistItemsAssignees(checklistItemsAssignees: IdMap) {
  return action(Constants.onBatchChecklistItemsAssignees, {
    checklistItemsAssignees,
  })
}

export function onUpdateChecklistItemsOrder(updatedOrders: Map<Id, number>) {
  return action(Constants.onUpdateChecklistItemsOrder, {
    updatedOrders,
  })
}

export function onMoveChecklistItem(checklistItemId: Id, selectedPosition: number, taskId: Id) {
  return action(Constants.onMoveChecklistItem, {
    checklistItemId,
    selectedPosition,
    taskId,
  })
}

export function onConvertChecklistItemToCard(cardName: string, listId: Id, projectId: Id, checklistItemId: Id, sourceTaskId) {
  return action(Constants.onConvertChecklistItemToCard, {
    cardName,
    listId,
    projectId,
    checklistItemId,
    sourceTaskId,
  })
}

export function onAddChecklistItemAssignee(checklistItemId: Id, userId: Id) {
  return action(Constants.onAddChecklistItemAssignee, {
    checklistItemId,
    userId,
  })
}

export function onRemoveChecklistItemAssignee(checklistItemId: Id, userId: Id) {
  return action(Constants.onRemoveChecklistItemAssignee, {
    checklistItemId,
    userId,
  })
}


export function onCreateUserAndAddToSubscribers(checklistItemId: Id, email: string, userId?: Id) {
  return action(Constants.onCreateUserAndAddToSubscribers, {
    checklistItemId,
    email,
    userId,
  })
}

export function onUpdateChecklistItemAssignees(checklistItemId: Id, assigneeIds: List<Id> | Id[]) {
  // handle assigneeIds coming from feed as ordinary array
  if (!List.isList(assigneeIds)) {
    assigneeIds = List(assigneeIds)
  }

  return action(Constants.onUpdateChecklistItemAssignees, {
    checklistItemId,
    assigneeIds,
  })
}

export function onCreateChecklistItemAssignee(entity: EntityInterface) {
  const { entityId: checklistItemId } = entity
  const { userId } = entity.body
  return action(Constants.onCreateChecklistItemAssignee, {
    checklistItemId,
    userId,
  })
}

export function onDeleteChecklistItemAssignee(entity: EntityInterface) {
  const { entityId: checklistItemId } = entity
  const { userId } = entity.body
  return action(Constants.onDeleteChecklistItemAssignee, {
    checklistItemId,
    userId,
  })
}
