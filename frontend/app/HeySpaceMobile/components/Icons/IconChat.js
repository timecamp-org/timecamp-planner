
import React from 'react'
import {
  Svg,
  Path,
} from 'react-native-svg'
import PropTypes from 'prop-types'
import { wisteriaColor } from 'common/commonStyles/colors'

IconChat.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

IconChat.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 20,
    height: 17,
  },
}

export default function IconChat(props) {
  return (
    <Svg style={props.style} viewBox="0 0 20 17">
    	<Path d="M5.456 15.02A5.17 5.17 0 0 1 1.5 9.999V6.666c0-3.3 2.138-5.166 5.169-5.166h6.662c3.176 0 5.169 1.681 5.169 5.166 0 3.42-2.045 5.165-5.169 5.165h-3.33a4.835 4.835 0 0 0-4.545 3.19z" fill={props.color} fillRule="nonzero" strokeWidth="3"/>
    </Svg>
  );
}
