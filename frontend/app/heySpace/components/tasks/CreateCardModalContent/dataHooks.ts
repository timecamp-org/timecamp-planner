import { useDispatch } from 'react-redux'
import { useSelector } from 'common/hooks/useSelector'
import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable'
import {
  selectConversationIdByProjectId,
  selectDirectChatPartner,
  selectProjectsColor,
  selectProjectIsGroupOrDirectChat,
  selectUserSharedSpaceIdsWithCurrentUser
} from 'models/domain/ProjectsModel/selectors'
import { selectProjectsListIds } from 'models/domain/ListsModel/selectors'
import { selectListIsArchivedStatuses } from 'models/domain/ListsModel/selectors/domain'
import { CreateCardModalContentInterface } from '.'
import * as TasksModelActions from 'models/domain/TasksModel/actions'
import { TaskInterface, TaskPeopleRole, TaskCreateSource } from 'models/domain/TasksModel/types'
import { onFetchProjectListsData } from 'models/domain/RequestModel/actions'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

export type DataProviderHookInterface = {
  spacesSections: Map<Id, List<Id>>,
  conversationUserId: Id,
  currentUserId: Id,
  listsIsArchivedStatuses: Map<Id, boolean>,
  projectsColor: Map<Id, string>,
  isConversation: boolean,
  spaceIds: List<Id>,
}

export const useDataProvider = (props: CreateCardModalContentInterface): DataProviderHookInterface => {
  const conversationId = useSelector(state => selectConversationIdByProjectId(state, { projectId: props.projectId }))
  const userSharedSpaceIds = useSelector(state => selectUserSharedSpaceIdsWithCurrentUser(state, { userId: props.conversationWithUserId }))
  const availableSpaceIds = useSelector(selectSortedAvailableVisibleSpacesIds)

  return {
    spacesSections: useSelector(selectProjectsListIds),
    conversationUserId: useSelector(state => selectDirectChatPartner(state, { conversationId })),
    currentUserId: useSelector(selectCurrentUserId),
    listsIsArchivedStatuses: useSelector(selectListIsArchivedStatuses),
    projectsColor: useSelector(selectProjectsColor),
    isConversation: useSelector(state => selectProjectIsGroupOrDirectChat(state, { projectId: props.projectId })),
    spaceIds: props.conversationWithUserId ? userSharedSpaceIds : availableSpaceIds,
  }
}

export type DataPersisterHookInterface = {
  onTaskCreate: (
    fields: Partial<TaskInterface>,
    listId: Id,
    taskPeople: Map<Id, TaskPeopleRole>,
    taskCreateSource: TaskCreateSource,
  ) => void,
  onCreateTaskInEmptyList: (
    fields: Partial<TaskInterface>,
    taskPeople: Map<Id, TaskPeopleRole>,
    taskCreateSource: TaskCreateSource,
  ) => void,
  onFetchProjectListsData: (projectId: Id) => void,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  return {
    onTaskCreate: (
      fields: Partial<TaskInterface>,
      listId: Id,
      taskPeople: Map<Id, TaskPeopleRole>,
      taskCreateSource: TaskCreateSource,
    ) => dispatch(TasksModelActions.onTaskCreate(fields, null, true, true, true, listId, taskPeople, undefined, taskCreateSource)),
    onCreateTaskInEmptyList: (
      fields: Partial<TaskInterface>,
      taskPeople: Map<Id, TaskPeopleRole>,
      taskCreateSource: TaskCreateSource
    ) => dispatch(TasksModelActions.onCreateTaskInEmptyList(fields, taskPeople, taskCreateSource)),
    onFetchProjectListsData: (projectId: Id) => dispatch(onFetchProjectListsData(projectId)),
  }
}
