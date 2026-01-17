import { useSelector } from 'common/hooks/useSelector';
import UniversalModal from 'commonComponents/UniversalModal';
import BrowseSpacesController from 'components/menu/BrowseSpacesController';
import { useTranslation } from 'i18n';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './styles.css';
const modalType = ModalType.BROWSER_SPACES_MODAL;

const BrowseSpacesModal = () => {
  const [initialProjectName, setInitialProjectName] = useState('');
  const { t } = useTranslation();
  const isOpen = useSelector((state) => selectIsModalOpen(state, { modalType }));
  const dispatch = useDispatch();
  const onClose = () => dispatch(onCloseModal(modalType));

  return (
    <UniversalModal
      isModalOpen={isOpen}
      onBackdropClick={onClose}
      onSetIsModalOpen={onClose}
      header={t('SEARCH FOR A PROJECT')}
      shouldRenderFooter={false}
      modalBodyClassName={styles.modalBody}
    >
      <BrowseSpacesController
        initialProjectName={initialProjectName}
        onUpdateModalProjectName={setInitialProjectName}
        onHideModal={onClose}
      />
    </UniversalModal>
  );
};

export default BrowseSpacesModal;
