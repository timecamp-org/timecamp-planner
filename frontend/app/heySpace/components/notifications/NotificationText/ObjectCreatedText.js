import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'
import { useTranslation } from 'i18n'

ObjectCreatedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  taskId: PropTypes.string,
  taskValue: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
}

function ObjectCreatedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      <span className={styles.text}>{t('notification|created new ')}</span>
      <ObjectType
        objectId={props.targetId} 
        objectType={props.targetType}
        objectValue={props.targetValue}
        taskListId={props.taskListId}
        taskListValue={props.taskListValue}
      />
      {props.projectId ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.projectId ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }

}

export default ObjectCreatedText
