import { FC } from 'react';

import UniversalModal from 'commonComponents/UniversalModal';
import AddSpaceController from 'components/menu/AddSpaceController';
import { i18mark, useTranslation } from 'i18n';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.css';

const DEFAULT_HEADER = i18mark('CREATE NEW PROJECT');

interface AddProjectModalInterface {
  header?: string;
  modalType?: ModalType;
  onProjectCreate?: () => void;
}

export const AddProjectModal: FC<AddProjectModalInterface> = ({
  header = DEFAULT_HEADER,
  onProjectCreate,
  modalType = ModalType.ADD_NEW_PROJECT_MODAL,
}) => {
  const { t } = useTranslation();
  const isOpen = useSelector((state) => selectIsModalOpen(state, { modalType }));

  const dispatch = useDispatch();
  const onClose = () => dispatch(onCloseModal(modalType));

  return (
    <UniversalModal
      isModalOpen={isOpen}
      onBackdropClick={onClose}
      onSetIsModalOpen={onClose}
      header={t(header)}
      shouldRenderFooter={false}
      modalBodyClassName={styles.modalBody}
    >
      <AddSpaceController onHideModal={onClose} onProjectCreate={onProjectCreate} />
    </UniversalModal>
  );
};
