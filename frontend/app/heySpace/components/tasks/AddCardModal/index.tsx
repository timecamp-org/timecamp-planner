/* eslint-disable @typescript-eslint/unbound-method */
import { FC } from 'react';

import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';

import CreateCardModalContent from '../CreateCardModalContent';

import useComponent from './hook';
import styles from './styles.css';

const AddCardModal: FC = () => {
  const { t } = useTranslation();
  const { isModalOpen, projectId, shouldAutoAssign, taskCreateSource, onClose, dueDate, startDate, assignees, listId } =
    useComponent();

  return (
    <UniversalModal
      innerModalDialogClassName={styles.Component}
      modalBodyClassName={styles.modalBody}
      headerClassName={styles.modalHeader}
      isModalOpen={isModalOpen}
      header={t('CREATE A TASK')}
      onSetIsModalOpen={onClose}
      shouldFocusOnOpen
      shouldRenderCloseIcon={false}
      shouldRenderSaveButton={false}
      shouldRenderCancelButton={false}
      shouldRenderFooter={false}
    >
      <CreateCardModalContent
        projectId={projectId}
        listId={listId}
        shouldAutoAssign={shouldAutoAssign}
        taskCreateSource={taskCreateSource}
        onClosePopover={onClose}
        initialAssignees={assignees}
        startDate={startDate}
        dueDate={dueDate}
      />
    </UniversalModal>
  );
};

export default AddCardModal;
