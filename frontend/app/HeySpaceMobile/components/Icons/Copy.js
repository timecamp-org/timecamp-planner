
import React from 'react'
import PropTypes from 'prop-types'
import {
  Svg,
  G,
  Path,
  Rect,
} from 'react-native-svg'
import { wisteriaColor } from 'styles/colors'

Copy.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Copy.defaultProps = {
  color: wisteriaColor,
  style: {
    width: 18,
    height: 18,
  },
}

export default function Copy(props) {
  return (
    <Svg viewBox="0 0 18 18" style={props.style}>
    	<G fill="none" fillRule="evenodd" stroke={props.color} strokeLinecap="round" strokeWidth="2.5" transform="translate(2 2)">
    		<Rect height="9.1" width="9.1" rx="2" x="4.9" y="4.9"/>
    		<Path d="M2.1 9.1h-.7A1.4 1.4 0 0 1 0 7.7V1.4A1.4 1.4 0 0 1 1.4 0h6.3a1.4 1.4 0 0 1 1.4 1.4v.7"/>
    	</G>
    </Svg>
  );
}
