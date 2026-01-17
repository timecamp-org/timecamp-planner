import React from 'react';
import { useTranslation } from 'i18n';
import useElementOpen from 'common/hooks/useElementOpen';
import SecondaryButton from 'components/buttons/SecondaryButton';
import UniversalModal from 'commonComponents/UniversalModal';

function DeactivateGuestController(props) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onToggleOpen } = useElementOpen(false);

  return (
    <>
      {renderDeactivateButton(props, t, onOpen)}
      {renderDeactivateUserModal(props, t, isOpen, onToggleOpen)}
    </>
  );
}

function renderDeactivateButton(props, t, onOpen) {
  return <SecondaryButton onClick={onOpen}>{t('Deactivate Guest')}</SecondaryButton>;
}

function renderDeactivateUserModal(props, t, isOpen, onToggleOpen) {
  return (
    <UniversalModal
      isModalOpen={isOpen}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Disable user')}
      header={t(`Remove {{fullName}} from the {{workspaceName}} workspace?`, {
        fullName: props.fullName,
        workspaceName: props.workspaceName,
      })}
      onModalSave={props.onDeactivateGuest}
      onSetIsModalOpen={onToggleOpen}
      shouldRenderCloseIcon={false}
      shouldFocusOnOpen={true}
    >
      {t(
        'All of his projects will be safely drifting in your account and you will be able to bring the user back at anytime.'
      )}
    </UniversalModal>
  );
}

export default DeactivateGuestController;
