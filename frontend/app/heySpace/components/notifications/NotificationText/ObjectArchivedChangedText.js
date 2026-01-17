import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'immutable-prop-types'

import PersonFullName from 'components/person/PersonFullName'
import { EntityStatus, EntityType } from 'models/domain/EntityModel/types'

import { List } from 'immutable'
import { useTranslation } from 'i18n'
import ObjectType from './NotificationObjectType'
import ObjectName from './NotificationObjectName'
import styles from './styles.css'
import { isArchivedChange } from './utils';

ObjectArchivedChangedText.propTypes = {
  className: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
}

ObjectArchivedChangedText.defaultProps = {
  activityChanges: new List(),
}

function ObjectArchivedChangedText(props) {
  const { t } = useTranslation()

  // use projectId instead of containerId for task because task container is a list, not the project itself
  const containerId = props.targetType === EntityType.TASK_DATA
    ? props.projectId
    : props.containerId

  return (
    <div className={props.className ? props.className : styles.Component} onClick={props.onClick}>
      {renderUserName()}
      {props.activityChanges.map(renderChange)}
      <ObjectType
        objectId={props.targetId}
        objectType={props.targetType}
        objectValue={props.targetValue}
        taskListId={props.taskListId}
        taskListValue={props.taskListValue}
      />
      {containerId ? <span className={styles.text}>{t(' in ')}</span> : null}
      {containerId ? <ObjectName objectId={containerId} objectValue={props.containerValue} /> : null}
    </div>
  )

  function renderUserName() {
    return <PersonFullName className={styles.userName} userId={props.actorId} />
  }

  function renderChange(change, index) {
    const newValue = change.get('new')

    if (isArchivedChange(change)) {
      const isChangedToArchived = newValue === EntityStatus.ARCHIVED || newValue === true
      return (
        <div
          key={index}
          className={styles.text}
        >
          {isChangedToArchived ? t('notification|archived') : t('notification|unarchived')}
        </div>
      )
    } else {
      return null
    }
  }
}

export default ObjectArchivedChangedText
