import { createSelector } from 'reselect'
import { domain as domainName } from '../constants'

export const searchDomain = (state) => state.get(domainName)

export const selectTaskSearch = createSelector(
  searchDomain,
  (domain) => domain.get('taskSearch'),
)

export const selectTaskSearchResults = createSelector(
  selectTaskSearch,
  (taskSearch) => taskSearch.get('results'),
)

export const selectIsTaskSearchLoaded = createSelector(
  selectTaskSearch,
  (taskSearch) => taskSearch.get('isLoaded'),
)

export const selectTaskSearchValue = createSelector(
  selectTaskSearch,
  (taskSearch) => taskSearch.get('value'),
)

export const selectIsSearchingTasks = createSelector(
  selectTaskSearchValue,
  (value) => (value ? value.length > 0 : false),
)

export const selectProjectSearch = createSelector(
  searchDomain,
  (domain) => domain.get('projectSearch'),
)

export const selectProjectSearchResults = createSelector(
  selectProjectSearch,
  (projectSearch) => projectSearch.get('results'),
)

export const selectIsProjectSearchLoaded = createSelector(
  selectProjectSearch,
  (projectSearch) => projectSearch.get('isLoaded'),
)

export const selectUserSearch = createSelector(
  searchDomain,
  (domain) => domain.get('userSearch'),
)

export const selectUsersSearchResults = createSelector(
  selectUserSearch,
  (userSearch) => userSearch.get('results'),
)

export const selectIsUserSearchLoaded = createSelector(
  selectUserSearch,
  (userSearch) => userSearch.get('isLoaded'),
)

export const selectFileSearch = createSelector(
  searchDomain,
  (domain) =>domain.get('fileSearch')  
)  

export const selectFileSearchValue = createSelector(
  selectFileSearch,
  (fileSearch) => fileSearch.get('value'),
)
