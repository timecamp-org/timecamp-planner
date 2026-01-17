import { ProjectInterface } from 'models/domain/ProjectsModel/types'
import { List } from 'immutable'
import { useCallback, useEffect, useState } from 'react'
import { useDataPersister, useDataProvider } from './dataHooks'
import { BrowseSpacesControllerInterface } from './index'
import fuzzysearch from 'fuzzysearch'

export type BrowseSpacesControllerHookInterface = {
  searchPhrase: string,
  filteredAvailableVisibleSpaces: List<ProjectInterface>,
  filteredAvailableInvisibleSpaces: List<ProjectInterface>,
  filteredArchivedSpaces: List<ProjectInterface>,
  isCurrentUserOrganizationGuestInvitedByLink: boolean,
  onSetSearchValue: (searchPhrase: string) => void,
}

export const useComponent = (props: BrowseSpacesControllerInterface): BrowseSpacesControllerHookInterface => {
  const {
    initialProjectName,
    onUpdateModalProjectName,
  } = props

  const {
    availableVisibleSpaces,
    availableInvisibleSpaces,
    archivedSpaces,
    isFetchArchivedSpacesRequestRepeatable,
    isFetchAvailableSpacesRequestRepeatable,
    isCurrentUserOrganizationGuestInvitedByLink,
  } = useDataProvider()

  const dataPersister = useDataPersister()

  const [searchPhrase, onSetSearchPhrase] = useState(initialProjectName)
  const [filteredAvailableVisibleSpaces, onSetFilteredAvailableVisibleSpaces] = useState(availableVisibleSpaces)
  const [filteredAvailableInvisibleSpaces, onSetFilteredAvailableInvisibleSpaces] = useState(availableInvisibleSpaces)
  const [filteredArchivedSpaces, onSetFilteredArchivedSpaces] = useState(archivedSpaces)

  const getFilteredSpaces = useCallback((searchValue: string) => ({
    filteredAvailableVisibleSpaceList: filterSpaceList(availableVisibleSpaces, searchValue),
    filteredAvailableInvisibleSpaceList: filterSpaceList(availableInvisibleSpaces, searchValue),
    filteredArchivedSpaceList: filterSpaceList(archivedSpaces, searchValue),
  }), [availableVisibleSpaces, availableInvisibleSpaces, archivedSpaces])

  const onSetFilteredSpaces = useCallback((searchValue: string) => {
    const {
      filteredAvailableVisibleSpaceList,
      filteredAvailableInvisibleSpaceList,
      filteredArchivedSpaceList,
    } = getFilteredSpaces(searchValue)

    onSetFilteredAvailableVisibleSpaces(filteredAvailableVisibleSpaceList)
    onSetFilteredAvailableInvisibleSpaces(filteredAvailableInvisibleSpaceList)
    onSetFilteredArchivedSpaces(filteredArchivedSpaceList)
  }, [
    getFilteredSpaces,
    onSetFilteredAvailableVisibleSpaces,
    onSetFilteredAvailableInvisibleSpaces,
    onSetFilteredArchivedSpaces,
  ])

  const onSetSearchValue = useCallback((searchValue: string) => {
    onUpdateModalProjectName(searchValue)
    onSetSearchPhrase(searchValue)
    onSetFilteredSpaces(searchValue)
  }, [
    onUpdateModalProjectName,
    onSetSearchPhrase,
    onSetFilteredSpaces,
  ])

  useEffect(() => {
    if (isFetchAvailableSpacesRequestRepeatable) {
      dataPersister.onFetchAvailableSpaces()
    }

    if (isFetchArchivedSpacesRequestRepeatable) {
      dataPersister.onFetchArchivedSpaces()
    }
  }, [
    dataPersister.onFetchAvailableSpaces,
    isFetchAvailableSpacesRequestRepeatable,
    dataPersister.onFetchArchivedSpaces,
    isFetchArchivedSpacesRequestRepeatable,
  ])

  useEffect(() => {
    onSetFilteredSpaces(searchPhrase)
  }, [
    searchPhrase,
    availableInvisibleSpaces.size,
    availableVisibleSpaces.size,
    archivedSpaces.size,
    onSetFilteredSpaces,
  ])

  return {
    searchPhrase,
    filteredAvailableVisibleSpaces,
    filteredAvailableInvisibleSpaces,
    filteredArchivedSpaces,
    isCurrentUserOrganizationGuestInvitedByLink,
    onSetSearchValue,
  }
}

function filterSpaceList(spaceList: List<ProjectInterface>, value: string): List<ProjectInterface> {
  let result = List<ProjectInterface>()

  spaceList.forEach(space => {
    const { name } = space

    if (fuzzysearch(value.toLowerCase(), name.toLowerCase())) {
      result = result.push(space)
    }
  })

  return result
}
