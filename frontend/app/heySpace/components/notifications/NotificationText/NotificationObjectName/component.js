import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import { doNothing } from 'common/utils'


NotificationObjectName.propTypes = {
  objectId: PropTypes.string.isRequired,
  objectValue: PropTypes.string,
  isSection: PropTypes.bool,
  onClick: PropTypes.func,
}

NotificationObjectName.defaultProps = {
  isSection: false,
  onClick: doNothing,
}

function NotificationObjectName(props) {
  return (
    <div className={props.isSection ? null : styles.navLink} onClick={props.onClick}>
      {props.objectValue}
    </div>
  )
}

export default NotificationObjectName
