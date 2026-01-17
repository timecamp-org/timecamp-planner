import * as Constants from './constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';
import { fromJS } from 'immutable';
import { AppState, QuickSwitcherState } from 'models/domain/AppModel/types';
import { Reducer } from 'redux';
import { PayloadAction } from 'common/types';

const initialState: AppState = fromJS({
  hasLoaded: false,
  hasError: false,
  isMenuOpenedOnMobile: false,

  openedCardDetailsModalId: null,
  quickSwitcherState: QuickSwitcherState.CLOSED,
  isWorkspaceModalOpen: false,
  isUserIdle: false,
  isPageVisible: true,
  doUserWantToUseNotSupportedBrowser: false,
  isWorkspacesPanelVisible: true,
  isEmbedded: false,
  isOnline: true
  
});

const reducer: Reducer<AppState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case Constants.onInit:
      return state.set('hasLoaded', false);
    case Constants.onInitSuccess:
      return state.set('hasLoaded', true);
    case Constants.onInitFailure:
      return state.set('hasLoaded', true).set('hasError', true);
    case Constants.onSetOpenedCardDetailsModalId:
      return state.set('openedCardDetailsModalId', action.payload.cardId);
    case Constants.onSetIsUserIdle:
      return state.set('isUserIdle', action.payload.isIdle);
    case Constants.onSetIsPageVisible:
      return state.set('isPageVisible', action.payload.isVisible);
    case Constants.onSetQuickSwitcherState:
      return state.set('quickSwitcherState', action.payload.switcherState);
    case Constants.onSetIsWorkspaceModalOpen:
      return state.set('isWorkspaceModalOpen', action.payload.isOpened);
    case Constants.onSetDoUserWantToUseNotSupportedBrowser:
      return state.set('doUserWantToUseNotSupportedBrowser', action.payload.decision);
    case Constants.onSetAppHasLoaded:
      return state.set('hasLoaded', action.payload.hasLoaded);
    case Constants.onSetIsWorkspacesPanelVisible:
      return state.set('isWorkspacesPanelVisible', action.payload.isWorkspacesPanelVisible);
    case Constants.onSetIsEmbedded:
      return state.set('isEmbedded', action.payload.isEmbedded);
    case CurrentUserConstants.onSignOutSuccess:
      return state.set('hasLoaded', true).set('openedCardDetailsModalId', null);
    case Constants.onSetIsOnline:
      return state.set('isOnline', action.payload.isOnline)
    default:
      return state;
  }
};

export default reducer;
