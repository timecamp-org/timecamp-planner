import React, { memo } from 'react'
import styles from './styles.css'
import UniversalModal from 'commonComponents/UniversalModal'
import PersonFullName from 'components/person/PersonFullName'
import useResendInvitationConfirmationModalHook from './useResendInvitationConfirmationModalHook'
import { useTranslation } from 'i18n'

function ResendInvitationConfirmationModal(props) {
  const { t } = useTranslation()
  const {
    userId,
    isModalOpen,
    onClose,
    onResendInvitation
  } = useResendInvitationConfirmationModalHook()

  return (
    <UniversalModal
      isModalOpen={isModalOpen}
      header={t('Are you sure you want to resend invitation?')}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Resend')}
      onModalSave={onResendInvitation}
      onSetIsModalOpen={onClose}
      shouldRenderCloseIcon={false}
      shouldFocusOnOpen={true}
    >
      <span>{t('Resend invitation to: ')}</span>
      <PersonFullName userId={userId} isUserActive className={styles.fullName} />
    </UniversalModal>
  )
}

export default memo(ResendInvitationConfirmationModal)
