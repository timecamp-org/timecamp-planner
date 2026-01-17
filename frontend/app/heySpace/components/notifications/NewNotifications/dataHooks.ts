import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { selectAreThereUnarchivedNotifications } from 'models/domain/NotificationsModel/selectors'
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { NotificationCenterType } from 'models/domain/NotificationsModel/types'

export type DataProviderInterface = {
  areThereUnarchivedNotifications: boolean,
  isLoading: boolean,
}

export const useDataProvider = (notificationCenterType: NotificationCenterType): DataProviderInterface => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))

  const areThereUnarchivedNotifications = useSelector(state => selectAreThereUnarchivedNotifications(state, { notificationCenterType }))
  const isLoading = useSelector(state => selectRequestIsLoading(state, { requestType: RequestTypes.getUserNotifications, objectId: currentOrganizationId }))

  return {
    areThereUnarchivedNotifications,
    isLoading,
  }
}

export type DataPersisterInterface = {
  onMarkAllAsRead: VoidFunction,
}

export const useDataPersister = (notificationCenterType: NotificationCenterType): DataPersisterInterface => {
  const dispatch = useDispatch()

  const onMarkAllAsRead = useCallback(() => {
    dispatch(NotificationsModelActions.onMarkAllAsRead(notificationCenterType))
  }, [dispatch, notificationCenterType])

  return {
    onMarkAllAsRead,
  }
}
