import React, { FC } from 'react';

import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import styles from '../styles.css';
import { WithColorInterface } from '../types';

import { useTaskArchive } from './useTaskArchive';

export const ArchiveCardModal: FC<WithColorInterface> = ({ color }) => {
  const { t } = useTranslation();
  const { hideArchiveModal, archiveTask } = useTaskArchive();

  return (
    <UniversalModal
      className={styles.modal}
      innerModalDialogClassName={styles.modalDialog}
      isModalOpen
      header={t('ARCHIVE TASK')}
      saveButtonCaption={t('Archive')}
      onBackdropClick={hideArchiveModal}
      onSetIsModalOpen={hideArchiveModal}
      onModalSave={archiveTask}
      color={color}
      shouldFocusOnOpen
      shouldSaveOnEnter
    >
      <div className={styles.confirmationDialogBody}>{t(`Are you sure you want to archive this task?`)}</div>
    </UniversalModal>
  );
};
