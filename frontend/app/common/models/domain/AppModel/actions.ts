import * as constants from './constants';
import { PayloadAction } from 'common/types';
import { Action, action } from 'typesafe-actions';
import { ActionResult } from 'models/domain/ActionResultModel';
import { AppVersionInterface, QuickSwitcherState } from 'models/domain/AppModel/types';
import { Id } from 'common/utils/identifier';
import { EntityInterface } from 'models/domain/EntityModel/types';
import * as payloads from './payloads';

export function onInit(initCoreOnly: boolean = false): PayloadAction<payloads.OnInitPayload> {
  return action(constants.onInit, { initCoreOnly });
}

export function onInitSuccess(actionResult: ActionResult): PayloadAction<payloads.OnInitSuccessPayload> {
  return action(constants.onInitSuccess, { actionResult });
}

export function onInitFailure(actionResult: ActionResult): PayloadAction<payloads.OnInitFailurePayload> {
  return action(constants.onInitFailure, { actionResult });
}

export function onInitModels(): Action {
  return action(constants.onInitModels);
}

export function onInitBackgroundResources(): Action {
  return action(constants.onInitBackgroundResources);
}

export function onSetIsUserIdle(isIdle: boolean): PayloadAction<payloads.OnSetIsUserIdlePayload> {
  return action(constants.onSetIsUserIdle, { isIdle });
}

export function onSetIsPageVisible(isVisible: boolean): PayloadAction<payloads.OnSetIsPageVisiblePayload> {
  return action(constants.onSetIsPageVisible, { isVisible });
}

export function onSetQuickSwitcherState(
  switcherState: QuickSwitcherState
): PayloadAction<payloads.OnSetQuickSwitcherStatePayload> {
  return action(constants.onSetQuickSwitcherState, { switcherState });
}

export function onSetIsWorkspaceModalOpen(isOpened: boolean): PayloadAction<payloads.OnSetIsWorkspaceModalOpenPayload> {
  return action(constants.onSetIsWorkspaceModalOpen, { isOpened });
}
export function onSetIsWorkspacesPanelVisible(
  isWorkspacesPanelVisible: boolean
): PayloadAction<payloads.OnSetIsWorkspacesPanelVisiblePayload> {
  return action(constants.onSetIsWorkspacesPanelVisible, { isWorkspacesPanelVisible });
}

export function onSetOpenedCardDetailsModalId(
  cardId: Id,
  isHistorySelfControlled: boolean = false
): PayloadAction<payloads.OnSetOpenedCardDetailsModalIdPayload> {
  return action(constants.onSetOpenedCardDetailsModalId, { cardId, isHistorySelfControlled });
}

export function onSetDoUserWantToUseNotSupportedBrowser(
  decision: boolean
): PayloadAction<payloads.OnSetDoUserWantToUseNotSupportedBrowserPayload> {
  return action(constants.onSetDoUserWantToUseNotSupportedBrowser, { decision });
}

export function onSetAppHasLoaded(hasLoaded: boolean): PayloadAction<payloads.OnSetAppHasLoadedPayload> {
  return action(constants.onSetAppHasLoaded, { hasLoaded });
}

export function onReloadModels(
  showLoader: boolean = true,
  clearModels: boolean = true
): PayloadAction<payloads.OnReloadModelsPayload> {
  return action(constants.onReloadModels, {
    showLoader,
    clearModels,
  });
}

export function onCleanModels(): Action {
  return action(constants.onCleanModels);
}

export function onReceiveNewAppVersion(
  wrappedEntity: EntityInterface<AppVersionInterface>
): PayloadAction<payloads.OnReceiveNewAppVersionPayload> {
  return action(constants.onReceiveNewAppVersion, { entity: wrappedEntity.body });
}

export function onSetIsEmbedded(isEmbedded: boolean): PayloadAction<payloads.OnSetIsEmbeddedPayload> {
  return action(constants.onSetIsEmbedded, { isEmbedded });
}

export function onSetIsOnline(isOnline: boolean): PayloadAction<payloads.OnSetIsOnlinePayload> {
  return action(constants.onSetIsOnline, {isOnline})
}