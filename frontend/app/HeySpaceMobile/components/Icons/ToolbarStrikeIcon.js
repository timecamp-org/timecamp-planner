import React from 'react'
import PropTypes from 'prop-types'
import { Svg, Path, Line } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

ToolbarStrikeIcon.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

ToolbarStrikeIcon.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 18,
    width: 18,
  },
}

export default function ToolbarStrikeIcon(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <Line stroke={props.color} x1="15.5" x2="2.5" y1="8.5" y2="9.5" />
      <Path fill={props.color} d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z" />
      <Path fill={props.color} d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z" />
    </Svg>
  )
}
