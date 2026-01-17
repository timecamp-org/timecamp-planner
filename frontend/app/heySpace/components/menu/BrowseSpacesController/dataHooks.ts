import { List } from 'immutable'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectAvailableInvisibleSpaces,
  selectAvailableVisibleSpaces,
  selectUserArchivedSpaces
} from 'models/domain/ProjectsModel/selectors'
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { selectIsCurrentUserOrganizationGuestInvitedByLink } from 'models/domain/ChatWithMeModel/selectors'
import {
  ProjectInterface,
} from 'models/domain/ProjectsModel/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'
import {
  fetchArchivedSpacesRequestType,
  fetchAvailableSpacesRequestType,
  getArchivedOrganizationProjectsQueryParams,
  getAvailableOrganizationProjectsQueryParams,
} from 'models/domain/ProjectsModel/requestQueryParams'

export type DataProviderHookInterface = {
  availableVisibleSpaces: List<ProjectInterface>,
  availableInvisibleSpaces: List<ProjectInterface>,
  archivedSpaces: List<ProjectInterface>,
  isFetchAvailableSpacesRequestRepeatable: boolean,
  isFetchArchivedSpacesRequestRepeatable: boolean,
  isCurrentUserOrganizationGuestInvitedByLink: boolean,
}

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))

  const isFetchAvailableSpacesRequestRepeatable = useSelector(state => selectIsRequestRepeatable(state, {
    requestType: fetchAvailableSpacesRequestType,
    objectId: currentOrganizationId,
  }))

  const isFetchArchivedSpacesRequestRepeatable = useSelector(state => selectIsRequestRepeatable(state, {
    requestType: fetchArchivedSpacesRequestType,
    objectId: currentOrganizationId,
  }))

  return {
    availableVisibleSpaces: useSelector(state => selectAvailableVisibleSpaces(state)),
    availableInvisibleSpaces: useSelector(state => selectAvailableInvisibleSpaces(state)),
    archivedSpaces: useSelector(state => selectUserArchivedSpaces(state)),
    isFetchAvailableSpacesRequestRepeatable,
    isFetchArchivedSpacesRequestRepeatable,
    isCurrentUserOrganizationGuestInvitedByLink: useSelector(state => selectIsCurrentUserOrganizationGuestInvitedByLink(state)),
  }
}

export type DataPersisterHookInterface = {
  onFetchArchivedSpaces: VoidFunction,
  onFetchAvailableSpaces: VoidFunction,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onFetchAvailableSpaces = useCallback(
    () => dispatch(ProjectsModelActions.onGetOrganizationProjects(getAvailableOrganizationProjectsQueryParams, false)),
    [dispatch]
  )

  const onFetchArchivedSpaces = useCallback(
    () => dispatch(ProjectsModelActions.onGetOrganizationProjects(getArchivedOrganizationProjectsQueryParams, true)),
    [dispatch]
  )


  return {
    onFetchArchivedSpaces,
    onFetchAvailableSpaces,
  }
}