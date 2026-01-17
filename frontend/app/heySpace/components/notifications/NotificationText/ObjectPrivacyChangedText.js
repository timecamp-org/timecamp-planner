import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'immutable-prop-types'
import styles from './styles.css'

import PersonFullName from 'components/person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { List } from 'immutable'
import { useTranslation } from 'i18n'

ObjectPrivacyChangedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
}

ObjectPrivacyChangedText.defaultProps = {
  activityChanges: new List(),
}

function ObjectPrivacyChangedText(props) {
  const { t } = useTranslation()
  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      <span className={styles.text}>{t('notification| made ')}</span>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.activityChanges.map(renderChange)}
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }

  function renderChange(change, idx) {
    const newValue = change.get('new')
    if (change.get('propertyName') === 'isPrivate') {
      return <div key={idx} className={styles.text}>{newValue ? t('notification|privacy|private') : t('notification|privacy|public')}</div>
    } else {
      return null
    }
  }
}

export default ObjectPrivacyChangedText
