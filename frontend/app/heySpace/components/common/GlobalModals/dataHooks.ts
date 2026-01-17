import { useCallback } from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectAddUsersToProjectModalProjectId } from 'models/component/AddUsersToProjectModalModel/selectors';
import { selectIsModalOpen, selectModalProperty } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import * as AppModelActions from 'models/domain/AppModel/actions';
import * as AppModelSelectors from 'models/domain/AppModel/selectors';
import { QuickSwitcherState } from 'models/domain/AppModel/types';
import { isAuthenticated } from 'models/domain/CurrentUserModel/selectors';
import { selectOpenedReactivateUserModalId } from 'models/domain/OrganizationsModel/selectors/domain';
import { useDispatch } from 'react-redux';

interface DataProviderHookInterface {
  openedCardDetailsModalId: Id;
  openedReactivateUserModalId: Id;
  openedGuestDeactivateModalUserId: Id;
  addUsersToProjectModalProjectId: Id;
  openedMeetModalId: Id;
  isGuestProfileModalDeactivating: boolean;
  isUserStatusModalOpen: boolean;
  quickSwitcherState: QuickSwitcherState;
  isWorkspaceModalOpen: boolean;
  isCurrentUserAuthenticated: boolean;
}

export const useDataProvider = (): DataProviderHookInterface => ({
  openedCardDetailsModalId: useSelector(AppModelSelectors.selectOpenedCardDetailsModalId),
  openedReactivateUserModalId: useSelector(selectOpenedReactivateUserModalId),
  openedGuestDeactivateModalUserId: useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.GUEST_PROFILE_MODAL, property: 'userId' }),
  ),
  isGuestProfileModalDeactivating: useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.GUEST_PROFILE_MODAL, property: 'isDeactivating' }),
  ),
  openedMeetModalId: useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.HEYSPACE_MEET, property: 'objectId' }),
  ),
  addUsersToProjectModalProjectId: useSelector(selectAddUsersToProjectModalProjectId),
  isUserStatusModalOpen: useSelector((state) => selectIsModalOpen(state, { modalType: ModalType.USER_STATUS_MODAL })),
  quickSwitcherState: useSelector(AppModelSelectors.selectQuickSwitcherState),
  isWorkspaceModalOpen: useSelector(AppModelSelectors.selectIsWorkspaceModalOpen),
  isCurrentUserAuthenticated: useSelector(isAuthenticated),
});

interface DataPersisterHookInterface {
  onToggleQuickSwitcherState: (switcherState: QuickSwitcherState) => void;
  onOpenCardDetailsModal: (cardId: Id) => void;
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  return {
    onToggleQuickSwitcherState: useCallback(
      (switcherState: QuickSwitcherState) => dispatch(AppModelActions.onSetQuickSwitcherState(switcherState)),
      [dispatch],
    ),
    onOpenCardDetailsModal: useCallback(
      (cardId: Id) => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(cardId)),
      [dispatch],
    ),
  };
};
