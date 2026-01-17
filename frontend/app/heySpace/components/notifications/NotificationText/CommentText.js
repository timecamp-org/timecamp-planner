import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import MessageText from 'components/chat/MessageText'
import { useTranslation } from 'i18n'

CommentText.propTypes = {
  className: PropTypes.string,

  messageId: PropTypes.string.isRequired,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
}

CommentText.defaultProps = {
}

function CommentText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <div className={styles.notificationDetails}>
        {renderUserName()}
        <span className={styles.textElement}>{t('notification|commented on')}</span>
        <span className={styles.textElement}>{getAlias(props.containerType)}</span>
        <ObjectName objectId={props.containerId} objectValue={props.containerValue}/>
        {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
        {':'}
      </div>
      <span className={styles.commentMessage}>
        <MessageText messageId={props.messageId} text={props.messageValue} shouldRenderLinkPreview={false}/>
      </span>
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }
}

export default CommentText
