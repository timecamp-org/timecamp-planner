import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import ObjectName from './NotificationObjectName'
import { getContainerAlias } from './utils'
import { useTranslation } from 'i18n'

NotificationObjectType.propTypes = {
  objectId: PropTypes.string,
  objectType: PropTypes.string,
  objectValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  context: PropTypes.string,
}

function NotificationObjectType(props) {
  const { t } = useTranslation()
  const isLabel = props.taskListId === props.objectId
  if (isLabel) {
    return (
      <Fragment>
        <span className={styles.text}>{getContainerAlias(props.context, 'taskList')}</span>
        <ObjectName objectId={props.objectId} objectValue={props.objectValue} />
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        {props.objectId ?
          <Fragment>
            <span className={styles.text}>{getContainerAlias(props.context, props.objectType)}</span>
            <ObjectName objectId={props.objectId} objectValue={props.objectValue} />
          </Fragment>
          : null}
        {props.taskListId ?
          <Fragment>
            <span className={styles.text}>{t('notification|on')}</span>
            <ObjectName objectId={props.taskListId} objectValue={props.taskListValue} />
          </Fragment>
          : null}
      </Fragment>
    )
  }
}

export default NotificationObjectType
