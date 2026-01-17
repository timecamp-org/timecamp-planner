import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Line } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

ToolbarUnderlineIcon.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

ToolbarUnderlineIcon.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 18,
    width: 18,
  },
}

export default function ToolbarUnderlineIcon(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <Line stroke={props.color} x1="7" x2="13" y1="4" y2="4" />
      <Line stroke={props.color} x1="5" x2="11" y1="14" y2="14" />
      <Line stroke={props.color} x1="8" x2="10" y1="14" y2="4" />
    </Svg>
  )
}
