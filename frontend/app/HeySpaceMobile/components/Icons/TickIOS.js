import React from 'react'
import {
  Svg,
  G,
  Polyline,
} from 'react-native-svg'
import PropTypes from 'prop-types'
import { brightBlueColor } from 'common/commonStyles/colors'

TickIOS.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
}

TickIOS.defaultProps = {
  style: {
    width: 22,
    height: 17,
  },
  color: brightBlueColor,
}

export default function TickIOS(props) {
  return (
    <Svg style={props.style} viewBox="0 0 22 17">
      <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round">
        <G transform="translate(-338.000000, -110.000000)" stroke={props.color} strokeWidth="2.8">
          <Polyline points="339 119.504274 344.638941 125.220701 358.964368 111" />
        </G>
      </G>
    </Svg>
  )
}
