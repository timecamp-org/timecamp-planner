import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import * as NotificationsModelSelectors from 'models/domain/NotificationsModel/selectors'
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import {
  selectHasAccessToProject,
  selectIsCurrentUserInProject,
  selectProjectName
} from 'models/domain/ProjectsModel/selectors'
import { selectHasAccessToTask, selectTaskName } from 'models/domain/TasksModel/selectors'
import { selectListName } from 'models/domain/ListsModel/selectors'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions'
import * as AppModelActions from 'models/domain/AppModel/actions'
import { NotificationListItemInterface } from 'components/notifications/NotificationsListItem/index'
import { ActionResultInterface } from 'models/domain/ActionResultModel'

export type DataProviderInterface = {
  creationTimestamp: number,
  isUnread: boolean,
  notificationLink: string,
  isCurrentUserInProject: boolean,
  projectId: Id,
  taskId: Id,
  hasAccessToProject: boolean,
  hasAccessToTask: boolean,
  projectName: string,
  listName: string,
  taskName: string,
}

export const useDataProvider = (props: NotificationListItemInterface): DataProviderInterface => {
  const projectId = useSelector(state => NotificationsModelSelectors.selectNotificationDataProperty(state, { notificationId: props.notificationId, property: 'projectId' }))
  const listId = useSelector(state => NotificationsModelSelectors.selectNotificationDataProperty(state, { notificationId: props.notificationId, property: 'taskListId' }))
  const taskId = useSelector(state => NotificationsModelSelectors.selectNotificationDataProperty(state, { notificationId: props.notificationId, property: 'taskId' }))

  return {
    projectId,
    taskId,
    creationTimestamp: useSelector(state => NotificationsModelSelectors.selectNotificationCreationTimestamp(state, { notificationId: props.notificationId })),
    isUnread: useSelector(state => NotificationsModelSelectors.selectNotificationIsUnread(state, { notificationId: props.notificationId })),
    notificationLink: useSelector(state => NotificationsModelSelectors.selectLinkFromNotification(state, { notificationId: props.notificationId })),
    isCurrentUserInProject: useSelector(state => selectIsCurrentUserInProject(state, { projectId })),
    hasAccessToProject: useSelector(state => selectHasAccessToProject(state, { projectId })),
    hasAccessToTask: useSelector(state => selectHasAccessToTask(state, { taskId })),
    projectName: useSelector(state => selectProjectName(state, { projectId })),
    listName: useSelector(state => selectListName(state, { listId })),
    taskName: useSelector(state => selectTaskName(state, { taskId })),
  }
}

export type DataPersisterInterface = {
  onReadNotification: VoidFunction,
  onClickNotificationLinkFailure: (alert: Partial<ActionResultInterface>, id: Id) => void,
  onOpenCardDetailsModal: (cardId: Id) => void,
  onArchiveNotification: VoidFunction,
}

export const useDataPersister = (props: NotificationListItemInterface): DataPersisterInterface => {
  const dispatch = useDispatch()

  const onReadNotification = useCallback(() => {
    dispatch(NotificationsModelActions.onReadNotification(props.notificationId))
  }, [dispatch])

  const onClickNotificationLinkFailure = useCallback((alert: Partial<ActionResultInterface>, id: Id) => {
    dispatch(PopUpAlertsModelActions.onAddAlert(alert, id))
  }, [dispatch])

  const onOpenCardDetailsModal = useCallback((cardId: Id) => {
    dispatch(AppModelActions.onSetOpenedCardDetailsModalId(cardId))
  }, [dispatch])

  const onArchiveNotification = useCallback(() => {
    dispatch(NotificationsModelActions.onSetIsNotificationArchived(props.notificationId, true))
  }, [dispatch])

  return {
    onReadNotification,
    onClickNotificationLinkFailure,
    onOpenCardDetailsModal,
    onArchiveNotification,
  }
}
