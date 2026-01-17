import { SpaceViewHeaderButtonInterface } from './index'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { onUpdateViewSettings } from 'models/domain/ViewSettingsModel/actions'

export type SpaceViewHeaderButtonHookInterface = {
  onClick: VoidFunction,
}

export const useComponent = (props: SpaceViewHeaderButtonInterface): SpaceViewHeaderButtonHookInterface => {
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    const { type: viewType } = props.tabItem
    dispatch(onUpdateViewSettings(props.viewId, { viewType }))
  }, [dispatch, props.tabItem.type, props.viewId, props.tabItem.type])

  return {
    onClick,
  }
}