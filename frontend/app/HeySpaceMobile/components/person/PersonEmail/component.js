import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'react-native'

PersonFullName.propTypes = {
  userEmail: PropTypes.string.isRequired,
  style: PropTypes.object,
  numberOfLines: PropTypes.number,
  ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
}

PersonFullName.defaultProps = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}

export default function PersonFullName(props) {
  return (
    <Text
      style={props.style}
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
    >
      {props.userEmail}
    </Text>
  )
}
