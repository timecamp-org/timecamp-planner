import { List } from 'immutable'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'

import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectIsRequestFinished, selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { fetchChatNotificationSettingsTypes } from 'models/domain/RequestModel/constants/requestTypes'
import {
  getOrganizationProjectsWithUnreadMessagesQueryParams,
  organizationProjectsWithUnreadMessagesRequestType
} from 'models/domain/ProjectsModel/requestQueryParams'

export type DataProviderHookInterface = {
  spaceList: List<Id>,
  currentProjectId: Id,
  currentOrganizationId: Id,
  isRequestFinished: boolean,
  isOrganizationProjectsRequestRepeatable: boolean,
  isNotificationSettingsRequestRepeatable: boolean,
}

export const useDataProvider = () => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  return {
    spaceList: useSelector(state => selectSortedAvailableVisibleSpacesIds(state)),
    currentOrganizationId,
    isRequestFinished: useSelector(state => selectIsRequestFinished(state, { requestType: organizationProjectsWithUnreadMessagesRequestType, objectId: currentOrganizationId })),
    isOrganizationProjectsRequestRepeatable: useSelector(
      state => selectIsRequestRepeatable(state, { requestType: organizationProjectsWithUnreadMessagesRequestType, objectId: currentOrganizationId })
    ),
    isNotificationSettingsRequestRepeatable: useSelector(
      state => selectIsRequestRepeatable(state, { requestType: fetchChatNotificationSettingsTypes, objectId: currentOrganizationId })
    ),
  }
}

export type DataPersisterHookInterface = {
  onFetchChatNotificationSettingsTypes: VoidFunction
  onFetchOrganizationProjects: VoidFunction
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onFetchChatNotificationSettingsTypes = useCallback(
    () => dispatch(NotificationsModelActions.onFetchChatNotificationSettingsTypes()),
    [dispatch]
  )

  const onFetchOrganizationProjects = useCallback(
    () => dispatch(ProjectsModelActions.onGetOrganizationProjects(getOrganizationProjectsWithUnreadMessagesQueryParams)),
    [dispatch]
  )

  return {
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects,
  }
}
