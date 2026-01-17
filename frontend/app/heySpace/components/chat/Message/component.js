import { memo } from 'react';

import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import MessageActionButtons from 'components/chat/MessageActionButtons';
import MessageUndeliveredActionButtons from 'components/chat/MessageUndeliveredActionButtons';
import UsersReadList from 'components/chat/UsersReadList';

import MessageDeleteConfirmation from '../MessageDeleteConfirmation';

import useComponent from './hook';
import MessageBeingEdited from './MessageBeingEdited/index';
import ContinuationMessage from './MessageContinuation';
import FreshMessage from './MessageFresh';
import styles from './styles.css';

const emptyList = new List();

Message.propTypes = {
  className: PropTypes.string,

  messageId: PropTypes.string,
  objectId: PropTypes.string,
  color: PropTypes.string,

  isMessageSending: PropTypes.bool,
  hasMessageError: PropTypes.bool,
  isBeingEdited: PropTypes.bool,

  attachmentsIds: ImmutablePropTypes.list,

  innerRef: PropTypes.func,
};

Message.defaultProps = {
  isMessageSending: false,
  hasMessageError: false,
  isBeingEdited: false,

  attachmentsIds: emptyList,

  innerRef: doNothing,
};

function Message(props) {
  const {
    isHovering,
    isMoreOptionsOpen,
    shouldRenderMessageActionButtons,
    onMouseEnter,
    onMouseLeave,
    onClickConvertMessageButton,
    onCloseConvertMessagePopover,
    onOpenMoreOptions,
    onCloseMoreOptions,
  } = useComponent();

  return (
    <div
      ref={props.innerRef}
      className={`${props.className || styles.Component}
        ${props.isConvertToTaskPopoverVisible ? styles.active : ''}
        ${props.isMessageSending || props.hasMessageError ? styles.notSuccessfullySent : ''}
        ${props.isBeingEdited ? styles.isBeingEdited : ''}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {shouldRenderMessageActionButtons && renderMessageActionButtons()}
      {renderMessage()}
      {props.hasMessageError && (
        <MessageUndeliveredActionButtons color={props.color} messageId={props.messageId} objectId={props.objectId} />
      )}
      {props.usersThatReadMessageIds.size > 0 && (
        <UsersReadList objectId={props.objectId} messageId={props.messageId} />
      )}
      <MessageDeleteConfirmation
        hasMessageError={props.hasMessageError}
        key={`${props.messageId}_deleteconfirmation`}
        messageId={props.messageId}
      />
    </div>
  );

  function renderMessage() {
    let result = null;

    if (props.isBeingEdited) {
      result = (
        <MessageBeingEdited
          messageId={props.messageId}
          color={props.color}
          focusNewMessageEditor={props.focusNewMessageEditor}
          onCloseMessageEdit={onMouseLeave}
        />
      );
    } else if (props.isContinuation) {
      result = <ContinuationMessage messageId={props.messageId} color={props.color} isMessageHovered={isHovering} />;
    } else {
      result = <FreshMessage messageId={props.messageId} color={props.color} isMessageHovered={isHovering} />;
    }

    return result;
  }

  function renderMessageActionButtons() {
    const isMessageWithAttachment = props.attachmentsIds.size > 0;
    if (props.isBeingEdited) {
      return null;
    } else if (props.hasMessageError) {
      return null;
    } else {
      return (
        <MessageActionButtons
          containerId={props.objectId}
          color={props.color}
          messageId={props.messageId}
          isMessageWithAttachment={isMessageWithAttachment}
          isMoreOptionsOpen={isMoreOptionsOpen}
          onClickConvertMessageButton={onClickConvertMessageButton}
          onCloseConvertMessagePopover={onCloseConvertMessagePopover}
          onHideMessageActionButtons={onMouseLeave}
          onOpenMoreOptions={onOpenMoreOptions}
          onCloseMoreOptions={onCloseMoreOptions}
        />
      );
    }
  }
}

export default memo(Message);
