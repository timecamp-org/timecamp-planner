import { MouseEventHandler, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onClearOverwatchFilters } from 'models/domain/OverwatchModel/actions';

export type ClearOverwatchFiltersButtonHookInterface = {
  onClick: MouseEventHandler,
}

export default function useComponent(): ClearOverwatchFiltersButtonHookInterface {
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    dispatch(onClearOverwatchFilters())
  }, [dispatch])

  return {
    onClick
  }
}