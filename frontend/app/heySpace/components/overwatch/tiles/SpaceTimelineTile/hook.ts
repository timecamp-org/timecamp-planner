import { BaseSpaceTileHookInterface, BaseTileProps } from '../types'
import { useEffect, useState } from 'react'
import { useDataProvider } from './dataHooks'
import usePrevious from 'common/hooks/usePrevious'

export const useComponent = (props: BaseTileProps): BaseSpaceTileHookInterface => {
  const [loadingCount, onSetLoadingCount] = useState(0)

  const { objectId, isLoading, hasAccessToView } = useDataProvider(props)

  const previousIsLoading = usePrevious<boolean>(isLoading)

  useEffect(() => {
    if (!previousIsLoading && isLoading) {
      onSetLoadingCount(loadingCount + 1)
    }
  }, [isLoading, previousIsLoading, loadingCount])

  return {
    objectId,
    isLoading: isLoading && loadingCount === 1,
    hasAccessToView,
  }
}
