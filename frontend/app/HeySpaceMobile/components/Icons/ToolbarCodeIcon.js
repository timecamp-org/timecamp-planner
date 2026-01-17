import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Line, Polyline } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

ToolbarCodeIcon.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

ToolbarCodeIcon.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 18,
    width: 18,
  },
}

export default function ToolbarCodeIcon(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <Polyline stroke={props.color} fill={'transparent'} points="5 7 3 9 5 11" />
      <Polyline stroke={props.color} fill={'transparent'} points="13 7 15 9 13 11" />
      <Line stroke={props.color} x1="10" x2="8" y1="5" y2="13" />
    </Svg>
  )
}
