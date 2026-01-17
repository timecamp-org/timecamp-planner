import { useCallback, useEffect } from 'react'
import { BaseSpaceTileHookInterface, BaseTileProps } from '../types'
import { useDispatch } from 'react-redux'
import { onFetchSpaceOrConversationViewData } from 'models/domain/RequestModel/actions'
import { useSelector } from 'common/hooks/useSelector'
import { selectViewSettingsContainerId } from 'models/domain/ViewSettingsModel/selectors/domain'
import { selectHasAccessToProject } from 'models/domain/ProjectsModel/selectors'
import useRefreshData from 'common/hooks/useRefreshData'
import useElementOpen from 'common/hooks/useElementOpen'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import useCompare from 'common/hooks/useCompare'
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'

export interface SpaceBoardTileHookInterface extends BaseSpaceTileHookInterface {
  isFiltersOpen: boolean,
  onToggleFilters: VoidFunction,
  onCloseFilters: VoidFunction,
}

export const useComponent = (props: BaseTileProps): SpaceBoardTileHookInterface => {
  const currentUserId = useSelector(selectCurrentUserId)
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.OVERWATCH_SPACE_TILE, props.spaceId)

  const showArchived = useSelector(state => selectFilterByProperty(state, { filterId, property: 'status' })) === TaskStatusFilterType.ARCHIVED
  const isFilterChanged = useCompare(showArchived)

  const refreshControllerOptions = {
    action: onFetchSpaceOrConversationViewData,
    paramsToInject: [
      { key: 'spaceId' },
      { key: 'filterId', defaultValue: filterId },
      { key: 'force', defaultValue: true },
    ],
    isArgumentsValid: (args) => !!args.spaceId,
  }

  useRefreshData(props, refreshControllerOptions)

  const {
    isOpen: isFiltersOpen,
    onToggleOpen: onToggleFilters,
    onClose: onCloseFilters
  } = useElementOpen()

  const dispatch = useDispatch()

  const fetchSpaceOrConversationViewData = useCallback(
    () => dispatch(onFetchSpaceOrConversationViewData(props.spaceId, filterId)),
    [dispatch, props.spaceId, filterId]
  )


  useEffect(() => {
    fetchSpaceOrConversationViewData()
  }, [])

  useEffect(() => {
    if (isFilterChanged) {
      fetchSpaceOrConversationViewData()
    }
  }, [
    isFilterChanged,
    fetchSpaceOrConversationViewData
  ])

  const objectId = useSelector(state => selectViewSettingsContainerId(state, { viewId: props.viewId }))
  const hasAccessToView = useSelector(state => selectHasAccessToProject(state, { projectId: objectId }))

  return {
    objectId,
    isLoading: false,
    isFiltersOpen,
    onToggleFilters,
    onCloseFilters,
    hasAccessToView,
  }
}