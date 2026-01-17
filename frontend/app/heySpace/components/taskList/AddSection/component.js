import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { doNothing } from 'common/utils';

import UserInput from 'commonComponents/UserInput';

import { useTranslation } from 'i18n';

AddSection.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  selectedPosition: PropTypes.number,
  onCancel: PropTypes.func,
  onAddSection: PropTypes.func,
  onChangeName: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChangePosition: PropTypes.func,
};

AddSection.defaultProps = {
  onCancel: doNothing,
  onAddSection: doNothing,
  onChangeName: doNothing,
  onKeyDown: doNothing,
  onChangePosition: doNothing,
};

function AddSection(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.row}>
        {renderNameInput()}
        {renderPositionInput()}
      </div>
      <div className={styles.buttons}>
        <SecondaryButton
          color={props.color}
          className={styles.cancelButton}
          onClick={props.onCancel}
        >
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={props.color} onClick={props.onAddSection}>
          {t('Add List')}
        </PrimaryButton>
      </div>
    </div>
  );

  function renderNameInput() {
    return (
      <UserInput
        className={styles.nameInput}
        label={t('Name:')}
        value={props.name}
        autoFocus={true}
        onChange={props.onChangeName}
        onKeyDown={props.onKeyDown}
      />
    );
  }

  function renderPositionInput() {
    return (
      <UserInput
        className={styles.positionInput}
        label={t('Position:')}
        value={props.selectedPosition}
        onChange={props.onChangePosition}
        onKeyDown={props.onKeyDown}
        type={'number'}
      />
    );
  }
}

export default AddSection;
