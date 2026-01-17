import { useSelector } from 'common/hooks/useSelector';
import {
  selectIsEmbedded,
  selectIsWorkspacesPanelVisible,
} from 'common/models/domain/AppModel/selectors';
import { selectIsCurrentUserOrganizationGuestInvitedByLink } from 'models/domain/ChatWithMeModel/selectors';

type DataProviderHook = {
  isWorkspacesPanelVisible: boolean;
  isCurrentUserOrganizationGuestInvitedByLink: boolean;
  hasAccessToProjectGroups: boolean;
  isEmbedded: boolean;
};

export function useDataProvider(): DataProviderHook {
  return {
    isWorkspacesPanelVisible: useSelector(selectIsWorkspacesPanelVisible),
    isEmbedded: useSelector(selectIsEmbedded),
    isCurrentUserOrganizationGuestInvitedByLink: useSelector(
      selectIsCurrentUserOrganizationGuestInvitedByLink
    ),
    hasAccessToProjectGroups: true,
  };
}
