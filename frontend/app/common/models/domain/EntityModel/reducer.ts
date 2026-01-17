import * as UsersModelConstants from '../UsersModel/constants'
import * as ProjectsModelConstants from '../ProjectsModel/constants'
import * as TasksModelConstants from '../TasksModel/constants'
import * as ListsModelConstants from '../ListsModel/constants'
import * as RequestModelConstants from '../RequestModel/constants'
import * as NotificationsModelConstants from '../NotificationsModel/constants'
import { getNotificationEntityTypes } from '../NotificationsModel/utils'
import { EntityType, EntityState } from './types'
import { fromJS, Map } from 'immutable'
import { Reducer } from 'redux'

const emptyMap = Map()

const initialState: EntityState = fromJS({
  entityTypes: {},
})

const reducer: Reducer<EntityState> = (state = initialState, action) => {
  switch (action.type) {
    case UsersModelConstants.onCreateUserData:
      return state.setIn(['entityTypes', action.payload.userData.id], EntityType.USER_DATA)
    case UsersModelConstants.onCreateUser:
      return state.setIn(['entityTypes', action.payload.user.id], EntityType.USER_DATA)
    case UsersModelConstants.onBatchUsersData: {
      let entityTypes = emptyMap
      action.payload.usersData.keySeq().forEach(userId => {
        entityTypes = entityTypes.set(userId, EntityType.USER_DATA)
      })
      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case ProjectsModelConstants.onProjectCreateSuccess:
      return state.setIn(['entityTypes', action.payload.data.projectId], EntityType.PROJECT_DATA)

    case ProjectsModelConstants.onCreateProjectData:
    case ProjectsModelConstants.onFetchProjectSuccess:
      return state.setIn(['entityTypes', action.payload.project.id], EntityType.PROJECT_DATA)

    case ProjectsModelConstants.onGetOrganizationProjectsSuccess:
    case ProjectsModelConstants.onBatchProjects: {
      let entityTypes = emptyMap
      action.payload.projectsData.keySeq().forEach(projectId => {
        entityTypes = entityTypes.set(projectId, EntityType.PROJECT_DATA)
      })
      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case TasksModelConstants.onFetchTaskDetailsSuccess:
    case TasksModelConstants.onTaskCreateSuccess:
      return state.setIn(['entityTypes', action.payload.data.taskId], EntityType.TASK_DATA)

    case TasksModelConstants.onCreateTaskData:
    case TasksModelConstants.onUpdateTaskData:
      return state.setIn(['entityTypes', action.payload.taskData.id], EntityType.TASK_DATA)

    case RequestModelConstants.onFetchUserLatestVisitedTasksSuccess: {
      let entityTypes = emptyMap
      action.payload.tasksData.keySeq().forEach(taskId => {
        entityTypes = entityTypes.set(taskId, EntityType.TASK_DATA)
      })

      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case RequestModelConstants.onFetchConversationViewDataSuccess:
    case RequestModelConstants.onFetchProjectViewDataSuccess: {
      let entityTypes = emptyMap
      action.payload.data.tasksData.keySeq().forEach(taskId => {
        entityTypes = entityTypes.set(taskId, EntityType.TASK_DATA)
      })
      action.payload.data.normalizedListsData.get('names').keySeq().forEach(listId => {
        entityTypes = entityTypes.set(listId, EntityType.TASK_LIST)
      })
      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case RequestModelConstants.onFetchProjectListsDataSuccess: {
      let entityTypes = emptyMap
      action.payload.data.normalizedListsData.get('names').keySeq().forEach(listId => {
        entityTypes = entityTypes.set(listId, EntityType.TASK_LIST)
      })

      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case RequestModelConstants.onFetchProjectTasksDataSuccess: {
      let entityTypes = emptyMap
      action.payload.data.tasksData.keySeq().forEach(taskId => {
        entityTypes = entityTypes.set(taskId, EntityType.TASK_DATA)
      })

      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }

    case ListsModelConstants.onCreateListSuccess: {
      const { taskList } = action.payload
      return state.setIn(['entityTypes', taskList.id], EntityType.TASK_LIST)
    }
    case ListsModelConstants.onCreateListData:
      const { listEntity } = action.payload
      return state.setIn(['entityTypes', listEntity.id], EntityType.TASK_LIST)


    case NotificationsModelConstants.onUpdateNotificationData: {
      const { externalData } = action.payload
      return state.set('entityTypes', state.get('entityTypes').merge(getNotificationEntityTypes(externalData)))
    }
    case NotificationsModelConstants.onBatchNotificationsData: {
      const { notificationsExternalData } = action.payload
      let entityTypes = emptyMap
      notificationsExternalData.valueSeq().forEach(notificationExternalData => {
        entityTypes = entityTypes.merge(getNotificationEntityTypes(notificationExternalData))
      })
      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }
    case NotificationsModelConstants.onFetchUnreadNotificationsSuccess: {
      const { notificationsExternalData } = action.payload.data
      let entityTypes = emptyMap
      notificationsExternalData.valueSeq().forEach(notificationExternalData => {
        entityTypes = entityTypes.merge(getNotificationEntityTypes(notificationExternalData))
      })
      return state.set('entityTypes', state.get('entityTypes').merge(entityTypes))
    }
    default:
      return state
  }
}

export default reducer