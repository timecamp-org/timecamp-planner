import {
  ProjectInterface,
} from 'models/domain/ProjectsModel/types'
import { List } from 'immutable'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectAvailableInvisibleSpaces,
  selectAvailableVisibleSpaces
} from 'models/domain/ProjectsModel/selectors'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import {
  fetchAvailableSpacesRequestType,
  getAvailableOrganizationProjectsQueryParams
} from 'models/domain/ProjectsModel/requestQueryParams'

export type DataProviderHookInterface = {
  availableVisibleSpaces: List<ProjectInterface>,
  availableInvisibleSpaces: List<ProjectInterface>,
  isFetchAvailableSpacesRequestRepeatable: boolean,
  currentOrganizationId: Id,
}

export const useDataProvider = (): DataProviderHookInterface => {
  const availableVisibleSpaces = useSelector(state => selectAvailableVisibleSpaces(state))
  const availableInvisibleSpaces = useSelector(state => selectAvailableInvisibleSpaces(state))
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))

  const isFetchAvailableSpacesRequestRepeatable = useSelector(state => selectIsRequestRepeatable(state, {
    requestType: fetchAvailableSpacesRequestType,
    objectId: currentOrganizationId,
  }))

  return {
    availableVisibleSpaces,
    availableInvisibleSpaces,
    currentOrganizationId,
    isFetchAvailableSpacesRequestRepeatable,
  }
}

export type DataPersisterHookInterface = {
  onFetchAvailableSpaces: VoidFunction,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onFetchAvailableSpaces = useCallback(
    () => dispatch(ProjectsModelActions.onGetOrganizationProjects(getAvailableOrganizationProjectsQueryParams, false)),
    [dispatch]
  )

  return {
    onFetchAvailableSpaces
  }
}