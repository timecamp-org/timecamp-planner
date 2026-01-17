import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import UserInput from 'commonComponents/UserInput';

import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';

CopySpacePopoverContent.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  isCopyingSpaceDisabled: PropTypes.bool,

  onChangeName: PropTypes.func,
  onCopySpace: PropTypes.func,
  onCancel: PropTypes.func,
  onSetRef: PropTypes.func,
  onKeyDown: PropTypes.func,
};

function CopySpacePopoverContent(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component} ref={props.onSetRef} onKeyDown={props.onKeyDown}>
      <div className={styles.row}>{renderNameInput()}</div>
      <div className={styles.buttons}>
        <SecondaryButton className={styles.cancelButton} color={props.color} onClick={props.onCancel}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={props.color} onClick={props.onCopySpace} isDisabled={props.isCopyingSpaceDisabled}>
          {t('Copy project')}
        </PrimaryButton>
      </div>
    </div>
  );

  function renderNameInput() {
    return (
      <UserInput
        className={styles.nameInput}
        label={t(`Project name:`)}
        value={props.name}
        shouldFocusOnMount
        onChange={props.onChangeName}
        placeholder={t(`Project name:`)}
      />
    );
  }
}

export default CopySpacePopoverContent;
