import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { generateConversationId } from 'common/utils/generateCombinedId'
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors'
import { selectViewSettingsIdByTypeAndContainerId } from 'models/domain/ViewSettingsModel/selectors/domain'
import { ViewSettingsViewType, ViewContainerType } from 'models/domain/ViewSettingsModel/types'
import { useDispatch } from 'react-redux'
import { onFetchViewSettings, onCreateBaseViewSettings } from 'models/domain/ViewSettingsModel/actions'
import { useCallback } from 'react'
import { selectIsRequestFinished, selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { getViewSettings } from 'models/domain/RequestModel/constants/requestTypes'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types'
import { generateDefaultTimelineViewSettings } from 'models/domain/OverwatchModel/utils'

type DataProviderHook = {
  projectId: Id,
  viewId: Id,
  filterId: Id,
  isTimelineViewRequestFinished: boolean,
  isTimelineViewRequestRepeatable: boolean,
}

export function useDataProvider(): DataProviderHook {
  const organizationId = useSelector(selectCurrentOrganizationId)
  const currentUserId = useSelector(selectCurrentUserId)
  const conversationId = generateConversationId([currentUserId], organizationId)
  const projectId = useSelector(state => selectProjectIdByConversationId(state, { conversationId }))

  const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.TIMELINE, projectId)

  const isTimelineViewRequestFinished = useSelector(state => selectIsRequestFinished(state, { requestType: getViewSettings, objectId: [ViewSettingsViewType.TIMELINE, projectId] }))
  const isTimelineViewRequestRepeatable = useSelector(state => selectIsRequestRepeatable(state, { requestType: getViewSettings, objectId: [ViewSettingsViewType.TIMELINE, projectId] }))
  const viewId = useSelector(state => selectViewSettingsIdByTypeAndContainerId(state, {
    viewType: ViewSettingsViewType.TIMELINE,
    containerId: projectId,
    containerType: ViewContainerType.PROJECT,
  }))
  return {
    projectId,
    filterId,
    viewId,
    isTimelineViewRequestFinished,
    isTimelineViewRequestRepeatable
  }
}

export type DataPersisterHook = {
  onFetchTimelineViewSettings: VoidFunction,
  onCreateViewSettings: VoidFunction,
};

export function useDataPersister(projectId: Id): DataPersisterHook {
  const dispatch = useDispatch()
  return {
    onFetchTimelineViewSettings: useCallback(() => {
      dispatch(onFetchViewSettings(ViewSettingsViewType.TIMELINE, ViewContainerType.PROJECT, projectId))
    }, [dispatch, projectId]),

    onCreateViewSettings: useCallback(() => {
      dispatch(onCreateBaseViewSettings(ViewSettingsViewType.TIMELINE, ViewContainerType.PROJECT, projectId, generateDefaultTimelineViewSettings()))
    }, [dispatch, projectId]),
  }
}
