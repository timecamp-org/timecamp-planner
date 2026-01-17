import * as constants from './constants';
import { createSelector } from 'reselect';
import { ApplicationState } from 'common/types';
import { AppState, QuickSwitcherState } from 'models/domain/AppModel/types';
import { Id } from '@hello-pangea/dnd';

export const selectAppDomain = (state: ApplicationState): AppState => state.get(constants.domain);

export const hasLoaded = createSelector(selectAppDomain, (domain): boolean => domain.get('hasLoaded'));

export const hasError = createSelector(selectAppDomain, (domain): boolean => domain.get('hasError'));

export const selectIsWorkspacesPanelVisible = createSelector(selectAppDomain, (domain): boolean =>
  domain.get('isWorkspacesPanelVisible')
);

export const selectOpenedCardDetailsModalId = createSelector(
  selectAppDomain,
  (domain): Id => domain.get('openedCardDetailsModalId')
);

export const selectIsUserIdle = createSelector(selectAppDomain, (domain): boolean => domain.get('isUserIdle'));

export const selectQuickSwitcherState = createSelector(
  selectAppDomain,
  (domain): QuickSwitcherState => domain.get('quickSwitcherState')
);

export const selectIsWorkspaceModalOpen = createSelector(selectAppDomain, (domain): boolean =>
  domain.get('isWorkspaceModalOpen')
);

export const selectIsPageVisible = createSelector(selectAppDomain, (domain): boolean => domain.get('isPageVisible'));

export const selectIsEmbedded = createSelector(selectAppDomain, (domain): boolean => domain.get('isEmbedded'));

export const selectDoUserWantToUseNotSupportedBrowser = createSelector(selectAppDomain, (domain): boolean =>
  domain.get('doUserWantToUseNotSupportedBrowser')
);

export const isOnline = createSelector(selectAppDomain, (domain) : boolean=> domain.get('isOnline'))