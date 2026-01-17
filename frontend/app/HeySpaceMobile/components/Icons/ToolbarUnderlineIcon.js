import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Path stroke={props.color} fill={'transparent'} d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3" />
      <Rect fill={props.color} height="1" rx="0.5" ry="0.5" width="12" x="3" y="15" />
    </Svg>
  )
}
