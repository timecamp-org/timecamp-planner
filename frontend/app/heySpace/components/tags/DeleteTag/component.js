import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Trash } from 'commonComponents/Icons/fontawesome/Trash';
import InfoTooltip from 'commonComponents/InfoTooltip';
import UniversalModal from 'commonComponents/UniversalModal';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const transitionDuration = 100;

DeleteTag.propTypes = {
  isModalOpened: PropTypes.bool,
  isMouseOverButton: PropTypes.bool,
  onOpenModal: PropTypes.func,
  onMouseEnterButton: PropTypes.func,
  onMouseLeaveButton: PropTypes.func,
  onCloseModal: PropTypes.func,
  onDeleteTag: PropTypes.func,
};

DeleteTag.defaultTypes = {
  isModalOpened: false,
  isMouseOverButton: false,
  onMouseEnterButton: doNothing,
  onMouseLeaveButton: doNothing,
  onOpenModal: doNothing,
  onCloseModal: doNothing,
  onDeleteTag: doNothing,
};

function DeleteTag(props) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <InfoTooltip
        shouldRenderInfoTooltip={props.isMouseOverButton}
        popperPlacement={'bottom'}
        targetComponent={
          <SecondaryButton
            onClick={props.onOpenModal}
            className={styles.button}
            onMouseEnter={props.onMouseEnterButton}
            onMouseLeave={props.onMouseLeaveButton}
          >
            <Trash className={styles.icon} />
          </SecondaryButton>
        }
        message={t(`To use our awesome Tags upgrade to Premium!`)}
        transitionDuration={transitionDuration}
      />
      <UniversalModal
        isModalOpen={props.isModalOpened}
        cancelButtonCaption={t('Cancel')}
        saveButtonCaption={t('Delete')}
        header={t('DELETE TAG')}
        onModalSave={props.onDeleteTag}
        onSetIsModalOpen={props.onCloseModal}
        shouldRenderCloseIcon={false}
        footerButtonsColor="error"
      >
        {t('Are you sure you want to delete this tag? This cannot be undone.')}
      </UniversalModal>
    </React.Fragment>
  );
}

export default DeleteTag;
