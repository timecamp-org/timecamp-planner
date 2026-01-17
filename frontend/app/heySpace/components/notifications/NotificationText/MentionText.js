import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import EnhanceMentionText from './enhancers/EnhanceMentionText';
import PersonFullName from 'components/person/PersonFullName';
import ObjectName from './NotificationObjectName';
import MessageText from 'components/chat/MessageText';
import { useTranslation } from 'i18n';

MentionText.propTypes = {
  className: PropTypes.string,

  messageId: PropTypes.string.isRequired,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  projectId: PropTypes.string,
  projectValue: PropTypes.string,
  taskId: PropTypes.string,
  taskValue: PropTypes.string,
  isProjectGroupOrDirectChat: PropTypes.bool,
};

MentionText.defaultProps = {
  isProjectGroupOrDirectChat: false,
};

function MentionText(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <div className={styles.notificationDetails}>
        {renderUserName()}
        {props.taskId ? (
          <Fragment>
            <span className={styles.textElement}>{t('notification|mentioned you on task')}</span>
            <ObjectName objectId={props.taskId} objectValue={props.taskValue} />
            <span className={styles.textElement}>{t('in')}</span>
            <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
          </Fragment>
        ) : (
          <Fragment>
            <span className={styles.textElement}>
              {t(`notification|mentioned you in {{targetType}}`, {
                targetType: props.isProjectGroupOrDirectChat ? 'conversation' : 'project',
              })}
            </span>
            <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
          </Fragment>
        )}
        {':'}
      </div>
      <span className={styles.commentMessage}>
        <MessageText messageId={props.messageId} text={props.messageValue} shouldRenderLinkPreview={false} />
      </span>
    </div>
  );

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />;
  }
}

export default EnhanceMentionText(MentionText);
