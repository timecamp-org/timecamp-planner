import { fromJS, List, Map } from 'immutable'
import * as C from './constants'
import { TaskStatus, TasksState } from './types'
import { TaskPeopleRole } from './types'
import * as ProjectsModelConstants from '../ProjectsModel/constants'
import * as NotificationsModelConstants from '../NotificationsModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { Task } from './models'

import {
  onFetchProjectViewDataSuccess,
  onFetchConversationViewDataSuccess,
  onFetchListTasksDataSuccess,
  onFetchProjectTasksDataSuccess,
  onFetchUserLatestVisitedTasksSuccess,
} from '../RequestModel/constants'

import * as CurrentUserConstants from '../CurrentUserModel/constants'
import { mergeDeepSkipUndefined } from '../../../utils/mergeDeepSkipUndefined';
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';
import { filterList, updateListWithNewItem } from 'common/utils/immutableUtils'
import { Id } from 'common/utils/identifier'

const emptyMap = Map()
const emptyList = List()

const initialState: TasksState = fromJS({
  tasksData: {},
  taskDescriptions: {},
  taskReactions: {},
  taskPeopleIds: {},
  taskPeopleRole: {},
  taskTagIds: {},
  taskFollowerIds: {},
  taskLatestVisit: {},
  taskAttachmentsIds: {},
  taskIdByMessageId: {},
  isTaskDescriptionDirty: false,
  projectIdsByTaskIds: {},
  taskFileIds: {},
  isWaitingToUpdateProgress: false, // TODO: Create separate model with key/value pairs with debounce data
})

const reducer: Reducer<TasksState, PayloadAction> = (state: TasksState = initialState, action: PayloadAction): TasksState => {
  switch (action.type) {
    case C.onSetIsTaskDescriptionDirty: {
      return state.set('isTaskDescriptionDirty', action.payload.isDirty)
    }

    case C.onTaskCreateSuccess: {
      const {
        taskId, task, projectId, tagIds, people, peopleRole, taskFollowers, sourceMessageId, description
      } = action.payload.data

      return state
        .setIn(['tasksData', taskId], task)
        .setIn(['taskTagIds', taskId], tagIds)
        .setIn(['taskPeopleIds', taskId], people)
        .setIn(['taskPeopleRole', taskId], peopleRole)
        .setIn(['taskFollowerIds', taskId], taskFollowers)
        .setIn(['taskIdByMessageId', sourceMessageId], taskId)
        .setIn(['projectIdsByTaskIds', taskId], projectId)
        .setIn(['taskDescriptions', taskId], description)
    }

    case C.onTaskDeleteSuccess: {
      const { taskId } = action.payload.data
      return state
        .deleteIn(['tasksData', taskId])
        .deleteIn(['taskTagIds', taskId])
        .deleteIn(['taskPeopleIds', taskId])
        .deleteIn(['projectIdsByTaskIds', taskId])
    }

    case C.onArchiveTask: {
      return state.setIn(['tasksData', action.payload.taskId, 'isArchived'], true)
    }

    case C.onUnarchiveTask: {
      return state.setIn(['tasksData', action.payload.taskId, 'isArchived'], false)
    }

    case C.onChangeDescription: {
      const { taskId, description } = action.payload
      return state.setIn(['taskDescriptions', taskId], description)
    }

    case C.onUpdateName: {
      const { taskId, name } = action.payload
      return state
        .setIn(['tasksData', taskId, 'name'], name)
    }

    case C.onChangeStatus: {
      const { taskId, status } = action.payload
      // TODO REMOVE, HANDLE IT PROPERLY IN SAGAS
      let progressEstimate
      if (status === TaskStatus.COMPLETED) {
        progressEstimate = 100
      } else {
        progressEstimate = 0
      }
      return state.setIn(['tasksData', taskId, 'status'], status)
        .setIn(['tasksData', taskId, 'progress'], progressEstimate)
    }

    case C.onChangeProgressEstimate: {
      const { taskId, progressEstimate } = action.payload
      // TODO REMOVE, HANDLE IT PROPERLY IN SAGAS
      let status
      if (progressEstimate >= 100) {
        status = TaskStatus.COMPLETED
      } else {
        status = TaskStatus.ACTIVE
      }
      return state.setIn(['tasksData', taskId, 'progress'], progressEstimate)
        .setIn(['tasksData', taskId, 'status'], status)
    }

    case C.onSetIsWaitingToUpdateProgress: {
      return state.set('isWaitingToUpdateProgress', action.payload.isWaiting)
    }

    case C.onMoveTaskSuccess: {
      const { projectId, taskId } = action.payload.data
      return state.setIn(['projectIdsByTaskIds', taskId], projectId)
    }

    case C.onCreateTaskData: {
      const { taskData, projectId, sourceMessageId } = action.payload
      return state
        .setIn(['tasksData', taskData.id], taskData)
        .setIn(['projectIdsByTaskIds', taskData.id], projectId)
        .setIn(['taskIdByMessageId', sourceMessageId], taskData.id)
    }

    case C.onUpdateTaskData: {
      const {
        taskData,
        projectId,
        description,
        sourceMessageId,
        taskAssigneeIds,
        taskFollowerIds,
      } = action.payload

      // DO NOT update if value passed to action is undefined (accept null)
      let partiallyUpdateState = state
        .updateIn(['projectIdsByTaskIds', taskData.id], currentProjectId => (projectId !== undefined ? projectId : currentProjectId))
        .updateIn(['taskDescriptions', taskData.id], currentDescription => (description !== undefined ? description : currentDescription))
        .updateIn(['taskFollowerIds', taskData.id], currentTaskFollowerIds =>
          (taskFollowerIds !== undefined ? List(taskFollowerIds) : currentTaskFollowerIds))
        .setIn(['taskIdByMessageId', sourceMessageId], taskData.id)

      if (taskAssigneeIds) {
        let newTaskUserRoleMap = emptyMap
        taskAssigneeIds.forEach(userId => {
          newTaskUserRoleMap = newTaskUserRoleMap.set(userId, TaskPeopleRole.ASSIGNEE)
        })

        partiallyUpdateState = partiallyUpdateState
          .updateIn(['taskPeopleIds', taskData.id], currentTaskPeopleIds =>
            (taskAssigneeIds !== undefined ? List(taskAssigneeIds) : currentTaskPeopleIds))
          .setIn(['taskPeopleRole', taskData.id], newTaskUserRoleMap)
      }

      return partiallyUpdateState.getIn(['tasksData', taskData.id])
        ? partiallyUpdateState.mergeIn(['tasksData', taskData.id], taskData)
        : partiallyUpdateState.setIn(['tasksData', taskData.id], new Task(taskData))
    }

    case C.onTaskUpdate: {
      const { taskId, taskFields } = action.payload
      return state.mergeIn(['tasksData', taskId], taskFields)
    }

    case C.onUpdateTaskPeopleIds: {
      const { taskId, taskPeopleIds } = action.payload
      return state.setIn(['taskPeopleIds', taskId], taskPeopleIds)
    }

    case C.onUpdateTaskPeopleRole: {
      const { taskId, taskPeopleRole } = action.payload
      return state.setIn(['taskPeopleRole', taskId], taskPeopleRole)
    }

    case C.onAddTaskPerson:
    case C.onUpdateTaskPerson: {
      const { taskId, userId, role } = action.payload
      let newState = state

      newState = newState
        .updateIn(['taskPeopleIds', taskId], updateListWithNewItem<Id>(userId))

      if (role) {
        newState = newState
          .setIn(['taskPeopleRole', taskId, userId], role)
      }
      return newState
    }

    case C.onRemoveTaskPerson: {
      const { taskId, userId } = action.payload

      return state
        .updateIn(['taskPeopleIds', taskId], taskPeopleIds => taskPeopleIds
          ? filterList<Id>(taskPeopleIds, userId)
          : emptyList
        )
        .updateIn(['taskPeopleRole', taskId], (taskPeopleRole = emptyMap) => taskPeopleRole.delete(userId))
    }

    case C.onCreateTaskAttachmentsIds: {
      const { taskId, taskAttachmentsIds } = action.payload
      return state.setIn(['taskAttachmentsIds', taskId], taskAttachmentsIds)
    }

    case C.onBatchTasksSources: {
      const { taskIdByMessageId, projectIdByTaskId } = action.payload.tasksFromMessagesSourceData
      return state
        .set('taskIdByMessageId', state.get('taskIdByMessageId').merge(taskIdByMessageId))
        .set('projectIdsByTaskIds', state.get('projectIdsByTaskIds').merge(projectIdByTaskId))
    }

    case C.onAddFileToTaskAttachmentsSuccess: {
      const { taskId, fileId } = action.payload
      return state.updateIn(['taskAttachmentsIds', taskId], list => (list ? list.push(fileId) : List([fileId])))
    }

    case C.onDeleteTaskAttachmentSuccess: {
      const { taskId, fileId } = action.payload
      return state.updateIn(['taskAttachmentsIds', taskId], list => list.filter(id => id !== fileId))
    }

    case onFetchConversationViewDataSuccess:
    case onFetchProjectViewDataSuccess: {
      const {
        tasksData, projectIdsByTaskIds, taskPeopleIds, taskPeopleRole, taskFollowerIds, taskReactions,
      } = action.payload.data

      return state.set('tasksData', mergeDeepSkipUndefined(state.get('tasksData'), tasksData))
        .set('taskPeopleIds', state.get('taskPeopleIds').merge(taskPeopleIds))
        .set('taskPeopleRole', state.get('taskPeopleRole').merge(taskPeopleRole))
        .set('taskFollowerIds', state.get('taskFollowerIds').merge(taskFollowerIds))
        .set('projectIdsByTaskIds', state.get('projectIdsByTaskIds').merge(projectIdsByTaskIds))
        .set('taskReactions', state.get('taskReactions').merge(taskReactions))
    }

    case onFetchListTasksDataSuccess:
    case onFetchProjectTasksDataSuccess: {
      const {
        tasksData,
        projectIdsByTaskIds,
        taskFollowerIds,
        taskPeopleIds,
        taskPeopleRole
      } = action.payload.data

      return state
        .set('tasksData', state.get('tasksData').merge(tasksData))
        .set('projectIdsByTaskIds', state.get('projectIdsByTaskIds').merge(projectIdsByTaskIds))
        .set('taskFollowerIds', state.get('taskFollowerIds').merge(taskFollowerIds))
        .set('taskPeopleIds', state.get('taskPeopleIds').merge(taskPeopleIds))
        .set('taskPeopleRole', state.get('taskPeopleRole').merge(taskPeopleRole))
    }

    case C.onAddUserToTaskFollowersSuccess:
    case C.onRemoveUserFromTaskFollowersSuccess: {
      const { taskId, taskFollowerIds } = action.payload.data
      return state.setIn(['taskFollowerIds', taskId], taskFollowerIds)
    }

    case C.onRemoveUserFromTasksFollowers: {
      const { tasksFollowerIds } = action.payload
      return state.set('taskFollowerIds', state.get('taskFollowerIds').merge(tasksFollowerIds))
    }

    case ProjectsModelConstants.onFollowerRemoveSuccess: {
      const { tasksFollowerIds } = action.payload.data
      return state.set('taskFollowerIds', state.get('taskFollowerIds').merge(tasksFollowerIds))
    }

    case C.onAddTaskFollower: {
      const { userId, taskId } = action.payload
      return state
        .updateIn(['taskFollowerIds', taskId], updateListWithNewItem<Id>(userId))
    }

    case C.onRemoveTaskFollower: {
      const { userId, taskId } = action.payload
      return state
        .updateIn(['taskFollowerIds', taskId], (taskFollowerIds = emptyList as List<Id>) => filterList<Id>(taskFollowerIds, userId))
    }

    case C.onFetchTaskDetailsSuccess: {
      const {
        taskData,
        taskId,
        taskAttachments,
        taskDescription,
        projectId,
        taskFollowerIds,
        taskPeopleIds,
        taskPeopleRole,
      } = action.payload.data
      return state.setIn(['tasksData', taskId], taskData)
        .setIn(['taskAttachmentsIds', taskId], taskAttachments)
        .setIn(['taskDescriptions', taskId], taskDescription)
        .setIn(['projectIdsByTaskIds', taskId], projectId)
        .setIn(['taskFollowerIds', taskId], taskFollowerIds)
        .setIn(['taskPeopleIds', taskId], taskPeopleIds)
        .setIn(['taskPeopleRole', taskId], taskPeopleRole)
    }

    case NotificationsModelConstants.onCreateNotificationData:
    case NotificationsModelConstants.onUpdateNotificationData: {
      const { externalData } = action.payload
      const taskId = externalData.get('taskId')
      const projectId = externalData.get('projectId')
      if (taskId && projectId) {
        return state.setIn(['projectIdsByTaskIds', taskId], projectId)
      } else {
        return state
      }
    }

    case NotificationsModelConstants.onBatchNotificationsData: {
      const { notificationsData, notificationsExternalData } = action.payload
      let projectIdsByTaskIds = state.get('projectIdsByTaskIds')
      notificationsData.valueSeq().forEach(notification => {
        const externalData = notificationsExternalData.get(notification.id)
        const taskId = externalData.get('taskId')
        const projectId = externalData.get('projectId')
        if (taskId && projectId && !projectIdsByTaskIds.get(taskId)) {
          projectIdsByTaskIds = projectIdsByTaskIds.set(taskId, projectId)
        }
      })
      return state.set('projectIdsByTaskIds', projectIdsByTaskIds)
    }

    case C.onAddTaskReactionSuccess: {
      const { taskId, userId, emojiCode } = action.payload.data
      return state.setIn(['taskReactions', taskId, userId], emojiCode)
    }

    case C.onRemoveTaskReactionSuccess: {
      const { taskId, userId } = action.payload.data
      return state.deleteIn(['taskReactions', taskId, userId])
    }

    case C.onUpdateTaskReactionData: {
      const { taskId, userId, emojiCode } = action.payload
      return state.setIn(['taskReactions', taskId, userId], emojiCode)
    }

    case C.onRemoveTaskReactionData: {
      const { taskId, userId } = action.payload
      return state.deleteIn(['taskReactions', taskId, userId])
    }

    case C.onAddFileIdToTaskFileIds: {
      const { taskId, fileId } = action.payload
      return state.updateIn(['taskFileIds', taskId], list => (list ? list.push(fileId) : List([fileId])))
    }

    case C.onBatchTaskFileIds: {
      const { taskId, fileIds } = action.payload
      return state.updateIn(['taskFileIds', taskId], list => (list ? list.concat(fileIds).toSet().toList() : fileIds))
    }

    case onFetchUserLatestVisitedTasksSuccess: {
      const { tasksData, projectIdsByTaskIds, taskLatestVisit } = action.payload

      return state
        .set('tasksData', state.get('tasksData').mergeDeep(tasksData))
        .set('projectIdsByTaskIds', state.get('projectIdsByTaskIds').merge(projectIdsByTaskIds))
        .set('taskLatestVisit', state.get('taskLatestVisit').merge(taskLatestVisit))
    }

    case C.onSetUserLatestTaskVisitDate: {
      const { taskId, date } = action.payload
      return state.setIn(['taskLatestVisit', taskId], date)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState

    default: {
      return state
    }
  }
}

export default reducer
