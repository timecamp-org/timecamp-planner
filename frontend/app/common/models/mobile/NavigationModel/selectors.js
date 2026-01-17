import { createSelector } from 'reselect'
import { domain as domainName } from './constants'

export const selectDomain = (state) => state.get(domainName)

export const selectCurrentScene = createSelector(
  selectDomain,
  (domain) => domain.get('currentScene'),
)

export const selectCurrentProjectId = createSelector(
  selectDomain,
  (domain) => domain.get('currentProjectId'),
)

export const selectCurrentConversationId = createSelector(
  selectDomain,
  (domain) => domain.get('currentConversationId'),
)

export const selectIsDrawerNavigationOpened = createSelector(
  selectDomain,
  (domain) => domain.get('isDrawerNavigationOpened'),
)

export const selectIsCardMoreOptionsActionSheetOpened = createSelector(
  selectDomain,
  (domain) => domain.get('isCardMoreOptionsActionSheetOpened'),
)

export const selectIsNavigationStateLoaded = createSelector(
  selectDomain,
  (domain) => domain.get('isNavigationStateLoaded'),
)
