import RouteName from '../../AppNavigation/routeNames'
import { List } from 'immutable'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'
import { Id } from 'common/utils/identifier'
import usePrevious from 'common/hooks/usePrevious'
import useLazyList from 'common/hooks/useLazyList'
import { getOrganizationProjectsQueryParams, useDataPersister, useDataProvider } from './dataHooks'
import useRefreshData from '../../../../common/hooks/useRefreshData'
import * as ProjectsModelActions from '../../../../common/models/domain/ProjectsModel/actions'

const refreshControllerOptions = {
  action: ProjectsModelActions.onGetOrganizationProjects,
  paramsToInject: [
    { key: 'params', defaultValue: getOrganizationProjectsQueryParams },
  ],
}

export type SpaceNavButtonListHookInterface = {
  spaceList: List<Id>,
  isLoading: boolean,
  isSelected: (projectId: Id) => boolean
}

export default function useComponent(): SpaceNavButtonListHookInterface {
  useRefreshData({}, refreshControllerOptions)
  const {
    spaceList,
    currentScene,
    currentProjectId,
    currentOrganizationId,
    isLoading
  } = useDataProvider()
  const {
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects
  } = useDataPersister()
  const prevCurrentOrganizationId = usePrevious(currentOrganizationId)

  const isSelected = useCallback((projectId: Id): boolean => {
    return currentScene === RouteName.PROJECT && projectId === currentProjectId
  }, [currentScene, currentProjectId])

  useEffect(() => {
    if (prevCurrentOrganizationId !== currentOrganizationId && currentOrganizationId) {
      InteractionManager.runAfterInteractions(() => {
        onFetchChatNotificationSettingsTypes()
        onFetchOrganizationProjects()
      })
    }
  }, [currentOrganizationId, prevCurrentOrganizationId])

  const { slicedItemIds } = useLazyList<Id>(spaceList, currentOrganizationId, 10)

  return {
    spaceList: slicedItemIds,
    isLoading,
    isSelected,
  }
}