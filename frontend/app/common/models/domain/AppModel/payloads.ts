import { ActionResult } from 'models/domain/ActionResultModel';
import { AppVersionInterface, QuickSwitcherState } from 'models/domain/AppModel/types';
import { Id } from 'common/utils/identifier';

export type OnInitPayload = {
  initCoreOnly: boolean;
};

export type OnInitSuccessPayload = {
  actionResult: ActionResult;
};

export type OnInitFailurePayload = {
  actionResult: ActionResult;
};

export type OnSetIsUserIdlePayload = {
  isIdle: boolean;
};

export type OnSetIsPageVisiblePayload = {
  isVisible: boolean;
};

export type OnSetQuickSwitcherStatePayload = {
  switcherState: QuickSwitcherState;
};

export type OnSetIsWorkspaceModalOpenPayload = {
  isOpened: boolean;
};

export type OnSetIsWorkspacesPanelVisiblePayload = {
  isWorkspacesPanelVisible: boolean;
};

export type OnSetOpenedCardDetailsModalIdPayload = {
  cardId: Id;
  isHistorySelfControlled?: boolean;
};

export type OnSetDoUserWantToUseNotSupportedBrowserPayload = {
  decision: boolean;
};

export type OnSetAppHasLoadedPayload = {
  hasLoaded: boolean;
};

export type OnReloadModelsPayload = {
  showLoader: boolean;
  clearModels: boolean;
};

export type OnReceiveNewAppVersionPayload = {
  entity: AppVersionInterface;
};

export type OnSetIsEmbeddedPayload = {
  isEmbedded: boolean;
};

export type OnSetIsOnlinePayload = {
  isOnline: boolean;
}