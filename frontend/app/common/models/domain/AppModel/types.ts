import { ImmutableMap } from 'common/types'

export enum QuickSwitcherState {
  CLOSED = 'closed',
  CHATS = 'chats',
  CARDS = 'cards',
}

export enum AppPlatform {
  WEB = 'web',
}

export interface AppState extends ImmutableMap<string, any> {
  hasLoaded: boolean,
  hasError: boolean,
  isMenuOpenedOnMobile: boolean,

  openedCardDetailsModalId: boolean,
  quickSwitcherState: QuickSwitcherState,
  isWorkspaceModalOpen: boolean,
  isUserIdle: boolean,
  isPageVisible: boolean,
  doUserWantToUseNotSupportedBrowser: boolean,
  isWorkspacesPanelVisible: boolean,
  isOnline: boolean
}

export type AppVersionInterface = {
  appVersionCode: string,
  appPlatform: AppPlatform,
}
