import { List } from 'immutable'
import { ProjectInterface } from 'models/domain/ProjectsModel/types'
import { BrowseSpacesModalInterface } from './index'
import { useDataPersister, useDataProvider } from './dataHooks'
import { useEffect } from 'react'
import usePrevious from 'common/hooks/usePrevious'
import useLazyList from 'common/hooks/useLazyList'

export type BrowseSpacesModalHookInterface = {
  availableInvisibleSpaces: List<ProjectInterface>,
  availableVisibleSpaces: List<ProjectInterface>,
}

export const useComponent = (props: BrowseSpacesModalInterface): BrowseSpacesModalHookInterface => {
  const prevIsVisible = usePrevious(props.isVisible)
  const {
    availableInvisibleSpaces,
    availableVisibleSpaces,
    currentOrganizationId,
    isFetchAvailableSpacesRequestRepeatable,
  } = useDataProvider()
  const {
    onFetchAvailableSpaces
  } = useDataPersister()

  useEffect(() => {
    const becameVisible = !prevIsVisible && props.isVisible
    if (becameVisible && isFetchAvailableSpacesRequestRepeatable) {
      onFetchAvailableSpaces()
    }
  }, [onFetchAvailableSpaces, props.isVisible, prevIsVisible, isFetchAvailableSpacesRequestRepeatable])

  const { slicedItemIds: slicedInvisibleSpaces } = useLazyList<ProjectInterface>(availableInvisibleSpaces, currentOrganizationId, 5)
  const { slicedItemIds: slicedVisibleSpaces } = useLazyList<ProjectInterface>(availableVisibleSpaces, currentOrganizationId, 5)

  return {
    availableInvisibleSpaces: slicedInvisibleSpaces,
    availableVisibleSpaces: slicedVisibleSpaces,
  }
}