
import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  Circle,
  G,
  Path,
} from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

AtSign2.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

AtSign2.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 18,
    height: 18,
  },
}

export default function AtSign2(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2" transform="translate(1 1)">
        <Circle x="8.381" y="7.619" r="3.048" />
        <Path d="M11.429 4.571v3.81a2.286 2.286 0 0 0 4.571 0v-.762a7.619 7.619 0 1 0-2.987 6.05" />
      </G>
    </Svg>
  )
}
