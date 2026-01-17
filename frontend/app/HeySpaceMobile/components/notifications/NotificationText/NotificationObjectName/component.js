import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { Text, TouchableOpacity } from 'react-native'

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

  return props.isSection ? renderText() : renderCaseClickable()

  function renderCaseClickable() {
    return (
      <TouchableOpacity onPress={props.onClick}>
        {renderText()}
      </TouchableOpacity>
    )
  }

  function renderText() {
    return (
      <Text style={props.isSection ? styles.textElement : styles.navLink} >{props.objectValue}</Text>
    )
  }

}

export default NotificationObjectName
