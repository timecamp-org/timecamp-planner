import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'immutable-prop-types';
import styles from '../styles.css';

import MessageText from 'components/chat/MessageText';
import MessageReactions from 'components/chat/MessageReactions';
import MessageAttachment from 'components/chat/MessageAttachment';
import TimeOutput from 'components/time/TimeOutput';
import { Exclamation } from 'commonComponents/Icons';
import MessageConvertedToTaskInfo from 'components/chat/MessageConvertedToTaskInfo';
import { i18n } from 'i18n';

MessageContinuation.propTypes = {
  messageId: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  editorId: PropTypes.string,
  dateAdded: PropTypes.number,
  color: PropTypes.string,
  hasMessageError: PropTypes.bool,
  objectId: PropTypes.string.isRequired,

  attachmentsIds: ImmutablePropTypes.list.isRequired,
};

function MessageContinuation(props) {
  return (
    <div className={styles.messageContinuation}>
      {props.isMessageHovered && (
        <TimeOutput className={styles.messageContinuationAddTime} timestamp={props.dateAdded} format={'HH:mm'} />
      )}
      <div className={styles.messageContinuationRight}>
        <div className={styles.messageContent}>
          {props.attachmentsIds.count() > 0 ? (
            <MessageAttachment id={props.attachmentsIds.first()} objectId={props.objectId} />
          ) : (
            <MessageText
              messageId={props.messageId}
              isEdited={props.editorId ? true : false}
              color={props.color}
              isMessageHovered={props.isMessageHovered}
            />
          )}
          {props.hasMessageError ? (
            <span className={styles.error}>
              <Exclamation className={styles.errorIcon} />
              {i18n.t('Message not delivered. Check your internet connection.')}
            </span>
          ) : null}
          {props.messageReactions.size > 0 && <MessageReactions messageId={props.messageId} />}
          {props.taskIdFromMessage ? <MessageConvertedToTaskInfo taskId={props.taskIdFromMessage} /> : null}
        </div>
      </div>
    </div>
  );
}

export default memo(MessageContinuation);
