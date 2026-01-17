import { useSelector } from 'common/hooks/useSelector'
import { selectViewSettingsViewType } from 'models/domain/ViewSettingsModel/selectors/domain'
import { ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types'
import { Id } from 'common/utils/identifier'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { onDeleteViewSettings } from 'models/domain/ViewSettingsModel/actions'

export const useOverwatchViewType = (viewId: Id): ViewSettingsViewType => {
  return useSelector(state => selectViewSettingsViewType(state, { viewId }))
}

export const useOnDeleteView = (viewId: Id) => {
  const dispatch = useDispatch()
  const onDeleteView = useCallback(
    () => dispatch(onDeleteViewSettings(viewId)),
    [dispatch, viewId]
  )
  return onDeleteView
}