import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  Circle,
  G,
  Path,
} from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

Emot.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Emot.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 18,
    height: 18,
  },
}

export default function Emot(props) {
  return (
    <Svg style={props.style} viewBox="0 0 18 18">
      <G fill={props.color} fillRule="nonzero" transform="translate(1 1)">
        <Path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" stroke={props.color} />
        <Circle x="5.5" y="5.5" r="1" />
        <Circle x="10.5" y="5.5" r="1" />
        <Path d="M10.722 9a2.722 2.722 0 1 1-5.444 0H4.5a3.5 3.5 0 0 0 7 0h-.778z" stroke={props.color} />
      </G>
    </Svg>
  );
}
