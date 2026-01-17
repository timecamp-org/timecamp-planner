import React from 'react';

import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import InputIcon from 'components/common/InputIcon';
import { useTranslation } from 'i18n';

import styles from './styles.css';

TaskSearch.propTypes = {
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  taskNameInputClass: PropTypes.string,
  taskNameInputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  onTaskCreate: PropTypes.func,
  onSetIsFocused: PropTypes.func,
  onChangeTaskName: PropTypes.func,
  onCancel: PropTypes.func,
  inputRef: PropTypes.func,
  placeholder: PropTypes.string,
};

TaskSearch.defaultProps = {
  taskNameInputValue: '',
  placeholder: '',
  isFocused: false,
  onTaskCreate: doNothing,
  onSetIsFocused: doNothing,
  onChangeTaskName: doNothing,
  onCancel: doNothing,
  inputRef: doNothing,
};

function TaskSearch(props) {
  const { t } = useTranslation();

  return (
    <div
      className={`${props.className || styles.Component} ${props.isFocused ? styles.focused : ''}`}
      onMouseDown={() => props.onSetIsFocused(true)}
    >
      <InputIcon
        className={props.taskNameInputClass || styles.taskNameInput}
        innerClassName={props.innerClassName || styles.taskNameInputInner}
        onSetInnerRef={props.inputRef}
        value={props.taskNameInputValue}
        onKeyDown={props.onKeyDown}
        onChange={props.onChangeTaskName}
        onFocus={() => props.onSetIsFocused(true)}
        placeholder={props.isFocused ? props.placeholder || t('Type task name...') : ''}
      />
      {props.isFocused ? (
        <ButtonBase className={styles.cancelIcon} onClick={props.onCancel}>
          <Xmark size="lg" />
        </ButtonBase>
      ) : null}
    </div>
  );
}

export default React.memo(TaskSearch);
