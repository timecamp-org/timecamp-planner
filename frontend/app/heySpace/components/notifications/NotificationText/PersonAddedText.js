import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { getContainerAlias } from './utils'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { useTranslation } from 'i18n'

PersonAddedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
}

function PersonAddedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName(props.actorId)}
      <span className={styles.text}>{props.containerType === 'task' ? t('notification|added') : t('notification|invited ')}</span>
      {renderUserName(props.userId)}
      <span className={styles.text}>
        {props.containerType === 'task' ? t('notification|as assignee to ') : t(`notification|to the {{projectStatus}}`, { projectStatus: props.isProjectPrivate ? t('notification|invite|private') : t('notification|invite|public') })}
      </span>
      <span className={styles.text}>{getContainerAlias('from', props.containerType)}</span>
      <ObjectName
        objectType={props.containerType}
        objectId={props.containerId}
        objectValue={props.containerValue}
      />
      {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
    </div>
  )

  function renderUserName(userId) {
    if (props.userId === userId) {
      return <span className={styles.text}>{t('notification| you ')}</span>
    } else {
      return <PersonFullName className={styles.userName} userId={userId} />
    }
  }

}

export default PersonAddedText
