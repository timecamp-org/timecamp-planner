import { fromJS, List } from 'immutable'
import * as Constants from './constants'

import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { filterList, mergeLists, updateListWithNewItem, recordMergerFactory } from 'common/utils/immutableUtils'
import { ChecklistsState } from '../ChecklistsModel/types'
import { Reducer } from 'redux'
import { PayloadAction } from 'common/types'
import { Id } from 'common/utils/identifier'
import { onFetchProjectViewDataSuccess, onFetchProjectTasksDataSuccess } from '../RequestModel/constants'

const emptyList = List()

const cleanInitialState: ChecklistsState = fromJS({
  checklistItemsData: {},
  checklistsByTaskId: {},
  checklistItemPeopleIds: {},
  taskIdByChecklistItemId: {},
})

const checklistItemBasicDataKeys = ['id', 'isChecked']
const checklistRecordMerger = recordMergerFactory(checklistItemBasicDataKeys)

const checklistsReducer: Reducer<ChecklistsState, PayloadAction> = (state: ChecklistsState = cleanInitialState, action: PayloadAction): ChecklistsState => {
  switch (action.type) {
    case Constants.onChangeChecklistItemDataSuccess: {
      const { checklistItemData } = action.payload.actionResult.data
      return state
        .setIn(['checklistItemsData', checklistItemData.id], checklistItemData)
    }

    case Constants.onAddItemToChecklistSuccess: {
      let newState = state
      const { checklistItemData, taskId } = action.payload

      if (!newState.getIn(['checklistItemsData', checklistItemData.id])) {
        newState = newState.setIn(['checklistItemsData', checklistItemData.id], checklistItemData)
      }

      return newState.updateIn(
        ['checklistsByTaskId', taskId],
        checklist => (checklist
          ? checklist.indexOf(checklistItemData.id) > -1
            ? checklist
            : checklist.push(checklistItemData.id)
          : List([checklistItemData.id])
        ),
      )
        .setIn(['taskIdByChecklistItemId', checklistItemData.id], taskId)
    }

    case Constants.onRemoveItemFromChecklistSuccess: {
      const { id, taskId } = action.payload
      return state
        .deleteIn(['checklistItemsData', id])
        .deleteIn(['taskIdByChecklistItemId', id])
        .updateIn(['checklistsByTaskId', taskId], checklist => (
          checklist
            ? filterList(checklist, id)
            : emptyList
        ))
    }

    case Constants.onNewChecklistItemSeen: {
      const { checklistItemId } = action.payload
      return state
        .setIn(['checklistItemsData', checklistItemId, 'wasJustCreated'], false)
    }

    case Constants.onUpdateChecklistItemDataSuccess: {
      const { checklistItem } = action.payload
      return state
        .setIn(['checklistItemsData', checklistItem.id], checklistItem)
    }

    case Constants.onBatchChecklistItemsData: {
      const {
        checklistItemsData,
        taskId,
        taskIdsByChecklistItemIds,
      } = action.payload
      return state
        .set('checklistItemsData', state.get('checklistItemsData').mergeDeep(checklistItemsData))
        .updateIn(['checklistsByTaskId', taskId], checklist => {
          const checklistItemIds = checklistItemsData.keySeq().toList()
          return checklist ? mergeLists(checklist, checklistItemIds) : checklistItemIds
        })
        .set('taskIdByChecklistItemId', state.get('taskIdByChecklistItemId').mergeDeep(taskIdsByChecklistItemIds))
    }

    case Constants.onBatchChecklistItemsAssignees: {
      const { checklistItemsAssignees } = action.payload
      return state
        .set('checklistItemPeopleIds', state.get('checklistItemPeopleIds').mergeDeep(checklistItemsAssignees))
    }

    case Constants.onUpdateChecklistItemsOrder: {
      const { updatedOrders } = action.payload
      let updatedState = state
      updatedOrders.forEach((order, id) => {
        updatedState = state
          .setIn(['checklistItemsData', id, 'order'], order)
      })

      return updatedState
    }

    case Constants.onCreateChecklistItemAssignee: {
      const { checklistItemId, userId } = action.payload
      return state
        .updateIn(['checklistItemPeopleIds', checklistItemId], updateListWithNewItem<Id>(userId))
    }

    case Constants.onDeleteChecklistItemAssignee: {
      const { checklistItemId, userId } = action.payload
      return state
        .updateIn(['checklistItemPeopleIds', checklistItemId], (checklistItemAssigneeIds = emptyList as List<Id>) => filterList<Id>(checklistItemAssigneeIds, userId))
    }

    case Constants.onUpdateChecklistItemAssignees: {
      const { checklistItemId, assigneeIds } = action.payload
      return state
        .setIn(['checklistItemPeopleIds', checklistItemId], assigneeIds)
    }

    case onFetchProjectTasksDataSuccess:
    case onFetchProjectViewDataSuccess: {
      const {
        checklistItemsData,
        checklistsByTaskId,
        taskIdByChecklistItemId,
      } = action.payload.data
      return state
        .set('checklistItemsData',
          state.get('checklistItemsData')
            .mergeDeepWith(checklistRecordMerger, checklistItemsData)
        )
        .set('checklistsByTaskId', state.get('checklistsByTaskId').merge(checklistsByTaskId))
        .set('taskIdByChecklistItemId', state.get('taskIdByChecklistItemId').merge(taskIdByChecklistItemId))
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess: {
      return cleanInitialState
    }

    default: {
      return state
    }
  }
}

export default checklistsReducer
