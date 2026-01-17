import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { getContainerAlias } from './utils'

import ObjectName from './NotificationObjectName'
import { useTranslation } from 'i18n'

DueDateReminderText.propTypes = {
  className: PropTypes.string,
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
}

DueDateReminderText.defaultProps = {
}

function DueDateReminderText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      <span className={styles.textElement}>{t('notification|You have upcoming due date')}</span>
      <span className={styles.textElement}>{t(`notification|to {{targetType}}`, { targetType: getContainerAlias('in', props.targetType) })}</span>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.isContainerNameVisible ? <span className={styles.text}>{t(' in ')}</span> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </div>
  )
}

export default DueDateReminderText
