import React from 'react';
import PropTypes from 'prop-types';
import SecondaryButton from 'components/buttons/SecondaryButton';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { Copy as CopyIcon } from 'commonComponents/Icons';
import { useTranslation } from 'i18n';
import UniversalModal from 'commonComponents/UniversalModal';
import UserInput from 'commonComponents/UserInput';

DirectInvitationLinkModal.propTypes = {
  className: PropTypes.string,
  userEmail: PropTypes.string.isRequired,
  userInvitationLink: PropTypes.string,
  isModalOpen: PropTypes.bool,

  onCloseModal: PropTypes.func.isRequired,
  onSetIsModalOpen: PropTypes.func.isRequired,
};

DirectInvitationLinkModal.defaultProps = {
  isModalOpen: true,
  userEmail: '',
  userInvitationLink: '',

  onCloseModal: doNothing,
  onSetIsModalOpen: doNothing,
};

function DirectInvitationLinkModal(props) {
  const { t } = useTranslation();
  return (
    <UniversalModal
      innerModalDialogClassName={styles.modal}
      isModalOpen={props.isModalOpen}
      onSetIsModalOpen={props.onSetIsModalOpen}
      shouldRenderCloseIcon={true}
      shouldFocusOnOpen={true}
      shouldRenderCancelButton={false}
      shouldRenderSaveButton={false}
      header={t('Share invitation link')}
    >
      <div className={styles.content}>
        <span>
          {t(
            'You can copy invitation link and send it to {{email}} directly.',
            { email: props.userEmail }
          )}
        </span>
        {renderInputWrapper(props)}
      </div>
    </UniversalModal>
  );
}

function renderInputWrapper(props) {
  return (
    <div className={styles.inputWrapper}>
      <UserInput
        className={styles.invitationUrlInput}
        innerClassName={styles.inputInnter}
        isDisabled={true}
        value={props.userInvitationLink}
        onSetInnerRef={props.onSetInputRef}
      />
      <SecondaryButton className={styles.copyButton} onClick={props.onCopyLink}>
        <CopyIcon />
      </SecondaryButton>
    </div>
  );
}

export default DirectInvitationLinkModal;
