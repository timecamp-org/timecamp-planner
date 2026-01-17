import { useTranslation } from 'i18n';
import styles from './styles.css';

import PrimaryButton from 'components/buttons/PrimaryButton';
import colorStyles from 'styles/colors.css';
import useElementOpen from '../../../../common/hooks/useElementOpen';
import LoadingDots from '../../common/LoadingDots';
import UniversalModal from '../../common/UniversalModal';
import AddSpaceController from '../../menu/AddSpaceController';

function FirstProjectPlaceholder(props) {
  const { t } = useTranslation();
  const {
    isOpen: isCreateSpaceModalOpened,
    onOpen: onOpenCreateSpaceModal,
    onClose: onCloseCreateSpaceModal,
  } = useElementOpen(false);

  if (props.isLoading) {
    return <LoadingDots className={styles.loadingDots} />;
  } else {
    return (
      <div className={styles.wrapper}>
        <div>
          <div className={styles.mascot} />
          <div className={styles.title}>{t('Hello there!')}</div>
          <div className={styles.subTitle}>
            {t(
              `Looks like you are not a member of any Project. Create one by clicking button below or browse existing projects.`,
            )}
          </div>
          <PrimaryButton onClick={onOpenCreateSpaceModal}>{t('Create Project')}</PrimaryButton>
        </div>
        {renderCreateSpaceModal(isCreateSpaceModalOpened, onCloseCreateSpaceModal, t)}
      </div>
    );
  }
}

function renderCreateSpaceModal(isCreateSpaceModalOpened, onCloseCreateSpaceModal, t) {
  return (
    <UniversalModal
      isModalOpen={isCreateSpaceModalOpened}
      onBackdropClick={onCloseCreateSpaceModal}
      onSetIsModalOpen={onCloseCreateSpaceModal}
      shouldRenderFooter={false}
      header={t('CREATE PROJECT')}
      color={colorStyles.wisteriaColor}
      innerModalDialogClassName={styles.modalDialogBigPadding}
      headerClassName={styles.modalHeader}
    >
      <AddSpaceController onHideModal={onCloseCreateSpaceModal} />
    </UniversalModal>
  );
}

export default FirstProjectPlaceholder;
