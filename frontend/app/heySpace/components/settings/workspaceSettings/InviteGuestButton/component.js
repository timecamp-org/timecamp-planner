import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import UniversalModal from 'commonComponents/UniversalModal';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import MultiInviteInput from 'commonComponents/MultiInviteInput';
import LoadingDots from 'commonComponents/LoadingDots';
import SpacePicker from 'components/projects/SpacePicker';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import { ADDITIONAL_GUEST_SEATS } from 'models/domain/SubscriptionLimitsModel/constants';
import styles from './styles.css';

InviteGuestButton.propTypes = {
  className: PropTypes.string,
  isModalVisible: PropTypes.bool.isRequired,
  isInviting: PropTypes.bool.isRequired,
  isWorkspaceGuestSeatsAvailable: PropTypes.bool.isRequired,
  isGuestsExceeded: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  guestSeatCount: PropTypes.number,
  occupiedGuestSeats: PropTypes.number,
  error: PropTypes.string,
  tooltipMessage: PropTypes.string,

  onSetIsModalVisible: PropTypes.func.isRequired,
  onSelectedEmailsChange: PropTypes.func.isRequired,
  onSelectedSpacesChange: PropTypes.func.isRequired,
};

InviteGuestButton.defaultProps = {
  isModalVisible: true,
  isInviting: false,
  isWorkspaceGuestSeatsAvailable: true,
  isGuestsExceeded: false,
  isSubmitDisabled: false,
  guestSeatCount: 0,
  occupiedGuestSeats: 0,

  onSetIsModalVisible: doNothing,
  onSelectedEmailsChange: doNothing,
  onSelectedSpacesChange: doNothing,
};

function InviteGuestButton(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className}>
      <TooltipedDisabledElement
        message={t(
          `You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.`
        )}
        isDisabled={!props.isWorkspaceGuestSeatsAvailable}
      >
        <SecondaryButton
          isDisabled={!props.isWorkspaceGuestSeatsAvailable}
          onClick={() => props.onSetIsModalVisible(true)}
        >
          {t('Invite guest')}
        </SecondaryButton>
      </TooltipedDisabledElement>
      {renderModal(props, t)}
    </div>
  );
}

function renderModal(props, t) {
  return (
    <UniversalModal
      innerModalDialogClassName={styles.modalDialog}
      modalBodyClassName={styles.modalBody}
      headerClassName={styles.modalHeader}
      header={t('Invite guests')}
      isModalOpen={props.isModalVisible}
      backdropClassName={styles.backdrop}
      onSetIsModalOpen={props.onSetIsModalVisible}
      shouldRenderCloseIcon={true}
      shouldRenderCancelButton={false}
      shouldRenderSaveButton={false}
      shouldRenderModalFooter={false}
      shouldFocusOnOpen={true}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  return (
    <>
      <div className={styles.inputWithPicker}>
        <MultiInviteInput shouldRenderSubmitButton={false} onSelectedEmailsChange={props.onSelectedEmailsChange} />
        <SpacePicker
          className={styles.spacePicker}
          isDisabled={props.isGuestsExceeded}
          onSelectedSpacesChange={props.onSelectedSpacesChange}
        />
      </div>
      {props.error ? renderInviteError(props) : null}
      {props.isInviting ? renderLoadingDots() : renderInviteMessage(props, t)}
      {renderSubmitButton(props, t)}
      {renderGuestsHint(props, t)}
    </>
  );
}

function renderInviteError(props) {
  return <div className={styles.inviteError}>{props.error}</div>;
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} />
    </div>
  );
}

function renderInviteMessage(props, t) {
  return (
    <div className={styles.inviteMessage}>
      <div className={styles.mascot} />
      <div className={styles.inviteMessage}>
        {t(
          'Adding someone as a guest will allow them to take part in one specific project - he will be assigned to the certain project where he’ll be able to contribute to a project. He will be also able to comunicate with the rest of your team, but he won’t rich your other public, neither private projects.'
        )}
      </div>
    </div>
  );
}

function renderSubmitButton(props, t) {
  return (
    <TooltipedDisabledElement
      message={props.tooltipMessage}
      isDisabled={props.isSubmitDisabled}
      className={styles.buttonRight}
    >
      <PrimaryButton isDisabled={props.isSubmitDisabled} onClick={props.onInviteGuests} className={styles.submitButton}>
        {t('Send invitation')}
      </PrimaryButton>
    </TooltipedDisabledElement>
  );
}

function renderGuestsHint(props, t) {
  return (
    <div className={styles.guestHint}>
      <span className={styles.hintHeader}>{t('How many guest can I invite?')}</span>
      <span className={styles.hintText}>
        {t(
          `You have used {{occupiedGuestSeats}} out of {{guestSeatCount}} available guest seats.
The number of guests you can invite is calculated by increasing the number of seats you have already purchuased by {{additionalGuestSeats}}. 
Each project to which you will invite the guest will be considered as one guest seat.`,
          {
            occupiedGuestSeats: props.occupiedGuestSeats,
            guestSeatCount: props.guestSeatCount,
            additionalGuestSeats: ADDITIONAL_GUEST_SEATS,
          }
        )}
      </span>
    </div>
  );
}

export default InviteGuestButton;
