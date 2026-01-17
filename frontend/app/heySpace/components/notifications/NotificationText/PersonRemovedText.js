import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { getContainerAlias } from './utils'
import { useTranslation } from 'i18n'

PersonRemovedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
}

function PersonRemovedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName(props.actorId)}
      <span className={styles.text}>{t('notification|removed ')}</span>
      {renderUserName(props.targetId)}
      <span className={styles.text}>{t(' from ')}</span>
      <span className={styles.text}>{getContainerAlias('from', props.containerType)}</span>
      <ObjectName objectId={props.containerId} objectValue={props.containerValue} />
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

export default PersonRemovedText
