import { FC, useState } from 'react';

import UniversalModal from 'commonComponents/UniversalModal';
import ListsDropdown from 'components/taskList/ListsDropdown';
import { useTranslation } from 'i18n';

import { useTaskArchive } from '../ArchiveCardModal/useTaskArchive';
import styles from '../styles.css';
import { WithColorInterface } from '../types';

export const MoveAndUnarchiveTaskModal: FC<WithColorInterface> = ({ color }) => {
  const { t } = useTranslation();
  const { hideMoveAndUnarchiveModal, listIds, unarchiveAndChangeList } = useTaskArchive();
  const [selectedListId, onSelectListId] = useState(() => listIds.get(0));
  const onSave = () => unarchiveAndChangeList(selectedListId);

  return (
    <UniversalModal
      isModalOpen
      header={t('Choose List')}
      saveButtonCaption={t('Unarchive')}
      onBackdropClick={hideMoveAndUnarchiveModal}
      onSetIsModalOpen={hideMoveAndUnarchiveModal}
      onModalSave={onSave}
      color={color}
      shouldFocusOnOpen
      shouldSaveOnEnter
    >
      <div className={styles.confirmationDialogBody}>{t(`Unarchive and move to an active list`)}</div>
      <ListsDropdown listIds={listIds} selectedListId={selectedListId} onSelectListId={onSelectListId} />
    </UniversalModal>
  );
};
