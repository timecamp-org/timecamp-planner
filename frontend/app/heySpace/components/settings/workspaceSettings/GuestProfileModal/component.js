import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import { List } from 'immutable';

import UniversalModal from 'commonComponents/UniversalModal';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import LoadingDots from 'commonComponents/LoadingDots';
import SingleSpacePicker from 'components/projects/SingleSpacePicker';
import UserAvatar from 'components/settings/userProfile/UserAvatar';
import PersonFullNameAndEmail from 'components/person/PersonFullNameAndEmail';
import ProjectName from 'components/projects/projectName/ProjectName';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';

GuestProfileModal.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  fullName: PropTypes.string,
  isWorkspaceGuestSeatsAvailable: PropTypes.bool.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
  error: PropTypes.string,
  selectedSpaceId: PropTypes.string,
  isUserActive: PropTypes.bool,
  canGuestsBeInvitedToWorkspace: PropTypes.bool,
  isDeactivating: PropTypes.bool,
  isConvertingToGuest: PropTypes.bool,
  spaceIds: ImmutablePropTypes.list,

  onSetIsModalVisible: PropTypes.func.isRequired,
  onSelectedSpacesChange: PropTypes.func.isRequired,
  onConvertToUser: PropTypes.func.isRequired,
  onRemoveFromSpace: PropTypes.func.isRequired,
  onRemoveFromAllSpaces: PropTypes.func.isRequired,
  onConfirmRemoveFromAllSpaces: PropTypes.func.isRequired,
  onSelectedSpaceChange: PropTypes.func.isRequired,
  onAddToSpace: PropTypes.func.isRequired,
  onReactivateUserInWorkspace: PropTypes.func.isRequired,
  onCancelDeactivate: PropTypes.func.isRequired,
  onSetListEndRef: PropTypes.func.isRequired,
  onConvertToGuest: PropTypes.func.isRequired,
};

GuestProfileModal.defaultProps = {
  isWorkspaceGuestSeatsAvailable: true,
  isModalVisible: false,
  isUserActive: false,
  canGuestsBeInvitedToWorkspace: false,
  isDeactivating: false,
  isConvertingToGuest: false,
  fullName: '',
  spaceIds: new List(),

  onSetIsModalVisible: doNothing,
  onSelectedSpacesChange: doNothing,
  onConvertToUser: doNothing,
  onRemoveFromSpace: doNothing,
  onRemoveFromAllSpaces: doNothing,
  onConfirmRemoveFromAllSpaces: doNothing,
  onSelectedSpaceChange: doNothing,
  onAddToSpace: doNothing,
  onReactivateUserInWorkspace: doNothing,
  onCancelDeactivate: doNothing,
  onSetListEndRef: doNothing,
  onConvertToGuest: doNothing,
};

function GuestProfileModal(props) {
  const { t } = useTranslation();

  return (
    <UniversalModal
      innerModalDialogClassName={styles.modalDialog}
      modalBodyClassName={styles.modalBody}
      headerClassName={styles.modalHeader}
      isModalOpen={props.isModalVisible}
      backdropClassName={styles.backdrop}
      onSetIsModalOpen={props.onSetIsModalVisible}
      shouldRenderCloseIcon={true}
      shouldRenderCancelButton={false}
      shouldRenderSaveButton={false}
      shouldRenderModalFooter={false}
      shouldFocusOnOpen={true}
    >
      {props.isModalVisible && renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  return (
    <div className={props.isDeactivating ? styles.modalDeactivationgContent : styles.modalContent}>
      {renderPersonInfo()}
      {props.isDeactivating ? renderCaseDeactivating() : renderCaseEditing()}
    </div>
  );

  function renderPersonInfo() {
    const shouldRenderConvertToUserButton = !props.isDeactivating && props.isUserActive && !props.isConvertingToGuest;
    return (
      <div className={styles.personInfo}>
        <UserAvatar userId={props.userId} className={styles.avatar} />
        <div className={styles.infoWithButton}>
          <PersonFullNameAndEmail
            userId={props.userId}
            firstItemClassName={styles.fullName}
            secondItemClassName={styles.email}
          />
          {shouldRenderConvertToUserButton && renderConvertToUserButton(props, t)}
        </div>
      </div>
    );
  }

  function renderCaseDeactivating() {
    return (
      <>
        <div className={styles.deactivateText}>
          {t(
            'Are you sure you want to remove {{fullName}} from all the projects? This will block his access to your worspace, however won’t delete his account.',
            { fullName: props.fullName }
          )}
        </div>
        <div className={styles.footer}>
          <SecondaryButton onClick={props.onConfirmRemoveFromAllSpaces}>{t('Remove guest')}</SecondaryButton>
          <PrimaryButton className={styles.rightPrimaryButton} onClick={props.onCancelDeactivate}>
            {t('Cancel')}
          </PrimaryButton>
        </div>
      </>
    );
  }

  function renderCaseEditing() {
    const shouldRenderRemoveFromAllSpaces = props.spaceIds.size > 0 && props.isUserActive && !props.isConvertingToGuest;
    return (
      <>
        <div className={styles.title}>{t('Guest in projects:')}</div>
        {renderAddToNewSpaceRow()}
        {renderSpaceItems()}
        <div className={styles.actionButtons}>
          {shouldRenderRemoveFromAllSpaces && renderRemoveFromAllSpaces(props, t)}
          {!props.isUserActive && renderReactivateUserButton(props, t)}
          {props.isConvertingToGuest && renderConvertToGuestButton(props, t)}
        </div>
        {props.isInviting && renderLoadingDots()}
      </>
    );
  }

  function renderAddToNewSpaceRow() {
    return (
      <div className={styles.addToNewSpaceRow}>
        <SingleSpacePicker
          excludedProjectIds={props.spaceIds}
          selectedSpaceId={props.selectedSpaceId}
          onSelectedSpaceChange={props.onSelectedSpaceChange}
        />
        {props.selectedSpaceId && renderAddToNewSpaceButton()}
      </div>
    );
  }

  function renderAddToNewSpaceButton() {
    return (
      <TooltipedDisabledElement
        isDisabled={!props.canGuestsBeInvitedToWorkspace}
        className={styles.right}
        message={t(
          'You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.'
        )}
      >
        <SecondaryButton
          isDisabled={!props.canGuestsBeInvitedToWorkspace}
          onClick={props.onAddToSpace}
          className={styles.rightSecondaryButton}
        >
          {t('add')}
        </SecondaryButton>
      </TooltipedDisabledElement>
    );
  }

  function renderSpaceItems() {
    return (
      <div className={styles.spaceList}>
        {props.spaceIds.map(renderSpaceItem)}
        <div ref={props.onSetListEndRef} />
      </div>
    );
  }

  function renderSpaceItem(projectId) {
    return (
      <div className={styles.spaceItem} key={projectId}>
        <ProjectName projectId={projectId} maxLength={20} />
        <SecondaryButton className={styles.rightSecondaryButton} onClick={() => props.onRemoveFromSpace(projectId)}>
          {t('remove')}
        </SecondaryButton>
      </div>
    );
  }
}

function renderConvertToUserButton(props, t) {
  return (
    <PrimaryButton className={styles.leftPrimaryButton} onClick={props.onConvertToUser}>
      {t('Convert to a user')}
    </PrimaryButton>
  );
}

function renderRemoveFromAllSpaces(props, t) {
  return (
    <SecondaryButton className={styles.leftSecondaryButton} onClick={props.onRemoveFromAllSpaces}>
      {t('Remove Guest form all the projects')}
    </SecondaryButton>
  );
}

function renderReactivateUserButton(props, t) {
  return (
    <TooltipedDisabledElement
      isDisabled={props.spaceIds.size === 0}
      className={styles.right}
      message={t('You need to assign user to a project first')}
    >
      <PrimaryButton
        isDisabled={props.spaceIds.size === 0}
        className={styles.rightPrimaryButton}
        onClick={props.onReactivateUserInWorkspace}
      >
        {t('Reactivate')}
      </PrimaryButton>
    </TooltipedDisabledElement>
  );
}

function renderConvertToGuestButton(props, t) {
  return (
    <TooltipedDisabledElement
      isDisabled={props.spaceIds.size === 0}
      className={styles.right}
      message={t('You need to assign user to a project first')}
    >
      <PrimaryButton
        isDisabled={props.spaceIds.size === 0}
        className={styles.rightPrimaryButton}
        onClick={props.onConvertToGuest}
      >
        {t('Convert to a guest')}
      </PrimaryButton>
    </TooltipedDisabledElement>
  );
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} />
    </div>
  );
}

export default GuestProfileModal;
