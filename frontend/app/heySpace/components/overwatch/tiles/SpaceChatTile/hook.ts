import { BaseSpaceTileHookInterface, BaseTileProps } from '../types'
import { useSelector } from 'common/hooks/useSelector'
import { selectViewSettingsContainerId } from 'models/domain/ViewSettingsModel/selectors/domain'
import { selectHasAccessToProject } from 'models/domain/ProjectsModel/selectors'

export const useComponent = (props: BaseTileProps): BaseSpaceTileHookInterface => {

  const objectId = useSelector(state => selectViewSettingsContainerId(state, { viewId: props.viewId }))
  const hasAccessToView = useSelector(state => selectHasAccessToProject(state, { projectId: objectId }))

  return {
    objectId,
    isLoading: false,
    hasAccessToView,
  }
}