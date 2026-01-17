import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

ToolbarBoldIcon.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

ToolbarBoldIcon.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 18,
    width: 18,
  },
}

export default function ToolbarBoldIcon(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <Path stroke={props.color} fill={'transparent'} d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z" />
      <Path stroke={props.color} fill={'transparent'} d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z" />
    </Svg>
  )
}
