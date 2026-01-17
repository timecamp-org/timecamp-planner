import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import SecondaryButton from 'components/buttons/SecondaryButton';
import UniversalModal from 'commonComponents/UniversalModal';
import colorStyles from 'styles/colors.css';
import { useTranslation } from 'i18n';
import HorizontalDivider from 'commonComponents/HorizontalDivider';

ArchiveProjectController.propTypes = {
  className: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isArchived: PropTypes.bool,
  isConfirmationDialogOpen: PropTypes.bool,
  color: PropTypes.string,

  onArchive: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirmArchive: PropTypes.func,
};

ArchiveProjectController.defaultProps = {
  isDisabled: true,
  isArchived: false,
  isConfirmationDialogOpen: false,
  color: colorStyles.wisteriaColor,
  onArchive: doNothing,
  onCancel: doNothing,
  onConfirmArchive: doNothing,
};

function ArchiveProjectController(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className ? props.className : styles.Component}>
      <SecondaryButton onClick={props.onArchive} color={props.color} isDisabled={props.isDisabled}>
        {props.isArchived ? t('Unarchive project') : t('Archive project')}
      </SecondaryButton>
      <UniversalModal
        className={styles.modal}
        innerModalDialogClassName={styles.modalDialog}
        isModalOpen={props.isConfirmationDialogOpen}
        header={props.isArchived ? t('UNARCHIVE PROJECT') : t('ARCHIVE PROJECT')}
        saveButtonCaption={props.isArchived ? t('Unarchive') : t('Archive')}
        onBackdropClick={props.onCancel}
        onSetIsModalOpen={props.onCancel}
        onModalSave={props.isArchived ? props.onUnarchive : props.onConfirmArchive}
        color={props.color}
      >
        <div className={styles.confirmationDialogBody}>
          {t(`Are you sure you want to {{status}} this project?`, {
            status: props.isArchived ? t('question|unarchive') : t('question|archive'),
          })}
          <HorizontalDivider className={styles.divider} />
          <div className={styles.guestWarn}>
            {t(
              'This action will remove from the project all the guests that took part in this project. Note that guests who don’t belong to any project, apart from this one will be deactivated in the workspace entirely.',
            )}
          </div>
        </div>
      </UniversalModal>
    </div>
  );
}

export default ArchiveProjectController;
