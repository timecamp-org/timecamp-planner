import { Id } from 'common/utils/identifier'
import { OverwatchViewTileInterface } from './index'
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectViewSettingsContainerId
} from 'models/domain/ViewSettingsModel/selectors/domain'
import { selectHasAccessToProject } from 'models/domain/ProjectsModel/selectors'

export type DataProviderHookInterface = {
  objectId: Id,
  isLoading: boolean,
  hasAccessToView: boolean,
}

export const useDataProvider = (
  props: OverwatchViewTileInterface,
  viewType: ViewSettingsViewType,
): DataProviderHookInterface => {
  switch (viewType) {
    case ViewSettingsViewType.CHAT:
    case ViewSettingsViewType.BOARD: {
      const objectId = useSelector(state => selectViewSettingsContainerId(state, { viewId: props.viewId }))

      const containerId = useSelector(state => selectViewSettingsContainerId(state, { viewId: props.viewId }))
      const hasAccess = useSelector(state => selectHasAccessToProject(state, { projectId: containerId }))

      return {
        objectId,
        isLoading: false,
        hasAccessToView: hasAccess,
      }
    }
    default: {
      throw new Error(`Unsupported viewType: ${viewType}`)
    }
  }
}