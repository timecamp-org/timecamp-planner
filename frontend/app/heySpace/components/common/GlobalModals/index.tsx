import { lazy } from 'react';

import isWebOpenOnMobile from 'common/utils/isWebOpenOnMobile';
import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import { ClientNewVersionModalWrapper } from 'commonComponents/ClientNewVersionModalWrapper';
import CurrentOrganizationController from 'commonComponents/CurrentOrganizationController';
import BrowseSpacesModal from 'commonComponents/modals/BrowseSpacesModal/BrowseSpacesModal';
import PostInvitationModal from 'commonComponents/modals/PostInvitationModal';
import QuickSwitcherModal from 'commonComponents/QuickSwitcherModal';
import ResendInvitationConfirmationModal from 'commonComponents/ResendInvitationConfirmationModal';
import UserInOrganizationController from 'commonComponents/UserInOrganizationController';
import IntegrationsCompletedModal from 'components/extensions/IntegrationsCompletedModal';
import MeetModal from 'components/meet/MeetModal';
import UserStatusModal from 'components/menu/currentUserSettings/UserStatusModal';
import TeamMenuModal from 'components/menu/team/TeamMenuModal';
import { AddFirstProjectModal } from 'components/projects/AddFirstProjectModal/AddFirstProjectModal';
import AddProjectModal from 'components/projects/AddProjectModal/AddProjectModal';
import AddUsersToProjectModal from 'components/projects/AddUsersToProjectModal';
import GuestProfileModal from 'components/settings/workspaceSettings/GuestProfileModal';
import ReactivateUserModal from 'components/settings/workspaceSettings/ReactivateUserModal';
import AddCardModal from 'components/tasks/AddCardModal';
import NewWorkspaceModal from 'components/workspace/NewWorkspaceModal';
import { QuickSwitcherState } from 'models/domain/AppModel/types';

import { TimecampApiKeyModal } from '../../tasks/TimecampTimer/ApiKeyModal/TimecampApiKeyModal';

import useComponent from './hook';

const CardDetailsModal = lazy(() => import('components/tasks/CardDetailsModal'));
const ImageGalleryController = lazy(() => import('commonComponents/ImageGalleryController'));

const GlobalModals = () => {
  const hook = useComponent();

  if (isWebOpenOnMobile() || !hook.isCurrentUserAuthenticated) {
    return null;
  }

  return (
    <>
      <UserInOrganizationController />
      <CurrentOrganizationController />

      <SuspenseComponent disableLoader>
        <CardDetailsModal taskId={hook.openedCardDetailsModalId} isModalOpen={hook.isCardDetailsModalOpen} />
        <ImageGalleryController />
      </SuspenseComponent>

      {hook.openedReactivateUserModalId && hook.isCurrentUserAuthenticated ? (
        <ReactivateUserModal userId={hook.openedReactivateUserModalId} />
      ) : null}

      {hook.addUsersToProjectModalProjectId && hook.isCurrentUserAuthenticated ? (
        <AddUsersToProjectModal projectId={hook.addUsersToProjectModalProjectId} />
      ) : null}

      {hook.isGuestProfileModalOpen && (
        <GuestProfileModal
          userId={hook.openedGuestDeactivateModalUserId}
          isModalVisible={hook.isGuestProfileModalOpen}
          isDeactivating={hook.isGuestProfileModalDeactivating}
        />
      )}

      <UserStatusModal isModalVisible={hook.isUserStatusModalOpen} />

      {hook.quickSwitcherState !== QuickSwitcherState.CLOSED && (
        <QuickSwitcherModal quickSwitcherState={hook.quickSwitcherState} />
      )}

      {hook.isWorkspaceModalOpen && (
        <NewWorkspaceModal isWorkspaceModalOpen={hook.isWorkspaceModalOpen && hook.isCurrentUserAuthenticated} />
      )}
      <IntegrationsCompletedModal />
      <PostInvitationModal />

      <ResendInvitationConfirmationModal />

      <AddCardModal />

      <ClientNewVersionModalWrapper />

      {hook.openedMeetModalId && <MeetModal />}

      <TeamMenuModal isInvitingPeople />

      <AddProjectModal />

      <AddFirstProjectModal />

      <TimecampApiKeyModal />
      <BrowseSpacesModal />
    </>
  );
};

export default GlobalModals;
