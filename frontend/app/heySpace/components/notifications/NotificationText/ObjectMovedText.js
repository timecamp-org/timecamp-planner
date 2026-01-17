import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { EntityType } from 'models/domain/EntityModel/types'
import { useTranslation } from 'i18n'

ObjectMovedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  containerId: PropTypes.string,
  containerType: PropTypes.string,
  containerValue: PropTypes.string,
}

function ObjectMovedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      <span className={styles.text}>{t('notification|moved')}</span>
      <span className={styles.text}>{getAlias(props.targetType)}</span>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue}/>
      <span className={styles.text}>{props.targetType === EntityType.TASK_LIST ? t('in') : t('notification|to')}</span>
      <ObjectName objectId={props.containerId} objectValue={props.containerValue}/>
      {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }
}

export default ObjectMovedText
