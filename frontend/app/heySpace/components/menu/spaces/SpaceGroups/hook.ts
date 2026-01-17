import { List } from 'immutable'
import { Id } from 'common/utils/identifier'
import { useDataProvider, useDataPersister } from './dataHooks'
import { useEffect } from 'react'
import usePrevious from 'common/hooks/usePrevious'
import useRefreshData from 'common/hooks/useRefreshData'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'
import { getOrganizationProjectsWithUnreadMessagesQueryParams } from 'models/domain/ProjectsModel/requestQueryParams'

export type SpaceGroupsHookInterface = {
  projectGroupIds: List<Id>,
  isRequestFinished: boolean,
}

const refreshControllerOptions = {
  action: ProjectsModelActions.onGetOrganizationProjects,
  paramsToInject: [
    { key: 'params', defaultValue: getOrganizationProjectsWithUnreadMessagesQueryParams },
  ],
}

export default function useComponent(): SpaceGroupsHookInterface {
  useRefreshData({}, refreshControllerOptions)

  const {
    projectGroupIds,
    currentOrganizationId,
    isNotificationSettingsRequestRepeatable,
    isOrganizationProjectsRequestRepeatable,
    isProjectStructureRequestRepeatable,
    isRequestFinished,
  } = useDataProvider()

  const {
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects,
    onFetchPersonalProjectStructure,
  } = useDataPersister()

  const prevCurrentOrganizationId = usePrevious(currentOrganizationId)

  useEffect(() => {
    if (prevCurrentOrganizationId !== currentOrganizationId) {
      if (isNotificationSettingsRequestRepeatable) {
        onFetchChatNotificationSettingsTypes()
      }
      if (isOrganizationProjectsRequestRepeatable) {
        onFetchOrganizationProjects()
      }
      if (isProjectStructureRequestRepeatable) {
        onFetchPersonalProjectStructure()
      }
    }
  }, [
    currentOrganizationId,
    prevCurrentOrganizationId,
    isNotificationSettingsRequestRepeatable,
    isOrganizationProjectsRequestRepeatable,
    isProjectStructureRequestRepeatable,
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects,
    onFetchPersonalProjectStructure,
  ])

  return {
    projectGroupIds,
    isRequestFinished,
  }
}
