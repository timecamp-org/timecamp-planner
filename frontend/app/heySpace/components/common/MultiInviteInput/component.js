import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import HumanMessage from 'commonComponents/HumanMessage';
import { Delete } from 'commonComponents/Icons';
import { i18mark, i18n } from 'i18n';
import { HumanMessage as HumanMessageModel } from 'models/domain/HumanMessageModel/models';

import styles from './styles.css';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { Button } from '@mui/material';
import { List } from 'immutable';

MultiInviteInput.propTypes = {
  value: PropTypes.string,
  selectedEmails: ImmutablePropTypes.list,
  isSubmitDisabled: PropTypes.bool,
  inputClassName: PropTypes.string,
  inputInnerClassName: PropTypes.string,
  submitButtonLabel: PropTypes.string,
  submitButtonClassName: PropTypes.string,
  placeholder: PropTypes.string,
  shouldRenderSubmitButton: PropTypes.bool,
  error: PropTypes.instanceOf(HumanMessageModel),

  onChangeInput: PropTypes.func,
  onInputBlur: PropTypes.func,
  onAddEmail: PropTypes.func,
  onRemoveEmail: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onInviteMembers: PropTypes.func,
  onSetInputRef: PropTypes.func,
};

MultiInviteInput.defaultProps = {
  value: '',
  isSubmitDisabled: false,
  selectedEmails: new List(),
  submitButtonLabel: i18mark('Send invitation'),
  placeholder: 'User e-mail',
  shouldRenderSubmitButton: true,

  onChangeInput: doNothing,
  onInputBlur: doNothing,
  onAddEmail: doNothing,
  onRemoveEmail: doNothing,
  onInputKeyDown: doNothing,
  onSubmit: doNothing,
  onSetInputRef: doNothing,
};

function MultiInviteInput(props) {
  return (
    <div className={props.className || styles.Component} tabIndex="0">
      <div className={props.inputClassName || styles.inputWrapper}>{renderTagsInput(props)}</div>

      {props.shouldRenderSubmitButton && (
        <div onClick={props.onSubmit} className={styles.submitButtonWrapper}>
          {props.submitButtonRenderer ? props.submitButtonRenderer() : renderSubmitButton(props)}
        </div>
      )}
      {props.error ? renderHumanMessage(props) : null}
    </div>
  );
}

const renderTagsInput = (props) => (
  <TagsInput
    className={props.inputInnerClassName || styles.input}
    value={props.selectedEmails}
    inputValue={props.value}
    onlyUnique={true}
    onChangeInput={props.onChangeInput}
    onChange={props.onAddEmail}
    renderTag={selectedUserRenderer(props)}
    inputProps={{
      placeholder: props.placeholder,
      onKeyDown: props.onInputKeyDown,
      autoFocus: true,
      ref: props.onSetInputRef,
      onBlur: props.onInputBlur,
    }}
  />
);

const renderSubmitButton = (props) => (
  <Button
    variant="outlined"
    size="small"
    disabled={props.isSubmitDisabled}
    className={props.submitButtonClassName || styles.button}
  >
    {i18n.t(props.submitButtonLabel)}
  </Button>
);

const selectedUserRenderer =
  (props) =>
  ({ tag }) =>
    (
      <div key={`Email_${tag}`} className={styles.emailTag} onClick={() => props.onRemoveEmail(tag)}>
        {ellipsizeInTheEnd(tag, 40)}
        <Delete className={styles.deleteIcon} />
      </div>
    );

const renderHumanMessage = (props) => <HumanMessage className={styles.humanMessage} model={props.error} />;

export default MultiInviteInput;
