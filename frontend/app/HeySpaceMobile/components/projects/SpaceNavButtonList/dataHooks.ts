import { List } from 'immutable'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { selectCurrentScene, selectCurrentProjectId } from 'models/mobile/NavigationModel/selectors'

import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  OrganizationProjectsParamMetadata,
  OrganizationProjectsQueryParams,
  ProjectType
} from 'models/domain/ProjectsModel/types'
import { EntityStatus } from 'models/domain/EntityModel/types'
import { selectIsRequestFinished } from 'common/models/domain/RequestModel/selectors'
import { getOrganizationProjects } from 'common/models/domain/RequestModel/constants/requestTypes'
import { getRequestTypeWithParams } from 'common/models/domain/RequestModel/helpers'

export const getOrganizationProjectsQueryParams: OrganizationProjectsQueryParams = {
  isMember: true,
  projectType: [ProjectType.PROJECT],
  status: EntityStatus.EXISTS,
  metadata: [OrganizationProjectsParamMetadata.UNREAD_MESSAGES]
}

export type DataProviderHookInterface = {
  spaceList: List<Id>,
  currentScene: string,
  currentProjectId: Id,
  currentOrganizationId: Id,
  isLoading: boolean,
}

export const useDataProvider = () => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  const requestType = getRequestTypeWithParams(getOrganizationProjects, getOrganizationProjectsQueryParams)

  return {
    spaceList: useSelector(state => selectSortedAvailableVisibleSpacesIds(state)),
    currentScene: useSelector(state => selectCurrentScene(state)),
    currentProjectId: useSelector(state => selectCurrentProjectId(state)),
    currentOrganizationId,
    isLoading: !useSelector(state => selectIsRequestFinished(state, { requestType, objectId: currentOrganizationId })),
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
    () => dispatch(ProjectsModelActions.onGetOrganizationProjects(getOrganizationProjectsQueryParams)),
    [dispatch]
  )

  return {
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects,
  }
}

