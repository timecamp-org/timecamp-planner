import { memo } from 'react';

import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import HoveredUserStatusTooltip from 'commonComponents/HoveredUserStatusTooltip';
import { Exclamation } from 'commonComponents/Icons';
import UserStatusEmoji from 'commonComponents/UserStatusEmoji';
import MessageAttachment from 'components/chat/MessageAttachment';
import MessageConvertedToTaskInfo from 'components/chat/MessageConvertedToTaskInfo';
import MessageReactions from 'components/chat/MessageReactions';
import MessageText from 'components/chat/MessageText';
import PersonFullNameWithPopup from 'components/person/PersonFullNameWithPopup';
import PersonIconWithPopup from 'components/person/PersonIconWithPopup';
import TimeOutput from 'components/time/TimeOutput';
import { i18n } from 'i18n';

import styles from '../styles.css';

const avatarSize = 30;

MessageFresh.propTypes = {
  messageId: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,

  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  editorId: PropTypes.string,
  dateAdded: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  hasMessageError: PropTypes.bool,
  objectId: PropTypes.string.isRequired,

  attachmentsIds: ImmutablePropTypes.list.isRequired,
};

MessageFresh.defaultProps = {
  attachmentsIds: new List(),
};

function MessageFresh(props) {
  return (
    <div className={props.className || styles.freshMessage}>
      <PersonIconWithPopup userId={props.userId} />
      <div className={styles.right}>
        <div className={styles.messageInfo}>
          <HoveredUserStatusTooltip userId={props.userId}>
            <PersonFullNameWithPopup userId={props.userId} />
            <UserStatusEmoji userId={props.userId} className={styles.userStatusEmoji} />
          </HoveredUserStatusTooltip>
          <TimeOutput className={styles.messageAddTime} timestamp={props.dateAdded} format={'HH:mm'} />
        </div>
        <div className={styles.messageContent}>
          {props.attachmentsIds.size > 0 ? (
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

export default memo(MessageFresh);
