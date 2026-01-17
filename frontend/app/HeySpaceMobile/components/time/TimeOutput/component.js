import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import { format } from 'common/utils/dateOperations'
import { View, Text } from 'react-native'

TimeOutput.propTypes = {
  className: PropTypes.string,
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  userTimeFormat: PropTypes.string.isRequired,
  shouldDisplayDate: PropTypes.bool,

  leftText: PropTypes.string,
  rightText: PropTypes.string,
  tabIndex: PropTypes.number,

  onClick: PropTypes.func,
}

TimeOutput.defaultProps = {
  className: undefined,
  shouldDisplayDate: false,

  leftText: '',
  rightText: '',
  tabIndex: undefined,

  onClick: doNothing,
}

function TimeOutput(props) {
  return (
    <View
      style={props.style}
      onPress={props.onClick}
      tabIndex={props.tabIndex}
    >
      {props.leftText.length
        ? <Text>{props.leftText}</Text>
        : null
      }
      <Text>{`${props.shouldDisplayDate ? `${format(props.timestamp, 'MMM DD', { shouldAppendYearIfDifferentThanCurrent: true })} at ` : ''}${format(props.timestamp, props.userTimeFormat)}`}</Text>
      {props.rightText.length
        ? <Text>{props.rightText}</Text>
        : null
      }
    </View>
  )
}

export default TimeOutput
