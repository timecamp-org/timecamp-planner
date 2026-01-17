import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { ellipsizeInTheEnd } from 'common/utils';
import { i18n } from 'i18n';

import Textarea from 'react-textarea-autosize';

SectionNameIO.propTypes = {
  sectionId: PropTypes.string.isRequired,
  sectionNameInputValue: PropTypes.string,
  isFocused: PropTypes.bool,
  maxLength: PropTypes.number,
  onSetIsFocused: PropTypes.func,
  onChangeSectionName: PropTypes.func,
  onCancel: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
};

SectionNameIO.defaultProps = {
  sectionNameInputValue: '',
  isFocused: false,
  onSetIsFocused: doNothing,
  onChangeSectionName: doNothing,
  onCancel: doNothing,
  onFocus: doNothing,
  onBlur: doNothing,
  onKeyDown: doNothing,
};

function SectionNameIO(props) {
  return (
    <div
      className={`${props.className || styles.Component} ${props.isFocused ? styles.focused : ''}`}
      onClick={() => props.onSetIsFocused(true)}
    >
      {props.isFocused ? renderCaseFocused(props) : renderCaseNotFocused(props)}
    </div>
  );
}

function renderCaseNotFocused(props) {
  const sectionName = props.maxLength
    ? ellipsizeInTheEnd(props.sectionNameInputValue, props.maxLength)
    : props.sectionNameInputValue;
  return <div className={styles.sectionName}>{sectionName}</div>;
}

function renderCaseFocused(props) {
  return (
    <div>
      <Textarea
        maxRows={4}
        className={styles.sectionNameInput}
        value={props.sectionNameInputValue}
        ref={props.inputRef}
        onKeyDown={props.onKeyDown}
        onChange={props.onChangeSectionName}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={i18n.t('Add section name...')}
        autoFocus
      />
    </div>
  );
}

export default memo(SectionNameIO);
