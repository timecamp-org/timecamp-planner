import React from 'react';

import PropTypes from 'prop-types';

import useElementOpen from 'common/hooks/useElementOpen';
import { doNothing } from 'common/utils';
import UniversalModal from 'commonComponents/UniversalModal';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

LeaveSpaceController.propTypes = {
  projectId: PropTypes.string.isRequired,
  color: PropTypes.string,
  onLeaveSpace: PropTypes.func,
};

LeaveSpaceController.defaultProps = {
  onLeaveSpace: doNothing,
};

function LeaveSpaceController(props) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onToggleOpen } = useElementOpen(false);

  return (
    <>
      <SecondaryButton color={props.color} onClick={onOpen}>
        {t('Leave project')}
      </SecondaryButton>

      {renderModal(props, t, isOpen, onToggleOpen)}
    </>
  );
}

function renderModal(props, t, isOpen, onToggleOpen) {
  return (
    <UniversalModal
      isModalOpen={isOpen}
      modalBodyClassName={styles.modalBody}
      cancelButtonCaption={t('Cancel')}
      saveButtonCaption={t('Leave project')}
      header={t('Leave project')}
      onModalSave={props.onLeaveSpace}
      onSetIsModalOpen={onToggleOpen}
      shouldFocusOnOpen={true}
      color={props.color}
    >
      {t(`Are you sure you want to leave project?`)}
    </UniversalModal>
  );
}

export default LeaveSpaceController;
