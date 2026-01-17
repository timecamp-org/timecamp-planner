import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import UniversalPopover from 'commonComponents/UniversalPopover';
import SecondaryButton from 'components/buttons/SecondaryButton';
import DeactivateUserButton from '../DeactivateUserButton';
import UniversalModal from 'commonComponents/UniversalModal';
import TransferOwnershipButton from '../TransferOwnershipButton';
import ResendInvitationButton from 'commonComponents/ResendInvitationButton';
import GenerateInvitationLinkButton from '../GenerateInvitationLinkButton';
import { MoreVertical } from 'commonComponents/Icons';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';

import DirectInvitationLinkModal from '../DirectInvitationLinkModal';
import ResendInvitationSettingsButtonContent from '../ResendInvitationSettingsButtonContent';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { User } from 'commonComponents/Icons/fontawesome/User';
import { Button } from '@mui/material';
import styled from 'styles/styled';

WorkspaceMemberOptionsButton.propTypes = {
  isOtherUser: PropTypes.bool,
  fullName: PropTypes.string,
  workspaceName: PropTypes.string,
  isUserNotRegistered: PropTypes.bool,
  isUserOrganizationGuest: PropTypes.bool,
  shouldRenderTransferOwnershipButton: PropTypes.bool,
  shouldRenderDeactivateUserButton: PropTypes.bool,
  shouldRenderGuestManipulationOptions: PropTypes.bool,
  onShowGuestProfile: PropTypes.func,
  onSetIsPopoverOpened: PropTypes.func,
  onTransferOwnershipToUse: PropTypes.func,
  onDeactivateUserFromOrganization: PropTypes.func,
  onSetIsDeactivateUserModalVisible: PropTypes.func,
  onSetIsTransferOwnershipModalVisible: PropTypes.func,
  onSetIsDirectInvitationLinkModalVisible: PropTypes.func,
  onToggleDeactivateUserModalVisible: PropTypes.func,
  onToggleTransferOwnershipModalVisible: PropTypes.func,
  onToggleDirectInvitationLinkModalVisible: PropTypes.func,
  onConvertToUser: PropTypes.func,
};

WorkspaceMemberOptionsButton.defaultProps = {
  isOtherUser: false,
  isUserNotRegistered: false,
  isUserOrganizationGuest: false,
  shouldRenderTransferOwnershipButton: false,
  shouldRenderDeactivateUserButton: false,
  shouldRenderGuestManipulationOptions: false,
  fullName: '',
  workspaceName: '',
  onShowGuestProfile: doNothing,
  onSetIsPopoverOpened: doNothing,
  onTransferOwnershipToUse: doNothing,
  onDeactivateUserFromOrganization: doNothing,
  onSetIsDeactivateUserModalVisible: doNothing,
  onSetIsTransferOwnershipModalVisible: doNothing,
  onSetIsDirectInvitationLinkModalVisible: doNothing,
  onToggleDeactivateUserModalVisible: doNothing,
  onToggleTransferOwnershipModalVisible: doNothing,
  onToggleDirectInvitationLinkModalVisible: doNothing,
  onConvertToUser: doNothing,
};

const TargetButton = styled(Button)`
  color: ${({ $isOpen }) => ($isOpen ? 'var(--color-primary-500)' : 'var(--color-gray-900)')};
  &:hover {
    color: var(--color-primary-500);
  }
  &:active {
    color: var(--color-primary-500);
  }
`;

function WorkspaceMemberOptionsButton(props) {
  const { t } = useTranslation();
  return (
    <div>
      <UniversalPopover
        isPopoverOpened={props.isPopoverOpened}
        targetComponent={
          <TargetButton
            disableRipple
            $isOpen={props.isPopoverOpened}
            variant="text"
            onClick={() => props.onSetIsPopoverOpened(!props.isPopoverOpened)}
          >
            <MoreVertical />
          </TargetButton>
        }
        popperComponent={
          <div>
            {props.shouldRenderGuestManipulationOptions && renderAddGuestToSpaceButton(props, t)}
            {props.shouldRenderGuestManipulationOptions && renderConvertToUserButton(props, t)}
            {props.shouldRenderDeactivateUserButton && renderDeactivateUserButton(props)}
            {props.shouldRenderTransferOwnershipButton && renderTransferOwnershipButton(props)}
            {props.isOtherUser && props.isUserNotRegistered && renderResendInvitationButton(props)}
            {props.isOtherUser && props.isUserNotRegistered && renderGenerateInvitationLinkButton(props)}
          </div>
        }
        popperPlacement={'left-start'}
        shouldRenderArrow={false}
        popperModifiers={{
          offset: {
            offset: `15, 5`,
          },
        }}
        popperContentWrapperClassName={styles.popoverContent}
      />
      {renderDeactivateUserModal(props, t)}
      {renderTransferOwnershipModal(props, t)}
      {props.isDirectInvitationLinkModalVisible && renderDirectInvitationLinkModal(props)}
    </div>
  );
}

function renderDeactivateUserModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.isDeactivateUserModalVisible}
      backdropClassName={styles.backdrop}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Disable user')}
      header={t(`Remove {{fullName}} from the {{workspaceName}} workspace?`, {
        fullName: props.fullName,
        workspaceName: props.workspaceName,
      })}
      onModalSave={props.onDeactivateUserFromOrganization}
      onSetIsModalOpen={props.onSetIsDeactivateUserModalVisible}
      shouldRenderCloseIcon={false}
      shouldFocusOnOpen={true}
    >
      {t(
        'All of his projects will be safely drifting in your account and you will be able to bring the user back at anytime.',
      )}
    </UniversalModal>
  );
}

function renderTransferOwnershipModal(props, t) {
  return (
    <UniversalModal
      isModalOpen={props.isTransferOwnershipModalVisible}
      modalBodyClassName={styles.modalBody}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Transfer the ownership')}
      header={t(`Transfer the worspace ownership to {{fullName}}?`, {
        fullName: props.fullName,
      })}
      onModalSave={props.onTransferOwnershipToUser}
      onSetIsModalOpen={props.onSetIsTransferOwnershipModalVisible}
      shouldRenderCloseIcon={false}
      shouldFocusOnOpen={true}
    >
      {t(
        `Are you sure you want to give away your ownership over this workspace to {{fullName}}? You will lose your current access rights to manage the workspace settings .`,
        { fullName: props.fullName },
      )}
    </UniversalModal>
  );
}

function renderDirectInvitationLinkModal(props) {
  return (
    <DirectInvitationLinkModal
      userId={props.userId}
      isModalOpen={props.isDirectInvitationLinkModalVisible}
      onSetIsModalOpen={props.onSetIsDirectInvitationLinkModalVisible}
    />
  );
}

function renderDeactivateUserButton(props) {
  return (
    <DeactivateUserButton
      userId={props.userId}
      className={styles.popoverButton}
      onClick={props.onToggleDeactivateUserModalVisible}
    />
  );
}

function renderAddGuestToSpaceButton(props, t) {
  return (
    <SecondaryButton className={styles.popoverButton} onClick={props.onShowGuestProfile}>
      <Plus className={styles.icon} />
      {t('Add guest to a project')}
    </SecondaryButton>
  );
}

function renderConvertToUserButton(props, t) {
  return (
    <SecondaryButton className={styles.popoverButton} onClick={props.onConvertToUser}>
      <User className={styles.icon} />
      {t('Convert to a user')}
    </SecondaryButton>
  );
}

function renderTransferOwnershipButton(props) {
  return (
    <TransferOwnershipButton
      userId={props.userId}
      onClick={props.onToggleTransferOwnershipModalVisible}
      className={styles.popoverButton}
    />
  );
}

function renderResendInvitationButton(props) {
  return (
    <ResendInvitationButton conversationUserId={props.userId}>
      {(onClick) => (
        <ResendInvitationSettingsButtonContent onResendInvitation={onClick} className={styles.popoverButton} />
      )}
    </ResendInvitationButton>
  );
}

function renderGenerateInvitationLinkButton(props) {
  return (
    <GenerateInvitationLinkButton
      userId={props.userId}
      onClick={props.onToggleDirectInvitationLinkModalVisible}
      className={styles.popoverButton}
    />
  );
}

export default WorkspaceMemberOptionsButton;
