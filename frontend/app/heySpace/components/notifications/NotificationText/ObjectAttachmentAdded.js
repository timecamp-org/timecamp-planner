import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { getContainerAlias } from './utils'
import { useTranslation } from 'i18n'

ObjectAttachmentAdded.propTypes = {
  className: PropTypes.string,

  fileValue: PropTypes.string.isRequired,
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
}

ObjectAttachmentAdded.defaultProps = {
}

function ObjectAttachmentAdded(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <div className={styles.notificationDetails}>
        {renderUserName()}
        <span className={styles.textElement}>{t('notification|attached')}</span>
        <span className={styles.textElement}>{props.fileValue}</span>
        <span className={styles.textElement}>{t('notification|to')}</span>
        <span className={styles.textElement}>{t(getContainerAlias('from', props.containerType))}</span>
        <ObjectName objectId={props.containerId} objectValue={props.containerValue} />
        {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
      </div>
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }
}


export default ObjectAttachmentAdded
