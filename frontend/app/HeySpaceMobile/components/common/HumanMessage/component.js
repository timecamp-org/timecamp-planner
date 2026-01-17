import React from 'react'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

import { HumanMessageKinds } from 'models/domain/HumanMessageModel/types'

HumanMessage.propTypes = {
  humanMessage: PropTypes.shape({
    kind: PropTypes.string,
    submessages: PropTypes.object,
    text: PropTypes.string,
    links: PropTypes.array,
  }).isRequired,
  customStyles: PropTypes.object,
}

HumanMessage.defaultProps = {
  customStyles: {},
}

function HumanMessage(props) {
  return (
    <Text
      style={{
        ...styles.defaultStyles,
        ...getTextColor(),
        ...props.customStyles,
      }}
    >
      {props.humanMessage.text}
    </Text>
  )

  function getTextColor() {
    const { kind } = props.humanMessage

    switch (kind) {
      case HumanMessageKinds.error: {
        return styles.error
      }
      case HumanMessageKinds.warning: {
        return styles.warning
      }
      case HumanMessageKinds.success: {
        return styles.success
      }
      default: {
        return null
      }
    }
  }
}

export default HumanMessage
