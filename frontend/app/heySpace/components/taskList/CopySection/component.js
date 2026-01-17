import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import UserInput from 'commonComponents/UserInput';

import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';

CopySection.propTypes = {
  sectionNameValue: PropTypes.string,
  color: PropTypes.string,

  onSectionNameChange: PropTypes.func,
  onCopySection: PropTypes.func,
  onCancel: PropTypes.func,
  onKeyDown: PropTypes.func,
};

function CopySection(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.row}>{renderSectionNameInput()}</div>
      <div className={styles.buttons}>
        <SecondaryButton color={props.color} onClick={props.onCancel}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={props.color} onClick={props.onCopySection}>
          {t('Copy List')}
        </PrimaryButton>
      </div>
    </div>
  );

  function renderSectionNameInput() {
    return (
      <UserInput
        className={styles.sectionInput}
        label={t(`List name:`)}
        value={props.sectionNameValue}
        autoFocus
        onChange={props.onSectionNameChange}
        onKeyDown={props.onKeyDown}
      />
    );
  }
}

export default CopySection;
