import React, { memo } from 'react';

import { Id } from 'common/utils/identifier';
import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import useComponent from './hook';
import styles from './styles.css';

type MessageDeleteConfirmationInterface = {
  messageId: Id;
  color?: string;
  hasMessageError?: boolean;
};

const MessageDeleteConfirmation: React.FC<MessageDeleteConfirmationInterface> = ({
  messageId,
  color,
  hasMessageError,
}) => {
  const { t } = useTranslation();
  const { isOpen, onToggleOpen, onDeleteMessage } = useComponent(messageId, hasMessageError);

  return (
    <UniversalModal
      isModalOpen={isOpen}
      backdropClassName={styles.backdrop}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Delete')}
      header={t('DELETE MESSAGE')}
      onModalSave={onDeleteMessage}
      onSetIsModalOpen={onToggleOpen}
      shouldRenderCloseIcon={false}
      color={color}
      shouldFocusOnOpen={true}
      footerButtonsColor="error"
    >
      {t('Are you sure you want to delete this message? This cannot be undone.')}
    </UniversalModal>
  );
};

export default memo(MessageDeleteConfirmation);
