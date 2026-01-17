import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'
import MessageText from 'components/chat/MessageText'
import { useTranslation } from 'i18n'

TaskCreatedFromMessageText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  projectValue: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

TaskCreatedFromMessageText.defaultProps = {
  messageValue: {},
}

function TaskCreatedFromMessageText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <div className={styles.notificationDetails}>
        {renderUserName()}
        <span className={styles.text}>{t('notification|added your message')}</span>
        <ObjectType
          taskListId={props.taskListId}
          taskListValue={props.taskListValue}
        />
        {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
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

export default TaskCreatedFromMessageText
