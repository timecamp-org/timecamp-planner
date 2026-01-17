import {
  put, select, fork, takeEvery, takeLatest, cps, delay, call,
} from 'redux-saga/effects'
import { Map } from 'immutable'
import { batchActions } from 'redux-batched-actions'
import generateId from '../../../utils/generate-pushid'
import handleError from '../../../utils/handleError'
import makeActionResult from '../../../utils/makeActionResult'
import { ChecklistItem } from './models'
import { HeySpaceClient as client, UserTracker } from '../../../services'
import { shortDebounceTime } from 'common/utils/debounceTimes'
import calculateOrder from '../../../utils/CalculateOrder'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants'
import { onSetEntityHistory } from '../EntityHistoryModel/actions'

import * as Actions from './actions'
import * as Constants from './constants'
import * as DomainSelectors from './selectors/domain'
import { onTaskCreate } from '../TasksModel/sagas'
import { selectTaskFollowerIds } from '../TasksModel/selectors'
import { onAddUserToTaskFollowers } from '../TasksModel/actions'
import { selectCurrentUserId } from '../UsersModel/selectors/domain'
import { TaskPeopleRole } from '../TasksModel/types'
import { EntityType } from '../EntityModel/types'
import { PartialPayloadAction } from 'common/types'
import { createUserIfNotExisting } from '../OrganizationsModel/sagas'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onAddItemToChecklist, onAddItemToChecklist)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onRemoveItemFromChecklist, onRemoveItemFromChecklist)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onChangeChecklistItemData, onChangeChecklistItemData)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onChangeChecklistItemText, onChangeChecklistItemText)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onMoveChecklistItem, onMoveChecklistItem)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onConvertChecklistItemToCard, onConvertChecklistItemToCard)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onAddChecklistItemAssignee, onAddChecklistItemAssignee)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onRemoveChecklistItemAssignee, onRemoveChecklistItemAssignee)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onCreateUserAndAddToSubscribers, onCreateUserAndAddToSubscribers)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateChecklistItemData, onUpdateChecklistItemData)
    })
  },
]

function* onUpdateChecklistItemData({
  payload: {
    checklistItem,
    entityHistory
  }
}: PartialPayloadAction) {
  const actionsBatch = []
  actionsBatch.push(onSetEntityHistory(EntityType.CHECKLIST_ITEM, checklistItem.id, Map(entityHistory)))
  actionsBatch.push(Actions.onUpdateChecklistItemDataSuccess(checklistItem))
  yield put(batchActions(actionsBatch))
}

function* onAddItemToChecklist({
 payload: {
   taskId,
   previousChecklistItemId,
   name
 }
}: PartialPayloadAction) {
  const id = generateId()
  let requestPayload = {}
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createChecklistItem, id, RequestStatus.LOADING))

    const checklist = yield select(DomainSelectors.selectChecklistItemsIdsByTaskId, { taskId })

    let insertAtIndex = null
    if (!previousChecklistItemId) {
      insertAtIndex = checklist.size
    } else {
      insertAtIndex = checklist.indexOf(previousChecklistItemId) + 1
    }

    const checklistItemsOrder = yield select(DomainSelectors.selectChecklistItemsOrderByTaskId, { taskId })
    const updatedOrders = calculateOrder(id, insertAtIndex, checklistItemsOrder)
    const order = updatedOrders.get(id)

    const checklistItemData = new ChecklistItem({
      id,
      name: name || '',
      wasJustCreated: true,
      order,
    })

    const actionsBatch = []
    actionsBatch.push(Actions.onAddItemToChecklistSuccess(checklistItemData, taskId))
    actionsBatch.push(Actions.onUpdateChecklistItemsOrder(updatedOrders))
    yield put(batchActions(actionsBatch))

    requestPayload = {
      id,
      order,
      name: name || '',
      taskId,
    }
    yield cps(client.restApiClient.createChecklistItem, taskId, id, requestPayload)
    yield put(onSetRequestStatus(RequestTypesConstants.createChecklistItem, id, RequestStatus.SUCCESS))
    UserTracker.track(UserTrackerEvent.cardEdited, { what: 'checklist' })
  } catch (error) {
    handleError(error, { previousChecklistItemId, ...requestPayload })
    yield put(onSetRequestStatus(RequestTypesConstants.createChecklistItem, id, RequestStatus.FAILURE, error))
    yield put(Actions.onAddItemToChecklistFailure(makeActionResult({
      isOk: false,
      code: 'onAddItemToChecklistFailure',
      error,
    })))
  }
}

function* onRemoveItemFromChecklist({
  payload: {
    taskId,
    checklistItemId
  }
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItem, checklistItemId, RequestStatus.LOADING))
    yield put(Actions.onRemoveItemFromChecklistSuccess(checklistItemId, taskId))

    yield cps(client.restApiClient.removeChecklistItem, taskId, checklistItemId)
    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItem, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItem, checklistItemId, RequestStatus.FAILURE, error))
    yield put(Actions.onRemoveItemFromChecklistFailure(makeActionResult({
      isOk: false,
      code: 'onRemoveItemFromChecklistFailure',
      error,
    })))
    handleError(error, { taskId, checklistItemId })
  }
}

function* onChangeChecklistItemData({
  payload: {
    checklistItemId,
    checklistItemFields,
    taskId,
    updatedAt
  }
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateChecklistItem, checklistItemId, RequestStatus.LOADING))

    const currentChecklistItem = yield select(DomainSelectors.selectChecklistItemData, { checklistItemId })

    let newChecklistItem = {
      ...checklistItemFields,
    }

    if (currentChecklistItem) {
      newChecklistItem = {
        ...currentChecklistItem.toJS(),
        ...newChecklistItem,
      }
    }

    yield put(Actions.onChangeChecklistItemDataSuccess(makeActionResult({
      isOk: true,
      code: 'onChangeChecklistItemDataSuccess',
      data: {
        checklistItemData: new ChecklistItem(newChecklistItem),
      },
    })))

    yield cps(client.restApiClient.updateChecklistItem, taskId, checklistItemId, { ...checklistItemFields, updatedAt })
    yield put(onSetRequestStatus(RequestTypesConstants.updateChecklistItem, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.updateChecklistItem, checklistItemId, RequestStatus.FAILURE, error))
    yield put(Actions.onChangeChecklistItemDataFailure(makeActionResult({
      isOk: false,
      code: 'onChangeChecklistItemDataFailure',
      error,
    })))
    handleError(error, { checklistItemId, checklistItemFields })
  }
}

function* onChangeChecklistItemText({
  payload: {
    checklistItemId,
    text,
    taskId,
    updatedAt,
    ignoreDebounce = false
  }
}: PartialPayloadAction) {
  try {
    if (!ignoreDebounce) {
      yield delay(shortDebounceTime)
    }

    const checklistItemData = yield select(DomainSelectors.selectChecklistItemData, { checklistItemId })
    if (checklistItemData) {
      yield put(Actions.onChangeChecklistItemData(checklistItemId, { name: text }, taskId, updatedAt))
    }
  } catch (error) {
    handleError(error)
  }
}

export function* onMoveChecklistItem({
  payload: {
   checklistItemId,
   selectedPosition,
   taskId
  }
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.moveChecklistItem, checklistItemId, RequestStatus.LOADING))
    const checklistItemsOrder = yield select(DomainSelectors.selectChecklistItemsOrderByTaskId, { taskId })
    const updatedOrders = calculateOrder(checklistItemId, selectedPosition, checklistItemsOrder)
    const order = updatedOrders.get(checklistItemId)

    yield put(Actions.onUpdateChecklistItemsOrder(updatedOrders))

    yield cps(client.restApiClient.updateChecklistItem, taskId, checklistItemId, { order })
    yield put(onSetRequestStatus(RequestTypesConstants.moveChecklistItem, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.moveChecklistItem, checklistItemId, RequestStatus.FAILURE, error))
    handleError(error)
  }
}

export function* onAddChecklistItemAssignee({
  payload: {
    checklistItemId,
    userId
  }
}: PartialPayloadAction) {
  try {
    const currentChecklistItemAssignees = yield select(DomainSelectors.selectChecklistItemAssigneeIds, { checklistItemId })
    if (currentChecklistItemAssignees.includes(userId)) {
      return
    }

    yield put(onSetRequestStatus(RequestTypesConstants.addChecklistItemAssignee, checklistItemId, RequestStatus.LOADING))

    const actionsBatch = []
    const taskId = yield select(DomainSelectors.selectTaskIdByChecklistItemId, { checklistItemId })
    const taskFollowers = yield select(selectTaskFollowerIds, { taskId })

    if (!taskFollowers.includes(userId)) {
      actionsBatch.push(onAddUserToTaskFollowers(taskId, userId))
    }

    actionsBatch.push(Actions.onUpdateChecklistItemAssignees(checklistItemId, currentChecklistItemAssignees.push(userId)))

    yield put(batchActions(actionsBatch))

    yield cps(client.restApiClient.addChecklistItemAssignee, checklistItemId, userId)

    yield put(onSetRequestStatus(RequestTypesConstants.addChecklistItemAssignee, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.addChecklistItemAssignee, checklistItemId, RequestStatus.FAILURE, error))
  }
}

export function* onRemoveChecklistItemAssignee({
   payload: {
     checklistItemId,
     userId
   }
}: PartialPayloadAction) {
  try {
    const currentChecklistItemAssignees = yield select(DomainSelectors.selectChecklistItemAssigneeIds, { checklistItemId })
    if (!currentChecklistItemAssignees.includes(userId)) {
      // do nothing, user is not assigneed to checklist item
      return
    }

    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItemAssignee, checklistItemId, RequestStatus.LOADING))

    const updatedChecklistItemAssignees = currentChecklistItemAssignees.filterNot(checklistItemAssigneeId => checklistItemAssigneeId === userId)
    yield put(Actions.onUpdateChecklistItemAssignees(checklistItemId, updatedChecklistItemAssignees))

    yield cps(client.restApiClient.removeChecklistItemAssignee, checklistItemId, userId)

    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItemAssignee, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.removeChecklistItemAssignee, checklistItemId, RequestStatus.FAILURE, error))
  }
}

function* onCreateUserAndAddToSubscribers({
  payload: {
    checklistItemId,
    email,
    userId
  }
}: PartialPayloadAction) {
  try {
    userId = yield call(createUserIfNotExisting, email, userId)
    yield put(Actions.onAddChecklistItemAssignee(checklistItemId, userId))
    UserTracker.track(UserTrackerEvent.memberInvited, { source: 'checklist_item' })
  } catch (error) {
    handleError(error, { checklistItemId, email, userId })
  }
}

export function* onConvertChecklistItemToCard({
  payload: {
    cardName,
    listId,
    projectId,
    checklistItemId,
    sourceTaskId,
  }
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.convertChecklistItemToCard, checklistItemId, RequestStatus.LOADING))
    const currentUserId = yield select(selectCurrentUserId)

    const taskId = generateId()
    const taskFields = {
      id: taskId,
      projectId,
      taskListId: listId,
      creatorId: currentUserId,
      name: cardName,
    }

    const checklistItemAssigneeIds = yield select(DomainSelectors.selectChecklistItemAssigneeIds, { checklistItemId })
    let taskPeople = Map({
      [currentUserId]: TaskPeopleRole.ASSIGNEE,
    })
    checklistItemAssigneeIds.forEach(assigneeId => {
      taskPeople = taskPeople.set(assigneeId, TaskPeopleRole.ASSIGNEE)
    })

    const taskFollowerIds = checklistItemAssigneeIds

    yield call(onTaskCreate, {
      payload: {
        listId,
        taskFields,
        taskPeople,
        taskFollowerIds,
        createBelowDestination: false,
        createAtTheBeginning: true,
      },
    })

    // TODO: implement some kind of relation between checklistItem and created task
    // TODO: similar to message <-> converted task

    yield put(onSetRequestStatus(RequestTypesConstants.convertChecklistItemToCard, checklistItemId, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.convertChecklistItemToCard, checklistItemId, RequestStatus.FAILURE, error))
    handleError(error)
  }
}
