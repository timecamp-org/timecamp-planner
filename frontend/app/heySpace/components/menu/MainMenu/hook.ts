import { MouseEventHandler } from 'react';

import { Id } from 'common/utils/identifier';
import { BadgeContainerType } from 'commonComponents/Badge/types';

import { useDataProvider } from './dataHooks';

export type MainMenuHookInterface = {
  isCurrentUserOrganizationGuestInvitedByLink: boolean;
  shouldRenderWorkspacesPanel: boolean;
  hasAccessToProjectGroups: boolean;
  isEmbedded: boolean;
};

export type BadgeRefInterface = {
  objectId: Id;
  objectType: BadgeContainerType;
  badgeComponentRef: HTMLDivElement;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function useComponent(): MainMenuHookInterface {
  const {
    isCurrentUserOrganizationGuestInvitedByLink,
    isWorkspacesPanelVisible,
    hasAccessToProjectGroups,
    isEmbedded,
  } = useDataProvider();

  const shouldRenderWorkspacesPanel = isWorkspacesPanelVisible;

  return {
    isCurrentUserOrganizationGuestInvitedByLink,
    shouldRenderWorkspacesPanel,
    hasAccessToProjectGroups,
    isEmbedded,
  };
}
