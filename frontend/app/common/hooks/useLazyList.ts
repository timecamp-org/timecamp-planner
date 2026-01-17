import { List, is } from 'immutable'
import { Id } from 'common/utils/identifier'
import {
  useState, useRef, useCallback, useEffect
} from 'react'
import usePrevious from './usePrevious'

type LazyListHookInterface<T> = {
  slicedItemIds: List<T>,
  hasMore: boolean,
}

export default function useLazyList<T>(
  sourceItemIds: List<T>,
  containerId: Id,
  stepSize: number = 1
): LazyListHookInterface<T> {
  const [slicedItemIds, onSetSlicedItemIds] = useState<List<T>>(sourceItemIds.slice(0, 1) as List<T>)

  const loadTimeout = useRef(null)
  const prevContainerId = usePrevious(containerId)
  const prevSourceItemIds = usePrevious(sourceItemIds)
  const hasMore = hasMoreItems(slicedItemIds, sourceItemIds)

  const sourceItemIdsRef = useRef(sourceItemIds)
  sourceItemIdsRef.current = sourceItemIds;

  const onClearTimeout = useCallback(() => {
    if (loadTimeout.current) {
      clearTimeout(loadTimeout.current)
    }
  }, [])

  const onLoadItemsDynamically = useCallback(() => {
    loadTimeout.current = setTimeout(() => {
      onSetSlicedItemIds(prevState => sourceItemIdsRef.current.slice(0, prevState.size + stepSize) as List<T>)
    },
      0)
  }, [stepSize, onSetSlicedItemIds])

  // componentDidMount
  useEffect(() => {
    onLoadItemsDynamically()
    return onClearTimeout
  }, [])

  // recursive if hasMoretoLoad
  useEffect(() => {
    const hasMoreToLoad = hasMoreItems(slicedItemIds, sourceItemIds)
    if (hasMoreToLoad) {
      onLoadItemsDynamically()
    }
  }, [slicedItemIds, sourceItemIds, onLoadItemsDynamically])

  // componentDidUpdate on container change
  useEffect(() => {
    if (prevContainerId && prevContainerId !== containerId) {
      onClearTimeout()
      onLoadItemsDynamically()
    } else if (prevSourceItemIds && !is(prevSourceItemIds, sourceItemIds)) {
      const itemDiff = Math.abs(prevSourceItemIds.size - sourceItemIds.size)
      const outputDiff = Math.abs(slicedItemIds.size - sourceItemIds.size)
      const isLessItems = prevSourceItemIds.size > sourceItemIds.size;
      
      if ((itemDiff > stepSize || outputDiff > stepSize) && !isLessItems) {
        onClearTimeout()
        onLoadItemsDynamically()
      } else {
        onClearTimeout()
        onSetSlicedItemIds(sourceItemIds)
      }
    }
  }, [
    containerId,
    prevContainerId,
    sourceItemIds,
    prevSourceItemIds,
    stepSize,
    slicedItemIds,
    onLoadItemsDynamically,
    onSetSlicedItemIds,
  ])

  return {
    slicedItemIds,
    hasMore,
  }
}

function hasMoreItems<T>(slicedItemIds: List<T>, sourceItemIds: List<T>): boolean {
  return slicedItemIds.size < sourceItemIds.size
}
