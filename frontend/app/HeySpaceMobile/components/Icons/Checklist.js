import React from 'react'
import PropTypes from 'prop-types'
import { Svg, G, Path, Rect } from 'react-native-svg'
import { wisteriaColor } from 'common/commonStyles/colors'

Checklist.propTypes = {
  color: PropTypes.string,
  style: PropTypes.object,
}

Checklist.defaultProps = {
  color: wisteriaColor,
  style: {
    height: 18,
    width: 19,
  },
}

export default function Checklist(props) {
  return (
    <Svg style={props.style} viewBox="0 0 19 18">
    	<G fill={props.color} fillRule="nonzero">
    		<Rect height="2.4" width="10" rx="1.2" x="9" y="7"/>
    		<Path d="M1.097 9.893l-.525-.53a.818.818 0 0 1 .001-1.152.807.807 0 0 1 1.146.001l.474.479 2.094-2.114a.803.803 0 0 1 1.143.002.822.822 0 0 1-.002 1.156L3.29 9.893a1.544 1.544 0 0 1-2.193 0z" stroke={props.color} strokeWidth=".3"/>
    		<Rect height="2.4" width="10" rx="1.2" x="9"/>
    		<Path d="M1.097 3.893l-.525-.53a.818.818 0 0 1 .001-1.152.807.807 0 0 1 1.146.001l.474.479L4.287.577A.803.803 0 0 1 5.43.58a.822.822 0 0 1-.002 1.156L3.29 3.893a1.544 1.544 0 0 1-2.193 0z" stroke={props.color} strokeWidth=".3"/>
    		<Rect height="2.4" width="10" rx="1.2" x="9" y="14"/>
    		<Path d="M1.097 16.896l-.523-.526a.821.821 0 0 1 0-1.156.807.807 0 0 1 1.146 0l.473.477 2.094-2.114a.803.803 0 0 1 1.143.002.822.822 0 0 1-.002 1.156l-2.14 2.16a1.544 1.544 0 0 1-2.191.001z" stroke={props.color} strokeWidth=".3"/>
    	</G>
    </Svg>
  )
}
